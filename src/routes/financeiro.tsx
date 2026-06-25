import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — Ilha do Meio" }] }),
  component: FinancePage,
});

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function FinancePage() {
  const { reservations } = useApp();
  const active = reservations.filter((r) => r.status !== "cancelled");
  const totalRevenue = active.reduce((s, r) => s + r.totalValue, 0);
  const pending = reservations.filter((r) => r.paymentStatus === "pending").reduce((s, r) => s + r.totalValue, 0);
  const paid = reservations.filter((r) => r.paymentStatus === "paid").reduce((s, r) => s + r.totalValue, 0);
  const lost = reservations.filter((r) => r.status === "cancelled").reduce((s, r) => s + r.totalValue, 0);

  const byChannel = active.reduce<Record<string, { count: number; revenue: number }>>((acc, r) => {
    acc[r.channel] = acc[r.channel] || { count: 0, revenue: 0 };
    acc[r.channel].count++;
    acc[r.channel].revenue += r.totalValue;
    return acc;
  }, {});

  const bookingRevenue = byChannel.booking?.revenue ?? 0;
  const directRevenue = (byChannel.direto?.revenue ?? 0) + (byChannel.site?.revenue ?? 0) + (byChannel.whatsapp?.revenue ?? 0) + (byChannel.telefone?.revenue ?? 0);
  const commissionSaved = directRevenue * 0.15;

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <PageHeader title="Financeiro" description="Receita por canal e comissão evitada com reservas diretas." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Receita prevista" value={fmt(totalRevenue)} />
        <Kpi label="Pagamentos confirmados" value={fmt(paid)} />
        <Kpi label="Pendentes" value={fmt(pending)} />
        <Kpi label="Perdido (cancelamentos)" value={fmt(lost)} muted />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display text-xl mb-4">Receita por canal</h3>
            <div className="space-y-4">
              {Object.entries(byChannel).sort((a, b) => b[1].revenue - a[1].revenue).map(([ch, data]) => {
                const pct = Math.round((data.revenue / totalRevenue) * 100);
                return (
                  <div key={ch}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium">{ch}</span>
                      <span>{fmt(data.revenue)} <span className="text-muted-foreground">· {data.count} reservas</span></span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="text-xs uppercase tracking-wider opacity-70">Comissão evitada</div>
            <div className="font-display text-5xl font-semibold mt-2">{fmt(commissionSaved)}</div>
            <div className="text-sm opacity-80 mt-2">
              Estimado em 15% sobre receita de canais diretos no período analisado.
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-primary-foreground/20">
              <div>
                <div className="text-xs opacity-70">Direto</div>
                <div className="font-display text-xl">{fmt(directRevenue)}</div>
              </div>
              <div>
                <div className="text-xs opacity-70">Booking.com</div>
                <div className="font-display text-xl">{fmt(bookingRevenue)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <Card><CardContent className="p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-3xl mt-2 ${muted ? "text-muted-foreground" : ""}`}>{value}</div>
    </CardContent></Card>
  );
}
