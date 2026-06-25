import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Ilha do Meio" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const reseed = useApp((s) => s.reseed);
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <PageHeader title="Configurações" description="Dados da pousada, políticas, canais e usuários." />

      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-display text-xl">Dados da pousada</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome"><Input defaultValue="Pousada Ilha do Meio" /></Field>
          <Field label="CNPJ"><Input defaultValue="12.345.678/0001-90" /></Field>
          <Field label="Endereço"><Input defaultValue="Estrada do Coco, Itacimirim — BA" /></Field>
          <Field label="Telefone"><Input defaultValue="(71) 99999-0000" /></Field>
        </div>
      </CardContent></Card>

      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-display text-xl">Política e horários</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Check-in"><Input type="time" defaultValue="14:00" /></Field>
          <Field label="Check-out"><Input type="time" defaultValue="11:00" /></Field>
        </div>
        <Field label="Política de cancelamento"><Textarea defaultValue="Cancelamento gratuito até 7 dias antes do check-in. Após esse prazo, retenção de 50% do valor total. No-show: 100%." rows={3} /></Field>
      </CardContent></Card>

      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-display text-xl">Canais ativos</h3>
        {[
          { name: "Site próprio", status: "Ativo" },
          { name: "WhatsApp", status: "Ativo" },
          { name: "Telefone / Recepção", status: "Ativo" },
          { name: "Booking.com", status: "Conectado" },
          { name: "Airbnb", status: "Não conectado" },
        ].map((c) => (
          <div key={c.name} className="flex justify-between items-center py-2 border-b last:border-0">
            <span className="text-sm font-medium">{c.name}</span>
            <span className="text-xs text-muted-foreground">{c.status}</span>
          </div>
        ))}
      </CardContent></Card>

      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-display text-xl">Usuários</h3>
        {[
          { name: "Maria · Recepção", role: "Operação" },
          { name: "Carlos · Gerente", role: "Administrador" },
          { name: "Júlia · Reservas", role: "Operação" },
        ].map((u) => (
          <div key={u.name} className="flex justify-between items-center py-2 border-b last:border-0">
            <span className="text-sm font-medium">{u.name}</span>
            <span className="text-xs text-muted-foreground">{u.role}</span>
          </div>
        ))}
      </CardContent></Card>

      <Card><CardContent className="p-6">
        <h3 className="font-display text-xl mb-2">Reset de dados (demo)</h3>
        <p className="text-sm text-muted-foreground mb-3">Restaura o conjunto de dados mockado para demonstração.</p>
        <Button variant="outline" onClick={() => { reseed(); toast.success("Dados restaurados"); }}>Restaurar dados de demo</Button>
      </CardContent></Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
