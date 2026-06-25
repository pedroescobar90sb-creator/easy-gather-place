import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Ajustes — Ilha do Meio" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <PageHeader title="Ajustes" description="Configurações essenciais da pousada." />

      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-display text-xl">Pousada</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome"><Input defaultValue="Pousada Ilha do Meio" /></Field>
          <Field label="WhatsApp / Telefone"><Input defaultValue="+55 71 91263-0996" /></Field>
        </div>
        <Field label="Endereço">
          <Input defaultValue="Rua Sítio Novo, 7 — Loteamento Santa Maria, Lote 8 · Itacimirim, Camaçari — BA · CEP 42823-000" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Instagram">
            <Input defaultValue="https://www.instagram.com/pousadailhadomeio/" />
          </Field>
          <Field label="WhatsApp (link)">
            <Input defaultValue="https://api.whatsapp.com/send/?phone=557191263096" />
          </Field>
        </div>
      </CardContent></Card>

      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-display text-xl">Horários e política</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Check-in"><Input type="time" defaultValue="14:00" /></Field>
          <Field label="Check-out"><Input type="time" defaultValue="11:00" /></Field>
        </div>
        <Field label="Política de cancelamento">
          <Textarea
            defaultValue="Cancelamento gratuito até 7 dias antes do check-in. Após esse prazo, retenção de 50% do valor total. No-show: 100%."
            rows={3}
          />
        </Field>
      </CardContent></Card>

      <Card><CardContent className="p-6 space-y-3">
        <h3 className="font-display text-xl">Canais ativos</h3>
        {[
          { name: "Booking.com", status: "Conectado · canal externo principal" },
          { name: "WhatsApp da pousada", status: "Ativo · atendimento e reserva direta" },
          { name: "Instagram @pousadailhadomeio", status: "Ativo · captação e DM" },
          { name: "Recepção / Telefone", status: "Ativo" },
        ].map((c) => (
          <div key={c.name} className="flex justify-between items-center py-2 border-b last:border-0">
            <span className="text-sm font-medium">{c.name}</span>
            <span className="text-xs text-muted-foreground">{c.status}</span>
          </div>
        ))}
      </CardContent></Card>


      <Card><CardContent className="p-6 space-y-3">
        <h3 className="font-display text-xl">Usuários e permissões</h3>
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
