import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  CalendarX,
  BedDouble,
  AlertTriangle,
  Plus,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { checkConflict } from "@/lib/reservations";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Pousada Ilha do Meio" }] }),
  component: Dashboard,
});

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Dashboard() {
  const { rooms, reservations, blocks, promotions, guests } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = today.slice(0, 8) + "01";
  const d2 = new Date(); d2.setMonth(d2.getMonth() + 1); d2.setDate(0);
  const monthEnd = d2.toISOString().slice(0, 10);

  const activeRooms = rooms.filter((r) => r.status === "active");
  const occupiedToday = reservations.filter(
    (r) => (r.status === "checked_in" || r.status === "confirmed") && r.checkIn <= today && r.checkOut > today,
  );
  const availableToday = activeRooms.length - occupiedToday.length;
  const occupancyPct = activeRooms.length ? Math.round((occupiedToday.length / activeRooms.length) * 100) : 0;

  const checkinsToday = reservations.filter((r) => r.checkIn === today && r.status !== "cancelled");
  const checkoutsToday = reservations.filter((r) => r.checkOut === today && r.status !== "cancelled");

  const monthReservations = reservations.filter(
    (r) => r.status !== "cancelled" && r.checkIn <= monthEnd && r.checkOut >= monthStart,
  );
  const revenueForecast = monthReservations.reduce((sum, r) => sum + r.totalValue, 0);

  // Booking vs direta
  const nonCancelled = reservations.filter((r) => r.status !== "cancelled");
  const bookingCount = nonCancelled.filter((r) => r.channel === "booking").length;
  const diretoCount = nonCancelled.filter((r) => r.channel === "direto" || r.channel === "site" || r.channel === "whatsapp" || r.channel === "instagram").length;
  const totalCh = bookingCount + diretoCount || 1;
  const bookingPct = Math.round((bookingCount / totalCh) * 100);
  const diretoPct = 100 - bookingPct;

  // 7 dias com destaque para dias fracos
  const days: Array<{ date: string; pct: number; weak: boolean }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const occ = reservations.filter((r) => r.status !== "cancelled" && r.checkIn <= iso && r.checkOut > iso).length;
    const pct = activeRooms.length ? Math.round((occ / activeRooms.length) * 100) : 0;
    days.push({ date: iso, pct, weak: pct < 50 });
  }
  const weakDays = days.filter((d) => d.weak).length;

  // Conflitos / risco overbooking
  const conflicts: Array<{ label: string; detail: string }> = [];
  for (const r of nonCancelled) {
    const c = checkConflict({ roomId: r.roomId, checkIn: r.checkIn, checkOut: r.checkOut, excludeId: r.id, reservations: nonCancelled, blocks });
    if (!c.ok) {
      const room = rooms.find((x) => x.id === r.roomId);
      conflicts.push({ label: `${room?.name ?? "Quarto"} · ${r.code}`, detail: c.conflicts.map((x) => x.label).join(", ") });
    }
  }

  const activePromo = promotions.find((p) => p.active);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader
        title="Operação de hoje"
        description={new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        actions={
          <>
            <Button asChild variant="outline"><Link to="/calendario">Calendário</Link></Button>
            <Button asChild><Link to="/reservas/nova"><Plus className="h-4 w-4 mr-1.5" />Nova reserva</Link></Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Ocupação hoje" value={`${occupancyPct}%`} sub={`${occupiedToday.length}/${activeRooms.length} quartos`} icon={<BedDouble className="h-5 w-5" />} />
        <Kpi label="Livres hoje" value={`${availableToday}`} sub="prontos pra vender" icon={<BedDouble className="h-5 w-5" />} />
        <Kpi label="Check-ins hoje" value={`${checkinsToday.length}`} sub="chegadas previstas" icon={<CalendarCheck className="h-5 w-5" />} />
        <Kpi label="Check-outs hoje" value={`${checkoutsToday.length}`} sub="saídas previstas" icon={<CalendarX className="h-5 w-5" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl">Próximos 7 dias</CardTitle>
            {weakDays > 0 ? (
              <Badge variant="destructive" className="gap-1"><TrendingDown className="h-3 w-3" />{weakDays} {weakDays === 1 ? "dia fraco" : "dias fracos"}</Badge>
            ) : (
              <Badge variant="secondary">Ocupação saudável</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const date = new Date(d.date + "T00:00:00");
                return (
                  <div key={d.date} className={`rounded-md border p-3 text-center ${d.weak ? "border-destructive/40 bg-destructive/5" : "border-border"}`}>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{date.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
                    <div className="font-display text-lg mt-1">{date.getDate()}</div>
                    <div className={`text-xs mt-1 ${d.weak ? "text-destructive font-medium" : "text-muted-foreground"}`}>{d.pct}%</div>
                  </div>
                );
              })}
            </div>
            {weakDays > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-md bg-muted/50 p-3 text-sm">
                <span className="text-muted-foreground">Considere ativar uma promoção para os dias fracos.</span>
                <Button asChild size="sm" variant="outline"><Link to="/promocoes">Ver promoções</Link></Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conflicts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem conflitos. Operação tranquila.</p>
            ) : (
              conflicts.slice(0, 4).map((c, i) => (
                <div key={i} className="border-l-2 border-destructive pl-3 text-sm">
                  <div className="font-medium">Risco de overbooking</div>
                  <div className="text-xs text-muted-foreground">{c.label} — {c.detail}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-display text-xl">Receita prevista do mês</CardTitle></CardHeader>
          <CardContent>
            <div className="font-display text-4xl font-semibold">{fmtBRL(revenueForecast)}</div>
            <div className="text-xs text-muted-foreground mt-2">{monthReservations.length} reservas neste mês</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-xl">Booking.com vs Direta</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <ChannelBar label="Booking.com" pct={bookingPct} count={bookingCount} tone="muted" />
            <ChannelBar label="Reserva direta" pct={diretoPct} count={diretoCount} tone="primary" />
            {bookingPct > 60 && (
              <p className="text-xs text-warning pt-2">Alta dependência do Booking.com. Reforce reserva direta.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Promoção ativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePromo ? (
              <>
                <div className="font-display text-lg">{activePromo.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{activePromo.description}</div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge>-{activePromo.discountPct}%</Badge>
                  <span className="text-xs text-muted-foreground">{activePromo.conversions} conversões</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Nenhuma promoção ativa.</p>
                <Button asChild size="sm" variant="outline" className="mt-3"><Link to="/promocoes">Criar promoção</Link></Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {(checkinsToday.length > 0 || checkoutsToday.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {checkinsToday.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-success" />Check-ins de hoje</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {checkinsToday.map((r) => {
                  const room = rooms.find((x) => x.id === r.roomId);
                  const guest = guests.find((g) => g.id === r.guestId);
                  return (
                    <Link key={r.id} to="/reservas/$id" params={{ id: r.id }} className="flex justify-between text-sm py-1.5 hover:text-primary">
                      <span className="font-medium">{guest?.name ?? "—"}</span>
                      <span className="text-muted-foreground">{room?.name} · {r.code}</span>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}
          {checkoutsToday.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><CalendarX className="h-5 w-5" />Check-outs de hoje</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {checkoutsToday.map((r) => {
                  const room = rooms.find((x) => x.id === r.roomId);
                  const guest = guests.find((g) => g.id === r.guestId);
                  return (
                    <Link key={r.id} to="/reservas/$id" params={{ id: r.id }} className="flex justify-between text-sm py-1.5 hover:text-primary">
                      <span className="font-medium">{guest?.name ?? "—"}</span>
                      <span className="text-muted-foreground">{room?.name} · {r.code}</span>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
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

function ChannelBar({ label, pct, count, tone }: { label: string; pct: number; count: number; tone: "primary" | "muted" }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">{count} · {pct}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${tone === "primary" ? "bg-primary" : "bg-muted-foreground/40"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
