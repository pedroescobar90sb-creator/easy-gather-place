import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/integracoes")({
  head: () => ({ meta: [{ title: "Integrações — Ilha do Meio" }] }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const { sync, reservations, audit, pushAudit } = useApp();
  const bookingRes = reservations.filter((r) => r.channel === "booking");
  const syncEvents = audit.filter((a) => a.target.toLowerCase().includes("booking"));

  const runSync = () => {
    toast.loading("Sincronizando com Booking.com…", { id: "sync" });
    setTimeout(() => {
      pushAudit({ actor: "Booking.com", action: "Sincronização manual", target: "Booking.com", detail: "Inventário e disponibilidade atualizados", severity: "info" });
      toast.success("Sincronização concluída", { id: "sync", description: "0 conflitos, 0 erros." });
    }, 1200);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto">
      <PageHeader title="Integrações · Channel Manager" description="Booking.com como canal externo. Inventário central é a fonte de verdade." />

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-start">
              <div className="h-12 w-12 rounded-lg bg-[#003580] text-white flex items-center justify-center font-bold text-lg">B</div>
              <div>
                <div className="font-display text-2xl">Booking.com</div>
                <div className="text-sm text-muted-foreground">Sincronização bidirecional de disponibilidade · {bookingRes.length} reservas importadas</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant={sync.status === "ok" ? "default" : "destructive"} className="text-[10px]">
                    {sync.status === "ok" ? <><CheckCircle2 className="h-3 w-3 mr-1" />Conectado</> : <><AlertTriangle className="h-3 w-3 mr-1" />Atenção</>}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">Última sync: {new Date(sync.lastSync).toLocaleTimeString("pt-BR")}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={runSync}><RefreshCw className="h-4 w-4 mr-1.5" />Sincronizar agora</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">Reservas importadas</div><div className="font-display text-3xl mt-2">{sync.importedCount}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">Conflitos prevenidos</div><div className="font-display text-3xl mt-2 text-destructive">3</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">Erros de sync</div><div className="font-display text-3xl mt-2">{sync.errors}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg mb-4">Eventos recentes</h3>
          <div className="space-y-3">
            {syncEvents.map((e) => (
              <div key={e.id} className="flex gap-3 items-start text-sm border-l-2 pl-3" style={{ borderColor: e.severity === "critical" ? "var(--destructive)" : e.severity === "warning" ? "var(--warning)" : "var(--primary)" }}>
                <div className="flex-1">
                  <div className="font-medium">{e.action} · <span className="text-muted-foreground font-normal">{e.target}</span></div>
                  <div className="text-xs text-muted-foreground">{e.detail} · {new Date(e.at).toLocaleString("pt-BR")}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-6 max-w-2xl">
        <strong>Postura conservadora:</strong> Se a sincronização falhar, o sistema retira disponibilidade dos canais externos
        até a comunicação ser restabelecida. Estrutura preparada para integração real via API, webhook ou ICS.
      </p>
    </div>
  );
}
