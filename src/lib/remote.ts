import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Loose alias for INSERT/UPDATE/DELETE — typing Insert payloads manually
// against zero-config supabase-js helpers is brittle, and we already validate
// shapes through our mappers.
const supabase = supabaseTyped as unknown as {
  from: (t: string) => {
    select: (q?: string) => any;
    insert: (v: any) => any;
    update: (v: any) => any;
    delete: () => any;
    upsert: (v: any) => any;
  };
};
import type {
  Room, Guest, Reservation, RoomBlock, Promotion, AuditLog, SyncState,
} from "./types";

type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
type GuestRow = Database["public"]["Tables"]["guests"]["Row"];
type ResRow = Database["public"]["Tables"]["reservations"]["Row"];
type EventRow = Database["public"]["Tables"]["reservation_events"]["Row"];
type BlockRow = Database["public"]["Tables"]["room_blocks"]["Row"];
type PromoRow = Database["public"]["Tables"]["promotions"]["Row"];
type AuditRow = Database["public"]["Tables"]["audit_logs"]["Row"];
type SyncRow = Database["public"]["Tables"]["sync_state"]["Row"];

// ---------- mappers ----------
const asText = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const asTextArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map((item) => asText(item).trim()).filter(Boolean)
    : [];

export const mapRoom = (r: RoomRow): Room => ({
  id: asText(r.id),
  code: asText(r.code),
  name: asText(r.name, "Quarto"),
  type: asText(r.type, "duplo_casal") as Room["type"],
  capacity: Number(r.capacity) || 1,
  basePrice: Number(r.base_price) || 0,
  status: asText(r.status, "active") as Room["status"],
  amenities: asTextArray(r.amenities),
  image: asText(r.image),
  description: asText(r.description),
});

export const mapGuest = (g: GuestRow): Guest => ({
  id: g.id, name: g.name, email: g.email ?? "", phone: g.phone ?? "",
  document: g.document ?? undefined, tags: g.tags ?? [],
  notes: g.notes ?? undefined, createdAt: g.created_at.slice(0, 10),
});

export const mapReservation = (r: ResRow, events: EventRow[] = []): Reservation => ({
  id: r.id, code: r.code, roomId: r.room_id, guestId: r.guest_id,
  checkIn: r.check_in, checkOut: r.check_out, guests: r.guests, channel: r.channel,
  status: r.status, paymentStatus: r.payment_status, totalValue: Number(r.total_value),
  notes: r.notes ?? undefined, externalRef: r.external_ref ?? undefined,
  createdAt: r.created_at.slice(0, 10),
  history: events
    .filter((e) => e.reservation_id === r.id)
    .map((e) => ({ at: e.at, by: e.by_user ?? "sistema", action: e.action, detail: e.detail ?? undefined })),
});

export const mapBlock = (b: BlockRow): RoomBlock => ({
  id: b.id, roomId: b.room_id, from: b.from_date, to: b.to_date,
  reason: b.reason, note: b.note ?? undefined,
});

export const mapPromotion = (p: PromoRow): Promotion => ({
  id: p.id, name: p.name, description: p.description ?? "",
  from: p.from_date, to: p.to_date, discountPct: Number(p.discount_pct),
  roomIds: p.room_ids ?? [], active: p.active,
  conversions: p.conversions, revenue: Number(p.revenue),
});

export const mapAudit = (a: AuditRow): AuditLog => ({
  id: a.id, at: a.at, actor: a.actor, action: a.action,
  target: a.target, detail: a.detail ?? undefined, severity: a.severity,
});

export const mapSync = (s: SyncRow | null): SyncState => ({
  channel: "booking",
  status: (s?.status as SyncState["status"]) ?? "ok",
  lastSync: s?.last_sync ?? new Date().toISOString(),
  importedCount: s?.imported_count ?? 0,
  errors: s?.errors ?? 0,
});

// ---------- fetch all ----------
export async function fetchAll() {
  const [rooms, guests, reservations, events, blocks, promotions, audit, sync] = await Promise.all([
    supabase.from("rooms" as never).select("*").order("code"),
    supabase.from("guests" as never).select("*").order("created_at", { ascending: false }),
    supabase.from("reservations" as never).select("*").order("check_in"),
    supabase.from("reservation_events" as never).select("*").order("at"),
    supabase.from("room_blocks" as never).select("*"),
    supabase.from("promotions" as never).select("*"),
    supabase.from("audit_logs" as never).select("*").order("at", { ascending: false }).limit(200),
    supabase.from("sync_state" as never).select("*").eq("channel", "booking").maybeSingle(),
  ]);

  const err = [rooms.error, guests.error, reservations.error, events.error, blocks.error, promotions.error, audit.error, sync.error].find(Boolean);
  if (err) throw err;

  return {
    rooms: (rooms.data ?? []).map(mapRoom),
    guests: (guests.data ?? []).map(mapGuest),
    reservations: (reservations.data ?? []).map((r: any) => mapReservation(r, events.data ?? [])),
    blocks: (blocks.data ?? []).map(mapBlock),
    promotions: (promotions.data ?? []).map(mapPromotion),
    audit: (audit.data ?? []).map(mapAudit),
    sync: mapSync(sync.data ?? null),
  };
}

// ---------- mutations (fire-and-forget from store) ----------
function logError(ctx: string, err: unknown) {
  console.error(`[supabase:${ctx}]`, err);
}

export async function pushReservationInsert(r: Reservation) {
  const { error } = await supabase.from("reservations" as never).insert({
    id: r.id, code: r.code, room_id: r.roomId, guest_id: r.guestId,
    check_in: r.checkIn, check_out: r.checkOut, guests: r.guests, channel: r.channel,
    status: r.status, payment_status: r.paymentStatus, total_value: r.totalValue,
    notes: r.notes ?? null, external_ref: r.externalRef ?? null,
  });
  if (error) { logError("reservation.insert", error); throw error; }
}

export async function pushReservationUpdate(id: string, patch: Partial<Reservation>) {
  const map: Record<string, unknown> = {};
  if (patch.roomId) map.room_id = patch.roomId;
  if (patch.guestId) map.guest_id = patch.guestId;
  if (patch.checkIn) map.check_in = patch.checkIn;
  if (patch.checkOut) map.check_out = patch.checkOut;
  if (patch.guests) map.guests = patch.guests;
  if (patch.channel) map.channel = patch.channel;
  if (patch.status) map.status = patch.status;
  if (patch.paymentStatus) map.payment_status = patch.paymentStatus;
  if (patch.totalValue !== undefined) map.total_value = patch.totalValue;
  if (patch.notes !== undefined) map.notes = patch.notes;
  const { error } = await supabase.from("reservations" as never).update(map).eq("id", id);
  if (error) { logError("reservation.update", error); throw error; }
}

export async function pushReservationCancel(id: string) {
  const { error } = await supabase.from("reservations" as never).update({ status: "cancelled" }).eq("id", id);
  if (error) logError("reservation.cancel", error);
}

export async function pushGuest(g: Guest) {
  const { error } = await supabase.from("guests" as never).upsert({
    id: g.id, name: g.name, email: g.email || null, phone: g.phone || null,
    document: g.document ?? null, tags: g.tags, notes: g.notes ?? null,
  });
  if (error) { logError("guest.upsert", error); throw error; }
}

export async function pushBlock(b: RoomBlock) {
  const { error } = await supabase.from("room_blocks" as never).insert({
    id: b.id, room_id: b.roomId, from_date: b.from, to_date: b.to,
    reason: b.reason, note: b.note ?? null,
  });
  if (error) { logError("block.insert", error); throw error; }
}

export async function deleteBlock(id: string) {
  const { error } = await supabase.from("room_blocks" as never).delete().eq("id", id);
  if (error) logError("block.delete", error);
}

export async function pushPromotion(p: Promotion) {
  const { error } = await supabase.from("promotions" as never).upsert({
    id: p.id, name: p.name, description: p.description, from_date: p.from, to_date: p.to,
    discount_pct: p.discountPct, room_ids: p.roomIds, active: p.active,
    conversions: p.conversions, revenue: p.revenue,
  });
  if (error) logError("promotion.upsert", error);
}

export async function pushAudit(a: AuditLog) {
  const { error } = await supabase.from("audit_logs" as never).insert({
    id: a.id, actor: a.actor, action: a.action, target: a.target,
    detail: a.detail ?? null, severity: a.severity,
  });
  if (error) logError("audit.insert", error);
}
