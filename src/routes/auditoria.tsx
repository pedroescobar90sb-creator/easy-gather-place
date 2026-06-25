import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Info, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/auditoria")({
  head: () => ({ meta: [{ title: "Auditoria — Ilha do Meio" }] }),
  component: AuditPage,
});

function AuditPage() {
  const { audit } = useApp();
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <PageHeader title="Auditoria e atividades" description="Toda alteração relevante é registrada com data, autor e contexto." />
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {audit.map((a) => {
              const Icon = a.severity === "critical" ? ShieldAlert : a.severity === "warning" ? AlertTriangle : Info;
              const color = a.severity === "critical" ? "text-destructive" : a.severity === "warning" ? "text-warning" : "text-muted-foreground";
              return (
                <li key={a.id} className="flex gap-4 p-4">
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="font-medium">{a.action}</div>
                      <div className="text-xs text-muted-foreground shrink-0">{new Date(a.at).toLocaleString("pt-BR")}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{a.target} · por {a.actor}</div>
                    {a.detail && <div className="text-xs text-muted-foreground mt-1">{a.detail}</div>}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
