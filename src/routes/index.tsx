import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  CalendarCheck,
  CalendarX,
  BedDouble,
  AlertTriangle,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { nightsBetween } from "@/lib/reservations";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Pousada Ilha do Meio" }] }),
  component: Dashboard,
});

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Dashboard() {
  const { rooms, reservations, audit, sync } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const endMonth = new Date();
  endMonth.setMonth(endMonth.getMonth() + 1);
  const monthEnd = endMonth.toISOString().slice(0, 10);

  const activeRooms = rooms.filter((r) => r.status === "active");
  const occupiedToday = reservations.filter(
    (r) => (r.status === "checked_in" || r.status === "confirmed") && r.checkIn <= today && r.checkOut > today,
  );
  const availableToday = activeRooms.length - occupiedToday.length;
  const occupancyPct = Math.round((occupiedToday.length / activeRooms.length) * 100);

  const checkinsToday = reservations.filter((r) => r.checkIn === today && r.status !== "cancelled");
  const checkoutsToday = reservations.filter((r) => r.checkOut === today && r.status !== "cancelled");

  const monthReservations = reservations.filter(
    (r) => r.status !== "cancelled" && r.checkIn <= monthEnd && r.checkOut >= today,
  );
  const revenueForecast = monthReservations.reduce((sum, r) => sum + r.totalValue, 0);
  const adr =
    monthReservations.length > 0
      ? Math.round(
          monthReservations.reduce((s, r) => s + r.totalValue / nightsBetween(r.checkIn, r.checkOut), 0) /
            monthReservations.length,
        )
      : 0;

  const cancelledCount = reservations.filter((r) => r.status === "cancelled").length;

  const channelBreakdown = reservations.reduce<Record<string, number>>((acc, r) => {
    if (r.status === "cancelled") return acc;
    acc[r.channel] = (acc[r.channel] ?? 0) + 1;
    return acc;
  }, {});

  // 30-day heatmap
  const days: Array<{ date: string; pct: number }> = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const occupied = reservations.filter(
      (r) => r.status !== "cancelled" && r.checkIn <= iso && r.checkOut > iso,
    ).length;
    days.push({ date: iso, pct: Math.round((occupied / activeRooms.length) * 100) });
  }

  const alerts = audit.filter((a) => a.severity !== "info").slice(0, 4);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader
        title="Bom dia, equipe Ilha do Meio"
        description={`Operação de hoje · ${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}`}
        actions={
          <>
            <Button asChild variant="outline"><Link to="/calendario">Calendário</Link></Button>
            <Button asChild><Link to="/reservas/nova"><Plus className="h-4 w-4 mr-1.5" />Nova reserva</Link></Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Ocupação hoje" value={`${occupancyPct}%`} sub={`${occupiedToday.length}/${activeRooms.length} quartos`} icon={<BedDouble className="h-5 w-5" />} />
        <Kpi label="Diária média (ADR)" value={fmtBRL(adr)} sub="próximos 30 dias" icon={<TrendingUp className="h-5 w-5" />} />
        <Kpi label="Receita prevista" value={fmtBRL(revenueForecast)} sub={`${monthReservations.length} reservas`} icon={<ArrowUpRight className="h-5 w-5" />} />
        <Kpi label="Disponíveis hoje" value={`${availableToday}`} sub={`de ${activeRooms.length} ativos`} icon={<CalendarCheck className="h-5 w-5" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl">Próximos 30 dias</CardTitle>
            <Badge variant="secondary">{Math.round(days.reduce((s, d) => s + d.pct, 0) / days.length)}% média</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
              {days.map((d) => (
                <div key={d.date} title={`${new Date(d.date).toLocaleDateString("pt-BR")} · ${d.pct}%`} className="aspect-square rounded-sm border border-border/40" style={{ background: heatColor(d.pct) }} />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-[11px] text-muted-foreground">
              <span>Hoje</span>
              <div className="flex items-center gap-2">
                <span>Baixa</span>
                <div className="flex gap-0.5">
                  {[10, 30, 50, 70, 90].map((p) => (
                    <div key={p} className="h-3 w-3 rounded-sm" style={{ background: heatColor(p) }} />
                  ))}
                </div>
                <span>Alta</span>
              </div>
              <span>+30d</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas operacionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 && <p className="text-sm text-muted-foreground">Sem alertas. Operação tranquila.</p>}
            {alerts.map((a) => (
              <div key={a.id} className="flex gap-3 text-sm border-l-2 pl-3" style={{ borderColor: a.severity === "critical" ? "var(--destructive)" : "var(--warning)" }}>
                <div className="flex-1">
                  <div className="font-medium">{a.action}</div>
                  <div className="text-muted-foreground text-xs">{a.target} · {a.detail}</div>
                </div>
              </div>
            ))}
            <Link to="/auditoria" className="block text-xs text-primary hover:underline pt-2">Ver tudo →</Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-success" />Check-ins de hoje</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold mb-3">{checkinsToday.length}</div>
            <div className="space-y-2 text-sm">
              {checkinsToday.slice(0, 4).map((r) => <Row key={r.id} reservation={r} />)}
              {checkinsToday.length === 0 && <p className="text-muted-foreground text-sm">Nenhum check-in agendado.</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-display text-xl flex items-center gap-2"><CalendarX className="h-5 w-5" />Check-outs de hoje</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold mb-3">{checkoutsToday.length}</div>
            <div className="space-y-2 text-sm">
              {checkoutsToday.slice(0, 4).map((r) => <Row key={r.id} reservation={r} />)}
              {checkoutsToday.length === 0 && <p className="text-muted-foreground text-sm">Nenhum check-out hoje.</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Reservas por canal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(channelBreakdown).sort((a, b) => b[1] - a[1]).map(([ch, n]) => {
              const total = Object.values(channelBreakdown).reduce((s, v) => s + v, 0);
              const pct = Math.round((n / total) * 100);
              return (
                <div key={ch}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{ch}</span>
                    <span className="text-muted-foreground">{n} · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 mt-3 border-t text-xs text-muted-foreground flex justify-between">
              <span>Cancelamentos</span>
              <span>{cancelledCount}</span>
            </div>
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Booking.com sync</span>
              <Badge variant={sync.status === "ok" ? "secondary" : "destructive"} className="text-[10px]">{sync.status}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className="text-muted-foreground">{icon}</span>
        </div>
        <div className="font-display text-3xl font-semibold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-2">{sub}</div>
      </CardContent>
    </Card>
  );
}

function Row({ reservation }: { reservation: import("@/lib/types").Reservation }) {
  const { rooms, guests } = useApp();
  const room = rooms.find((r) => r.id === reservation.roomId);
  const guest = guests.find((g) => g.id === reservation.guestId);
  return (
    <Link to="/reservas/$id" params={{ id: reservation.id }} className="flex items-center justify-between gap-3 py-1.5 hover:text-primary transition-colors">
      <div className="min-w-0">
        <div className="font-medium truncate">{guest?.name ?? "—"}</div>
        <div className="text-xs text-muted-foreground truncate">{room?.name} · {reservation.code}</div>
      </div>
      <Badge variant="outline" className="capitalize text-[10px]">{reservation.channel}</Badge>
    </Link>
  );
}

function heatColor(pct: number) {
  if (pct === 0) return "color-mix(in oklab, var(--muted) 60%, transparent)";
  if (pct < 30) return "color-mix(in oklab, var(--accent) 25%, transparent)";
  if (pct < 60) return "color-mix(in oklab, var(--accent) 55%, transparent)";
  if (pct < 85) return "color-mix(in oklab, var(--primary) 70%, transparent)";
  return "var(--primary)";
}
