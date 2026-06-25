import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./reservas";
import { nightsBetween } from "@/lib/reservations";
import { ArrowLeft, XCircle, CheckCircle, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reservas/$id")({
  head: ({ params }) => ({ meta: [{ title: `Reserva ${params.id} — Ilha do Meio` }] }),
  component: ReservationDetail,
});

function ReservationDetail() {
  const { id } = Route.useParams();
  const { reservations, rooms, guests, updateReservation, cancelReservation } = useApp();
  const navigate = useNavigate();
  const r = reservations.find((x) => x.id === id);
  if (!r) {
    return (
      <div className="p-10 text-center">
        <p>Reserva não encontrada.</p>
        <Button asChild variant="link"><Link to="/reservas">Voltar</Link></Button>
      </div>
    );
  }
  const room = rooms.find((x) => x.id === r.roomId);
  const guest = guests.find((g) => g.id === r.guestId);
  const nights = nightsBetween(r.checkIn, r.checkOut);

  const setStatus = (s: import("@/lib/types").ReservationStatus) => {
    const res = updateReservation(r.id, { status: s });
    if (res.ok) toast.success(`Status atualizado: ${s}`);
    else toast.error(res.error || "Erro ao atualizar");
  };

  const onCancel = () => {
    if (!confirm("Cancelar esta reserva? A datas voltarão ao inventário.")) return;
    cancelReservation(r.id, "Cancelada pelo operador");
    toast.success("Reserva cancelada");
    navigate({ to: "/reservas" });
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader
        title={`Reserva ${r.code}`}
        description={`Criada em ${new Date(r.createdAt).toLocaleDateString("pt-BR")} via ${r.channel}`}
        actions={
          <>
            <Button variant="ghost" asChild><Link to="/reservas"><ArrowLeft className="h-4 w-4 mr-1" />Lista</Link></Button>
            {r.status === "confirmed" && <Button onClick={() => setStatus("checked_in")}><LogIn className="h-4 w-4 mr-1" />Check-in</Button>}
            {r.status === "checked_in" && <Button onClick={() => setStatus("checked_out")}><LogOut className="h-4 w-4 mr-1" />Check-out</Button>}
            {r.status !== "cancelled" && <Button variant="outline" onClick={onCancel}><XCircle className="h-4 w-4 mr-1" />Cancelar</Button>}
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Quarto</div>
                  <div className="font-display text-2xl">{room?.name ?? `Quarto (${r.roomId.slice(0, 8)})`}</div>
                  <div className="text-sm text-muted-foreground">
                    #{room?.code ?? "—"} · {room?.type ?? "—"} · {room?.capacity ?? r.guests} pessoas
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="grid sm:grid-cols-4 gap-4 pt-2">
                <Stat label="Check-in" value={new Date(r.checkIn).toLocaleDateString("pt-BR")} />
                <Stat label="Check-out" value={new Date(r.checkOut).toLocaleDateString("pt-BR")} />
                <Stat label="Noites" value={String(nights)} />
                <Stat label="Hóspedes" value={String(r.guests)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg mb-3">Hóspede</h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium text-base">{guest?.name}</div>
                <div className="text-muted-foreground">{guest?.email}</div>
                <div className="text-muted-foreground">{guest?.phone}</div>
                {guest?.document && <div className="text-muted-foreground">Documento: {guest.document}</div>}
                <div className="flex gap-1 mt-2">{guest?.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
              </div>
              {r.notes && (
                <div className="mt-4 p-3 rounded-md bg-muted text-sm">
                  <div className="text-xs uppercase text-muted-foreground mb-1">Observação interna</div>
                  {r.notes}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg mb-4">Histórico</h3>
              <div className="space-y-3">
                {r.history.map((h, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="flex-1">
                      <div><span className="font-medium capitalize">{h.action}</span> por <span className="text-muted-foreground">{h.by}</span></div>
                      <div className="text-xs text-muted-foreground">{new Date(h.at).toLocaleString("pt-BR")} {h.detail && `· ${h.detail}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-display text-lg">Financeiro</h3>
              <Row label="Diária base" value={(room?.basePrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
              <Row label="Noites" value={String(nights)} />
              <Row label="Canal" value={r.channel} />
              <Row label="Pagamento" value={r.paymentStatus} />
              {r.externalRef && <Row label="Ref. externa" value={r.externalRef} />}
              <div className="pt-3 mt-3 border-t flex justify-between items-baseline">
                <span className="text-xs uppercase text-muted-foreground">Total</span>
                <span className="font-display text-2xl">{r.totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg">{value}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-sm capitalize"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
