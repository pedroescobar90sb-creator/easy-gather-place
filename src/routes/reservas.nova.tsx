import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { checkConflict, nightsBetween } from "@/lib/reservations";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reservas/nova")({
  head: () => ({ meta: [{ title: "Nova reserva — Ilha do Meio" }] }),
  component: NewReservation,
});

function NewReservation() {
  const { rooms, reservations, blocks, guests, createReservation } = useApp();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [roomId, setRoomId] = useState<string>(rooms[0]?.id ?? "");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [doc, setDoc] = useState("");
  const [guestsN, setGuestsN] = useState(2);
  const [channel, setChannel] = useState<import("@/lib/types").Channel>("direto");
  const [notes, setNotes] = useState("");

  const availability = useMemo(() => {
    return rooms.map((r) => {
      const c = checkConflict({ roomId: r.id, checkIn, checkOut, reservations, blocks });
      return { room: r, available: c.ok && r.status === "active", conflicts: c.conflicts };
    });
  }, [rooms, checkIn, checkOut, reservations, blocks]);

  const selected = rooms.find((r) => r.id === roomId);
  const nights = nightsBetween(checkIn, checkOut);
  const total = (selected?.basePrice ?? 0) * nights;
  const currentConflict = availability.find((a) => a.room.id === roomId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentConflict?.available) {
      toast.error("Conflito impede esta reserva", { description: "Selecione um quarto disponível." });
      return;
    }
    // Reuse or create guest
    let guestId = guests.find((g) => g.email === guestEmail)?.id;
    if (!guestId) {
      guestId = `guest-${Date.now()}`;
      useApp.setState((s) => ({
        guests: [...s.guests, { id: guestId!, name: guestName, email: guestEmail, phone: guestPhone, document: doc, tags: [channel === "site" ? "lead site" : channel], createdAt: new Date().toISOString().slice(0, 10) }],
      }));
    }
    const res = createReservation({
      roomId,
      guestId,
      checkIn,
      checkOut,
      guests: guestsN,
      channel,
      status: "confirmed",
      paymentStatus: "pending",
      totalValue: total,
      notes: notes || undefined,
    });
    if (res.ok) {
      toast.success("Reserva criada", { description: `Nights: ${nights} · Total: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}` });
      navigate({ to: "/reservas/$id", params: { id: res.id! } });
    } else {
      toast.error("Não foi possível criar", { description: res.error });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader title="Nova reserva" description="Disponibilidade validada em tempo real contra o inventário central." actions={<Button asChild variant="ghost"><Link to="/reservas">Voltar</Link></Button>} />

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-display text-lg">Datas e quarto</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Check-in"><Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required /></Field>
                <Field label="Check-out"><Input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} required /></Field>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider mb-2 block">Quartos · {nights} noite{nights > 1 ? "s" : ""}</Label>
                <div className="grid sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                  {availability.map(({ room, available, conflicts }) => (
                    <button
                      key={room.id}
                      type="button"
                      disabled={!available}
                      onClick={() => setRoomId(room.id)}
                      className={`text-left p-3 rounded-md border transition-colors ${roomId === room.id ? "border-primary bg-primary/5" : "border-border"} ${!available ? "opacity-50 cursor-not-allowed" : "hover:border-primary/60"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{room.name}</div>
                          <div className="text-xs text-muted-foreground">#{room.code} · {room.capacity}p · {room.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-base">{room.basePrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</div>
                          <div className="text-[10px] text-muted-foreground">por noite</div>
                        </div>
                      </div>
                      {!available && (
                        <div className="mt-2 text-[11px] text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {room.status !== "active" ? `Quarto ${room.status}` : conflicts.map((c) => c.label).join(", ")}
                        </div>
                      )}
                      {available && roomId === room.id && (
                        <div className="mt-2 text-[11px] text-success flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Disponível neste período
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-display text-lg">Hóspede</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome completo"><Input value={guestName} onChange={(e) => setGuestName(e.target.value)} required /></Field>
                <Field label="E-mail"><Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required /></Field>
                <Field label="Telefone / WhatsApp"><Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} /></Field>
                <Field label="Documento"><Input value={doc} onChange={(e) => setDoc(e.target.value)} /></Field>
                <Field label="Nº de hóspedes"><Input type="number" min={1} max={selected?.capacity ?? 4} value={guestsN} onChange={(e) => setGuestsN(Number(e.target.value))} /></Field>
                <Field label="Canal de origem">
                  <select value={channel} onChange={(e) => setChannel(e.target.value as import("@/lib/types").Channel)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option value="direto">Direto</option>
                    <option value="site">Site próprio</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telefone">Telefone</option>
                    <option value="booking">Booking.com</option>
                  </select>
                </Field>
              </div>
              <Field label="Observações internas"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></Field>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="lg:sticky lg:top-6">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-display text-lg">Resumo</h3>
              <div className="text-sm space-y-2">
                <Row label="Quarto" value={selected?.name ?? "—"} />
                <Row label="Período" value={`${new Date(checkIn).toLocaleDateString("pt-BR")} → ${new Date(checkOut).toLocaleDateString("pt-BR")}`} />
                <Row label="Noites" value={String(nights)} />
                <Row label="Diária base" value={(selected?.basePrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
                <div className="pt-3 mt-3 border-t flex justify-between items-baseline">
                  <span className="text-xs uppercase text-muted-foreground">Total</span>
                  <span className="font-display text-2xl font-semibold">{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {currentConflict?.available ? (
                <div className="rounded-md bg-success/10 border border-success/30 p-3 text-xs text-success-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-px text-success" />
                  <span>Inventário validado. Sem sobreposições.</span>
                </div>
              ) : (
                <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-px text-destructive" />
                  <span>Conflito detectado. Ajuste datas ou escolha outro quarto.</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={!currentConflict?.available}>Criar reserva</Button>
            </CardContent>
          </Card>
        </div>
      </form>
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
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
