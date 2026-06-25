import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Reservation,
  Room,
  Guest,
  RoomBlock,
  Promotion,
  AuditLog,
  SyncState,
} from "./types";
import {
  seedRooms,
  seedGuests,
  seedReservations,
  seedBlocks,
  seedPromotions,
  seedAudit,
  seedSync,
} from "./seed";
import { checkConflict } from "./reservations";
import * as remote from "./remote";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

interface Session {
  authenticated: boolean;
  user: { name: string; role: "admin" | "operacao" } | null;
}

interface AppState {
  session: Session;
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  blocks: RoomBlock[];
  promotions: Promotion[];
  audit: AuditLog[];
  sync: SyncState;

  login: (email: string) => void;
  logout: () => void;

  createReservation: (
    input: Omit<Reservation, "id" | "code" | "createdAt" | "history">,
  ) => { ok: boolean; id?: string; error?: string };
  updateReservation: (
    id: string,
    patch: Partial<Reservation>,
  ) => { ok: boolean; error?: string };
  cancelReservation: (id: string, reason?: string) => void;

  addBlock: (block: Omit<RoomBlock, "id">) => void;
  removeBlock: (id: string) => void;

  upsertPromotion: (promo: Promotion) => void;
  togglePromotion: (id: string) => void;

  pushAudit: (entry: Omit<AuditLog, "id" | "at">) => void;
  reseed: () => void;
  replaceAll: (data: {
    rooms: Room[]; reservations: Reservation[]; guests: Guest[];
    blocks: RoomBlock[]; promotions: Promotion[]; audit: AuditLog[]; sync: SyncState;
  }) => void;
  upsertGuestLocal: (g: Guest) => void;
}


function init() {
  const rooms = seedRooms();
  const guests = seedGuests();
  return {
    rooms,
    guests,
    reservations: seedReservations(rooms, guests),
    blocks: seedBlocks(rooms),
    promotions: seedPromotions(rooms),
    audit: seedAudit(),
    sync: seedSync(),
  };
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      session: { authenticated: false, user: null },
      ...init(),

      login: (email) =>
        set({
          session: {
            authenticated: true,
            user: { name: email.split("@")[0] || "Operador", role: "admin" },
          },
        }),
      logout: () => set({ session: { authenticated: false, user: null } }),

      createReservation: (input) => {
        const state = get();
        const conflict = checkConflict({
          roomId: input.roomId,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          reservations: state.reservations,
          blocks: state.blocks,
        });
        if (!conflict.ok) {
          get().pushAudit({
            actor: "Sistema",
            action: "Conflito prevenido",
            target: state.rooms.find((r) => r.id === input.roomId)?.name ?? input.roomId,
            detail: conflict.conflicts.map((c) => c.label).join(", "),
            severity: "critical",
          });
          return { ok: false, error: conflict.conflicts.map((c) => c.label).join(", ") };
        }
        const id = uid();
        const code = `IDM-${1100 + state.reservations.length}`;
        const reservation: Reservation = {
          ...input,
          id,
          code,
          createdAt: new Date().toISOString().slice(0, 10),
          history: [
            { at: new Date().toISOString(), by: state.session.user?.name ?? "operador", action: "created" },
          ],
        };
        set({ reservations: [...state.reservations, reservation] });
        void remote.pushReservationInsert(reservation).catch(() => {
          // rollback on Supabase conflict (e.g. EXCLUDE constraint)
          set({ reservations: get().reservations.filter((r) => r.id !== id) });
        });
        get().pushAudit({
          actor: state.session.user?.name ?? "operador",
          action: "Reserva criada",
          target: code,
          detail: `Via ${input.channel}`,
          severity: "info",
        });
        return { ok: true, id };
      },

      updateReservation: (id, patch) => {
        const state = get();
        const existing = state.reservations.find((r) => r.id === id);
        if (!existing) return { ok: false, error: "Reserva não encontrada" };
        const checkIn = patch.checkIn ?? existing.checkIn;
        const checkOut = patch.checkOut ?? existing.checkOut;
        const roomId = patch.roomId ?? existing.roomId;
        if (patch.checkIn || patch.checkOut || patch.roomId) {
          const conflict = checkConflict({
            roomId,
            checkIn,
            checkOut,
            excludeId: id,
            reservations: state.reservations,
            blocks: state.blocks,
          });
          if (!conflict.ok) {
            return { ok: false, error: conflict.conflicts.map((c) => c.label).join(", ") };
          }
        }
        const updated: Reservation = {
          ...existing,
          ...patch,
          history: [
            ...existing.history,
            { at: new Date().toISOString(), by: state.session.user?.name ?? "operador", action: "updated" },
          ],
        };
        set({ reservations: state.reservations.map((r) => (r.id === id ? updated : r)) });
        void remote.pushReservationUpdate(id, patch);
        return { ok: true };
      },

      cancelReservation: (id, reason) => {
        const state = get();
        void remote.pushReservationCancel(id);
        set({
          reservations: state.reservations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "cancelled",
                  history: [
                    ...r.history,
                    { at: new Date().toISOString(), by: state.session.user?.name ?? "operador", action: "cancelled", detail: reason },
                  ],
                }
              : r,
          ),
        });
      },

      addBlock: (b) => {
        const block = { ...b, id: uid() };
        set({ blocks: [...get().blocks, block] });
        void remote.pushBlock(block).catch(() => {
          set({ blocks: get().blocks.filter((x) => x.id !== block.id) });
        });
      },
      removeBlock: (id) => {
        void remote.deleteBlock(id);
        set({ blocks: get().blocks.filter((b) => b.id !== id) });
      },

      upsertPromotion: (promo) => {
        const list = get().promotions;
        const exists = list.some((p) => p.id === promo.id);
        const ensured = promo.id ? promo : { ...promo, id: uid() };
        void remote.pushPromotion(ensured);
        set({
          promotions: exists ? list.map((p) => (p.id === ensured.id ? ensured : p)) : [...list, ensured],
        });
      },
      togglePromotion: (id) => {
        const next = get().promotions.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
        set({ promotions: next });
        const updated = next.find((p) => p.id === id);
        if (updated) void remote.pushPromotion(updated);
      },

      pushAudit: (entry) => {
        const log = { ...entry, id: uid(), at: new Date().toISOString() };
        void remote.pushAudit(log);
        set({ audit: [log, ...get().audit].slice(0, 200) });
      },

      reseed: () => set({ ...init() }),
      replaceAll: (data) => set({ ...data }),
      upsertGuestLocal: (g) => {
        const exists = get().guests.some((x) => x.id === g.id);
        set({ guests: exists ? get().guests.map((x) => (x.id === g.id ? g : x)) : [g, ...get().guests] });
      },
    }),
    {
      name: "idm-pms-v1",
      partialize: (s) => ({ session: s.session }),
    },
  ),
);
