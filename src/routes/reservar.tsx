import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logo } from "@/components/Logo";
import { checkConflict, nightsBetween } from "@/lib/reservations";
import heroAsset from "@/assets/pousada-0.jpg.asset.json";
import { CheckCircle2, ShieldCheck, Heart, CalendarDays, Users, ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reservar")({
  head: () => ({ meta: [
    { title: "Reservar direto — Pousada Ilha do Meio" },
    { name: "description", content: "Reserve direto com a Pousada Ilha do Meio em Itacimirim. Sem comissão, melhor tarifa garantida." },
  ] }),
  component: BookingEngine,
});

type Step = 1 | 2 | 3 | 4;

const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const fromISO = (s: string) => new Date(s + "T00:00:00");
const fmtBR = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

function BookingEngine() {
  const { rooms, reservations, blocks } = useApp();
  const [step, setStep] = useState<Step>(1);
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const a = new Date(); const b = new Date(); b.setDate(b.getDate() + 2);
    return { from: a, to: b };
  });
  const [roomId, setRoomId] = useState("");
  const [guestN, setGuestN] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checkIn = range?.from ? toISO(range.from) : "";
  const checkOut = range?.to ? toISO(range.to) : "";
  const datesValid = !!(range?.from && range?.to && range.from < range.to);
  const nights = datesValid ? nightsBetween(checkIn, checkOut) : 0;

  const available = useMemo(
    () => datesValid ? rooms.filter((r) => r.status === "active" && r.capacity >= guestN && checkConflict({ roomId: r.id, checkIn, checkOut, reservations, blocks }).ok) : [],
    [rooms, reservations, blocks, checkIn, checkOut, datesValid, guestN],
  );
  const room = rooms.find((r) => r.id === roomId);
  const total = (room?.basePrice ?? 0) * nights;

  const handleRangeSelect = (r: DateRange | undefined) => {
    if (r?.from && !r.to) {
      // auto-suggest next day
      const next = new Date(r.from); next.setDate(next.getDate() + 1);
      setRange({ from: r.from, to: next });
    } else {
      setRange(r);
    }
  };

  const confirm = async () => {
    setSubmitting(true);
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.rpc("create_public_reservation", {
      p_name: name, p_email: email, p_phone: phone,
      p_room_id: roomId, p_check_in: checkIn, p_check_out: checkOut,
      p_guests: guestN, p_total: total,
    });
    setSubmitting(false);
    if (error) {
      const map: Record<string, string> = {
        invalid_name: "Nome inválido", invalid_email: "E-mail inválido", invalid_phone: "WhatsApp inválido",
        invalid_dates: "Datas inválidas", stay_too_long: "Estadia muito longa",
        invalid_guest_count: "Número de hóspedes inválido", invalid_total: "Valor inválido",
        room_unavailable: "Quarto indisponível", over_capacity: "Acima da capacidade do quarto",
      };
      toast.error(map[error.message] || "Não foi possível concluir a reserva");
      return;
    }
    toast.success("Reserva enviada! Em breve entraremos em contato.");
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <a href="/" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Voltar ao site</span>
          </a>
          <Logo className="h-9 w-9" showText />
          <span />
        </div>
      </header>

      {/* HERO com foto real */}
      <section className="relative">
        <div className="h-[42vh] md:h-[54vh] relative overflow-hidden">
          <img
            src={heroAsset.url}
            alt="Pousada Ilha do Meio — Itacimirim, Bahia"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
          <div className="relative h-full max-w-5xl mx-auto px-4 flex flex-col justify-end pb-10 md:pb-14 text-white">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] opacity-90">
              <MapPin className="h-3.5 w-3.5" /> Itacimirim · Bahia
            </div>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mt-2 max-w-2xl leading-[1.05]">
              Reserve direto na<br />Pousada Ilha do Meio
            </h1>
            <p className="mt-3 text-sm md:text-base opacity-90 max-w-lg">
              Sem comissão, melhor tarifa garantida e atendimento da própria casa.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <Steps current={step} />

        {step === 1 && (
          <Card className="mt-6 border-border/60 shadow-sm">
            <CardContent className="p-5 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight">Quando você vem?</h2>
                <p className="text-base text-foreground/70 mt-2">Escolha check-in e check-out no calendário.</p>
              </div>

              <div className="grid md:grid-cols-[1fr_280px] gap-6">
                {/* Calendário */}
                <div className="space-y-4">
                  {/* Mobile: popover; Desktop: inline */}
                  <div className="md:hidden">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full rounded-xl border-2 bg-card p-4 text-left active:scale-[0.99] transition hover:border-primary/50">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" /> Datas da estadia
                          </div>
                          <div className="mt-2 font-display text-xl text-foreground font-medium">
                            {range?.from ? fmtBR(range.from) : "Check-in"}
                            <span className="mx-2 text-foreground/40">→</span>
                            {range?.to ? fmtBR(range.to) : "Check-out"}
                          </div>
                          {nights > 0 && <div className="text-sm text-foreground/70 mt-1 font-medium">{nights} noite{nights > 1 ? "s" : ""}</div>}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="range"
                          selected={range}
                          onSelect={handleRangeSelect}
                          numberOfMonths={1}
                          disabled={{ before: today }}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="hidden md:block rounded-xl border bg-card p-2">
                    <Calendar
                      mode="range"
                      selected={range}
                      onSelect={handleRangeSelect}
                      numberOfMonths={2}
                      disabled={{ before: today }}
                      className="pointer-events-auto"
                    />
                  </div>
                </div>

                {/* Resumo lateral */}
                <aside className="space-y-4">
                  <div className="rounded-xl border bg-card p-4 space-y-3">
                    <Summary label="Check-in" value={range?.from ? fmtBR(range.from) : "—"} />
                    <Summary label="Check-out" value={range?.to ? fmtBR(range.to) : "—"} />
                    <div className="border-t pt-3">
                      <Summary label="Noites" value={nights > 0 ? String(nights) : "—"} />
                    </div>
                  </div>

                  <div className="rounded-xl border bg-card p-4">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-3 w-3" /> Hóspedes
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setGuestN(Math.max(1, guestN - 1))}>−</Button>
                      <div className="font-display text-2xl tabular-nums w-8 text-center">{guestN}</div>
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setGuestN(Math.min(6, guestN + 1))}>+</Button>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                <Benefit icon={<ShieldCheck className="h-4 w-4" />} text="Melhor tarifa garantida" />
                <Benefit icon={<Heart className="h-4 w-4" />} text="Chegada surpresa no quarto" />
                <Benefit icon={<CheckCircle2 className="h-4 w-4" />} text="Cancelamento flexível" />
              </div>

              <Button
                size="lg"
                className="w-full h-12 text-base font-medium"
                disabled={!datesValid}
                onClick={() => setStep(2)}
              >
                {datesValid ? `Ver quartos · ${nights} noite${nights > 1 ? "s" : ""}` : "Selecione as datas"}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-5">
            <div className="flex justify-between items-end gap-4">
              <div>
                <h2 className="font-display text-2xl md:text-3xl">Quartos disponíveis</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {nights} noite{nights > 1 ? "s" : ""} · {guestN} hóspede{guestN > 1 ? "s" : ""}
                </p>
              </div>
              <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline shrink-0">Alterar</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {available.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-10">
                  Sem disponibilidade para esta data e capacidade. Tente outro período.
                </p>
              )}
              {available.map((r) => (
                <Card key={r.id} className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => { setRoomId(r.id); setStep(3); }}>
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div>
                        <div className="font-display text-lg leading-tight">{r.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{r.capacity} pessoas · {r.type.replace("_", " ")}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display text-xl">{r.basePrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</div>
                        <div className="text-[10px] text-muted-foreground">/noite</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {r.amenities.slice(0, 3).map((a) => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}
                    </div>
                    <Button className="w-full" size="sm">
                      Selecionar · {(r.basePrice * nights).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && room && (
          <Card className="mt-6">
            <CardContent className="p-5 md:p-8 space-y-5">
              <h2 className="font-display text-2xl md:text-3xl">Seus dados</h2>
              <div className="rounded-xl border bg-secondary/50 p-4 flex gap-4 items-center">
                <img src={room.image} alt={room.name} className="h-16 w-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{room.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {range?.from && fmtBR(range.from)} → {range?.to && fmtBR(range.to)} · {nights} noite{nights > 1 ? "s" : ""} · {guestN} hósp.
                  </div>
                </div>
                <div className="font-display text-xl shrink-0">
                  {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome completo"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
                <Field label="E-mail"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
                <Field label="WhatsApp"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(71) 9 ..." required /></Field>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Voltar</Button>
                <Button onClick={confirm} disabled={!name || !email || !phone || submitting} className="flex-1">
                  {submitting ? "Enviando..." : "Confirmar reserva"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                A reserva fica pendente até a confirmação manual. Sem cobrança agora.
              </p>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="mt-6 bg-primary text-primary-foreground">
            <CardContent className="p-10 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
              <h2 className="font-display text-3xl">Reserva enviada!</h2>
              <p className="mt-2 opacity-90">Em até 2 horas você receberá a confirmação por e-mail e WhatsApp.</p>
              <a href="/" className="inline-block mt-6 text-sm underline opacity-90 hover:opacity-100">Voltar ao site</a>
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
            <div className={cn("h-1 rounded-full transition-colors", active || done ? "bg-primary" : "bg-muted")} />
            <div className={cn("text-[11px] md:text-xs mt-1.5", active ? "font-medium text-foreground" : "text-muted-foreground")}>{l}</div>
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
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
