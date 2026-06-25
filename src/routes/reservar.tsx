import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { checkConflict, nightsBetween } from "@/lib/reservations";
import heroImg from "@/assets/pousada-hero.jpg";
import { CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reservar")({
  head: () => ({ meta: [
    { title: "Reservar direto — Pousada Ilha do Meio" },
    { name: "description", content: "Reserve direto com a Pousada Ilha do Meio em Itacimirim. Sem comissão, melhor tarifa garantida." },
  ] }),
  component: BookingEngine,
});

type Step = 1 | 2 | 3 | 4;

function BookingEngine() {
  const { rooms, reservations, blocks, createReservation } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().slice(0, 10);
  });
  const [roomId, setRoomId] = useState("");
  const [guestN, setGuestN] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const available = useMemo(
    () => rooms.filter((r) => r.status === "active" && checkConflict({ roomId: r.id, checkIn, checkOut, reservations, blocks }).ok),
    [rooms, reservations, blocks, checkIn, checkOut],
  );
  const room = rooms.find((r) => r.id === roomId);
  const nights = nightsBetween(checkIn, checkOut);
  const total = (room?.basePrice ?? 0) * nights;

  const confirm = () => {
    const guestId = `guest-pub-${Date.now()}`;
    useApp.setState((s) => ({
      guests: [...s.guests, { id: guestId, name, email, phone, tags: ["lead site"], createdAt: new Date().toISOString().slice(0, 10) }],
    }));
    const res = createReservation({
      roomId, guestId, checkIn, checkOut, guests: guestN, channel: "site",
      status: "pending", paymentStatus: "pending", totalValue: total,
    });
    if (res.ok) { toast.success("Reserva enviada! Em breve entraremos em contato."); setStep(4); }
    else toast.error(res.error || "Erro");
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo className="h-10 w-10" showText />
          <a href="/auth" className="text-xs opacity-70 hover:opacity-100">Acesso interno</a>
        </div>
      </header>

      {step === 1 && (
        <section className="relative">
          <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
            <img src={heroImg} alt="Pousada Ilha do Meio" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background" />
            <div className="relative h-full flex flex-col justify-center items-center text-center px-4 text-primary-foreground">
              <h1 className="font-display text-4xl md:text-6xl max-w-2xl leading-tight">Reserve direto. Sem intermediários.</h1>
              <p className="mt-3 max-w-xl opacity-90">Pousada Ilha do Meio · Itacimirim, Bahia</p>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Steps current={step} />

        {step === 1 && (
          <Card className="mt-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display text-2xl">Quando você gostaria de vir?</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Check-in"><Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></Field>
                <Field label="Check-out"><Input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} /></Field>
                <Field label="Hóspedes"><Input type="number" min={1} max={6} value={guestN} onChange={(e) => setGuestN(Number(e.target.value))} /></Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 pt-3 text-xs">
                <Benefit icon={<ShieldCheck className="h-4 w-4" />} text="Melhor tarifa garantida" />
                <Benefit icon={<Heart className="h-4 w-4" />} text="Cortesia: chegada surpresa no quarto" />
                <Benefit icon={<CheckCircle2 className="h-4 w-4" />} text="Cancelamento flexível até 7 dias antes" />
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep(2)}>Ver quartos disponíveis · {nights} noite{nights > 1 ? "s" : ""}</Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl">Quartos disponíveis</h2>
              <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline">Alterar datas</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {available.length === 0 && <p className="text-muted-foreground">Sem disponibilidade nesta data. Tente outro período.</p>}
              {available.map((r) => (
                <Card key={r.id} className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/40" onClick={() => { setRoomId(r.id); setStep(3); }}>
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-display text-lg">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.capacity} pessoas · {r.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl">{r.basePrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</div>
                        <div className="text-[10px] text-muted-foreground">/noite</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {r.amenities.slice(0, 3).map((a) => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}
                    </div>
                    <Button className="w-full" size="sm">Selecionar · total {(r.basePrice * nights).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && room && (
          <Card className="mt-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display text-2xl">Seus dados</h2>
              <div className="rounded-md bg-secondary p-4 text-sm">
                <div className="font-medium">{room.name}</div>
                <div className="text-muted-foreground text-xs">{new Date(checkIn).toLocaleDateString("pt-BR")} → {new Date(checkOut).toLocaleDateString("pt-BR")} · {nights} noite{nights > 1 ? "s" : ""} · {guestN} hóspede{guestN > 1 ? "s" : ""}</div>
                <div className="font-display text-2xl mt-2">{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome completo"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
                <Field label="E-mail"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
                <Field label="WhatsApp"><Input value={phone} onChange={(e) => setPhone(e.target.value)} required /></Field>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Voltar</Button>
                <Button onClick={confirm} disabled={!name || !email || !phone} className="flex-1">Confirmar reserva</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="mt-6 bg-primary text-primary-foreground">
            <CardContent className="p-10 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
              <h2 className="font-display text-3xl">Reserva enviada!</h2>
              <p className="mt-2 opacity-90">Em até 2 horas você receberá a confirmação por e-mail e WhatsApp.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function Steps({ current }: { current: Step }) {
  const labels = ["Datas", "Quarto", "Dados", "Pronto"];
  return (
    <div className="flex gap-2">
      {labels.map((l, i) => {
        const n = (i + 1) as Step;
        const active = n === current;
        const done = n < current;
        return (
          <div key={l} className="flex-1">
            <div className={`h-1 rounded-full ${active || done ? "bg-primary" : "bg-muted"}`} />
            <div className={`text-xs mt-1 ${active ? "font-medium" : "text-muted-foreground"}`}>{l}</div>
          </div>
        );
      })}
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
function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-primary">{icon}</span>{text}
    </div>
  );
}
