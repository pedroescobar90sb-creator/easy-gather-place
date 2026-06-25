import type { Reservation, RoomBlock } from "./types";

/** Intervalos meia-aberta [checkIn, checkOut). */
export function hasOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export interface ConflictResult {
  ok: boolean;
  conflicts: Array<{ type: "reservation" | "block"; id: string; label: string }>;
}

export function checkConflict(opts: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  excludeId?: string;
  reservations: Reservation[];
  blocks: RoomBlock[];
}): ConflictResult {
  const conflicts: ConflictResult["conflicts"] = [];

  for (const r of opts.reservations) {
    if (r.id === opts.excludeId) continue;
    if (r.roomId !== opts.roomId) continue;
    if (r.status === "cancelled" || r.status === "no_show") continue;
    if (hasOverlap(opts.checkIn, opts.checkOut, r.checkIn, r.checkOut)) {
      conflicts.push({ type: "reservation", id: r.id, label: `Reserva ${r.code}` });
    }
  }
  for (const b of opts.blocks) {
    if (b.roomId !== opts.roomId) continue;
    if (hasOverlap(opts.checkIn, opts.checkOut, b.from, b.to)) {
      conflicts.push({
        type: "block",
        id: b.id,
        label: b.reason === "maintenance" ? "Manutenção" : "Bloqueio",
      });
    }
  }
  return { ok: conflicts.length === 0, conflicts };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn + "T00:00:00");
  const b = new Date(checkOut + "T00:00:00");
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000));
}
