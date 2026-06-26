import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { hasOverlap } from "@/lib/reservations";

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [{ title: "Calendário mestre — Ilha do Meio" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const { rooms, reservations, blocks, guests } = useApp();
  const safeRooms = Array.isArray(rooms) ? rooms.filter((room) => room && typeof room === "object") : [];
  const safeReservations = Array.isArray(reservations) ? reservations.filter((reservation) => reservation && typeof reservation === "object") : [];
  const safeBlocks = Array.isArray(blocks) ? blocks.filter((block) => block && typeof block === "object") : [];
  const safeGuests = Array.isArray(guests) ? guests.filter((guest) => guest && typeof guest === "object") : [];
  const [anchor, setAnchor] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d;
  });
  const [days, setDays] = useState(21);

  const dates = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(anchor);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [anchor, days]);

  const todayISO = new Date().toISOString().slice(0, 10);

  const shift = (n: number) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + n);
    setAnchor(d);
  };

  const formatRoomNumber = (code: unknown) => {
    const value = String(code ?? "").trim();
    if (!value) return "—";
    const numeric = Number(value);
    return Number.isFinite(numeric) ? String(numeric).padStart(2, "0") : value;
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <PageHeader
        title="Calendário mestre"
        description="Visão única de inventário. Esta é a fonte de verdade da operação."
        actions={
          <>
            <div className="flex rounded-md border bg-card">
              <Button variant="ghost" size="sm" onClick={() => shift(-7)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => { const d = new Date(); d.setDate(d.getDate()-2); setAnchor(d); }}>Hoje</Button>
              <Button variant="ghost" size="sm" onClick={() => shift(7)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex rounded-md border bg-card text-xs">
              {[7, 14, 21, 30].map((n) => (
                <button key={n} onClick={() => setDays(n)} className={`px-3 py-1.5 ${days === n ? "bg-primary text-primary-foreground" : ""}`}>{n}d</button>
              ))}
            </div>
            <Button asChild><Link to="/reservas/nova"><Plus className="h-4 w-4 mr-1.5" />Nova reserva</Link></Button>
          </>
        }
      />

      <Legend />

      <div className="border rounded-lg bg-card overflow-x-auto mt-4">
        <div className="min-w-max">
          {/* Header row */}
          <div className="grid sticky top-0 bg-card z-10 border-b" style={{ gridTemplateColumns: `200px repeat(${days}, minmax(40px, 1fr))` }}>
            <div className="px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-r">Quarto</div>
            {dates.map((d) => {
              const iso = d.toISOString().slice(0, 10);
              const isToday = iso === todayISO;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div key={iso} className={`px-1 py-2 text-center text-[10px] border-r ${isToday ? "bg-accent/20 font-semibold" : ""} ${isWeekend ? "bg-muted/40" : ""}`}>
                  <div className="uppercase text-muted-foreground">{d.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3)}</div>
                  <div className="font-display text-base">{d.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Room rows */}
          {safeRooms.map((room) => {
            const roomNumber = formatRoomNumber(room.code);
            const roomRes = safeReservations.filter((r) => r.roomId === room.id && r.status !== "cancelled");
            const roomBlocks = safeBlocks.filter((b) => b.roomId === room.id);
            return (
              <div key={room.id} className="grid border-b hover:bg-muted/30 relative" style={{ gridTemplateColumns: `200px repeat(${days}, minmax(40px, 1fr))` }}>
                <div className="border-r bg-card px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-14 shrink-0 place-items-center rounded-md border border-primary/35 bg-primary text-primary-foreground shadow-sm">
                      <span className="font-sans text-2xl font-black leading-none tracking-normal tabular-nums">{roomNumber}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Quarto</div>
                      <div className="text-sm font-semibold leading-tight truncate">{String(room.name ?? `Quarto ${roomNumber}`)}</div>
                      <div className="text-[10px] text-muted-foreground">{Number(room.capacity) || 1} hóspedes</div>
                    </div>
                  </div>
                </div>
                {dates.map((d, di) => {
                  const iso = d.toISOString().slice(0, 10);
                  const nextIso = new Date(d.getTime() + 86400000).toISOString().slice(0, 10);
                  const res = roomRes.find((r) => hasOverlap(iso, nextIso, r.checkIn, r.checkOut));
                  const block = roomBlocks.find((b) => hasOverlap(iso, nextIso, b.from, b.to));

                  let stateClass = "state-available";
                  let label = "";
                  let title = "";
                  if (block) {
                    stateClass = block.reason === "maintenance" ? "state-maintenance" : "state-blocked";
                    title = `Quarto ${room.code} — ${block.reason === "maintenance" ? "Manutenção" : "Bloqueado"}${block.note ? `: ${block.note}` : ""}`;
                  } else if (res) {
                    if (res.checkIn === iso) stateClass = "state-checkin";
                    else if (res.checkOut === iso) stateClass = "state-checkout";
                    else stateClass = "state-booked";
                    const g = safeGuests.find((x) => x.id === res.guestId);
                    label = g?.name ?? "Reserva";
                    title = `Quarto ${roomNumber} · ${g?.name ?? "Hóspede"}${g?.phone ? ` · ${g.phone}` : ""} · ${res.checkIn} → ${res.checkOut} · ${res.guests}p · ${res.code}`;
                  }

                  return (
                    <div key={iso} title={title} className={`cal-cell-base border-b-0 ${stateClass} ${room.status === "inactive" ? "opacity-40" : ""}`}>
                      {res ? (
                        <Link to="/reservas/$id" params={{ id: res.id }} className="absolute inset-0 flex items-center justify-center px-1 text-[10px] font-medium truncate hover:ring-2 hover:ring-accent">
                          <span className="truncate">{di === 0 || res.checkIn === iso ? label : ""}</span>
                        </Link>
                      ) : block ? (
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] uppercase opacity-70">
                          {di === 0 || block.from === iso ? (block.reason === "maintenance" ? "Manut." : "Bloq.") : ""}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Toda reserva passa por validação central antes de ser salva. Conflitos são impedidos antes do erro acontecer.
      </p>
    </div>
  );
}

function Legend() {
  const items: Array<{ label: string; cls: string }> = [
    { label: "Disponível", cls: "state-available" },
    { label: "Reservado", cls: "state-booked" },
    { label: "Check-in", cls: "state-checkin" },
    { label: "Check-out", cls: "state-checkout" },
    { label: "Manutenção", cls: "state-maintenance" },
    { label: "Bloqueado", cls: "state-blocked" },
    { label: "Conflito", cls: "state-conflict" },
  ];
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5">
          <div className={`h-4 w-6 rounded-sm border ${i.cls}`} />
          <span className="text-muted-foreground">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
