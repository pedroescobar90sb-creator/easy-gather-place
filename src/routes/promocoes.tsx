import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/promocoes")({
  head: () => ({ meta: [{ title: "Promoções — Ilha do Meio" }] }),
  component: PromosPage,
});

function PromosPage() {
  const { promotions, rooms, togglePromotion } = useApp();
  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto">
      <PageHeader title="Promoções e ofertas" description="Campanhas conectadas ao motor de reservas direto." />

      <div className="grid md:grid-cols-2 gap-4">
        {promotions.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display text-xl">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.description}</div>
                </div>
                <Switch checked={p.active} onCheckedChange={() => togglePromotion(p.id)} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div><div className="text-muted-foreground">Período</div><div className="font-medium">{new Date(p.from).toLocaleDateString("pt-BR")} → {new Date(p.to).toLocaleDateString("pt-BR")}</div></div>
                <div><div className="text-muted-foreground">Desconto</div><div className="font-display text-lg">{p.discountPct}%</div></div>
                <div><div className="text-muted-foreground">Quartos</div><div className="font-medium">{p.roomIds.length} de {rooms.length}</div></div>
              </div>
              <div className="pt-3 border-t flex justify-between items-baseline">
                <div className="text-xs">
                  <div className="text-muted-foreground">Conversões</div>
                  <div className="font-display text-lg">{p.conversions}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-muted-foreground">Receita gerada</div>
                  <div className="font-display text-lg">{p.revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</div>
                </div>
              </div>
              <Badge variant={p.active ? "default" : "outline"} className="text-[10px]">{p.active ? "Ativa" : "Pausada"}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
