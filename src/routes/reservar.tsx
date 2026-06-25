import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logo } from "@/components/Logo";
import { nightsBetween } from "@/lib/reservations";
import { supabase } from "@/integrations/supabase/client";
import { mapRoom } from "@/lib/remote";
import type { Room } from "@/lib/types";
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
  validateSearch: (s: Record<string, unknown>) => ({
    room: typeof s.room === "string" ? s.room : undefined,
    type: typeof s.type === "string" && ["duplo_casal", "triplo", "quadruplo"].includes(s.type) ? (s.type as "duplo_casal" | "triplo" | "quadruplo") : undefined,
    guests: typeof s.guests === "number" ? s.guests : undefined,
  }),
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [busyRoomIds, setBusyRoomIds] = useState<Set<string>>(new Set());
  const search = Route.useSearch();
  const preselectedRoom = search.room;
  const preselectedType = search.type;
  const [step, setStep] = useState<Step>(preselectedRoom ? 3 : 1);
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const a = new Date(); const b = new Date(); b.setDate(b.getDate() + 2);
    return { from: a, to: b };
  });
  const [roomId, setRoomId] = useState(preselectedRoom ?? "");
  const initialGuests = search.guests ?? (preselectedType === "triplo" ? 3 : preselectedType === "quadruplo" ? 4 : 2);
  const [guestN, setGuestN] = useState(initialGuests);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Public booking is decoupled from the internal store: fetch rooms directly.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("status", "active")
        .order("code");
      if (!cancelled && !error && Array.isArray(data)) setRooms(data.map(mapRoom));
    })();
    return () => { cancelled = true; };
  }, []);

  const checkIn = range?.from ? toISO(range.from) : "";
  const checkOut = range?.to ? toISO(range.to) : "";
  const datesValid = !!(range?.from && range?.to && range.from < range.to);
  const nights = datesValid ? nightsBetween(checkIn, checkOut) : 0;

  // Fetch room IDs that already have overlapping reservations or blocks
  useEffect(() => {
    if (!datesValid) { setBusyRoomIds(new Set()); return; }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("public_busy_room_ids", {
        p_check_in: checkIn,
        p_check_out: checkOut,
      });
      if (cancelled || error || !Array.isArray(data)) return;
      const busy = new Set<string>();
      (data as Array<{ room_id: string | null }>).forEach((r) => {
        if (r.room_id) busy.add(r.room_id);
      });
      setBusyRoomIds(busy);
    })();
    return () => { cancelled = true; };
  }, [datesValid, checkIn, checkOut]);


  const available = useMemo(
    () => datesValid ? rooms.filter((r) =>
      r.status === "active"
      && r.capacity >= guestN
      && (!preselectedType || r.type === preselectedType)
      && !busyRoomIds.has(r.id)
    ) : [],
    [rooms, datesValid, guestN, preselectedType, busyRoomIds],
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

  const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

  const confirm = async () => {
    if (!roomId || !checkIn || !checkOut) {
      toast.error("Selecione datas e quarto antes de confirmar");
      return;
    }
    if (!isUuid(roomId) || !rooms.some((r) => r.id === roomId)) {
      toast.error("Estamos sincronizando os quartos. Selecione novamente o quarto desejado.");
      setRoomId("");
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: freshRoom, error: roomError } = await supabase
        .from("rooms")
        .select("id, status, capacity")
        .eq("id", roomId)
        .maybeSingle();

      if (roomError || !freshRoom || freshRoom.status !== "active") {
        toast.error("Quarto indisponível no momento. Escolha outro quarto disponível.");
        setRoomId("");
        setStep(2);
        return;
      }

      if (guestN > Number(freshRoom.capacity ?? 0)) {
        toast.error("Este quarto não comporta a quantidade de hóspedes selecionada.");
        setStep(2);
        return;
      }

      const { error } = await supabase.rpc("create_public_reservation", {
        p_name: name.trim(),
        p_email: email.trim(),
        p_phone: phone.trim(),
        p_room_id: roomId,
        p_check_in: checkIn,
        p_check_out: checkOut,
        p_guests: guestN,
        p_total: total,
      });
      if (error) {
        const raw = (error.message || "").toLowerCase();
        const map: Record<string, string> = {
          invalid_name: "Nome inválido (mínimo 2 caracteres).",
          invalid_email: "E-mail inválido.",
          invalid_phone: "WhatsApp inválido (mínimo 8 dígitos).",
          invalid_dates: "Datas inválidas. Verifique check-in e check-out.",
          stay_too_long: "Estadia muito longa (máx. 60 noites).",
          invalid_guest_count: "Número de hóspedes inválido.",
          invalid_total: "Valor da reserva inválido.",
          room_unavailable: "Quarto indisponível no momento. Escolha outro quarto disponível.",
          over_capacity: "Acima da capacidade do quarto.",
        };
        const matched = Object.keys(map).find((k) => raw.includes(k));
        toast.error(matched ? map[matched] : `Não foi possível concluir: ${error.message}`);
        if (matched === "room_unavailable" || matched === "over_capacity") setStep(2);
        return;
      }
      try {
        const { sendReservationConfirmation } = await import("@/lib/email.functions");
        await sendReservationConfirmation({
          data: {
            to: email.trim(),
            name: name.trim(),
            roomName: room?.name ?? "Quarto",
            checkIn,
            checkOut,
            nights,
            guests: guestN,
            total,
          },
        });
      } catch (mailErr) {
        console.warn("[reservar] envio de e-mail falhou", mailErr);
      }
      toast.success("Reserva enviada! Confirmação por e-mail a caminho.");
      setStep(4);

    } catch (e) {
      toast.error(`Erro ao enviar reserva: ${e instanceof Error ? e.message : "tente novamente"}`);
    } finally {
      setSubmitting(false);
    }
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
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> Hóspedes
                    </Label>
                    {preselectedType ? (
                      <div className="mt-3 text-center">
                        <div className="font-display text-3xl tabular-nums text-foreground font-medium">{guestN}</div>
                        <div className="text-[11px] text-foreground/60 mt-2">
                          {preselectedType === "duplo_casal" ? "Quarto duplo casal · fixo 2" : preselectedType === "triplo" ? "Quarto triplo · fixo 3" : "Quarto quádruplo · fixo 4"}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3 mt-3">
                          <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full text-lg font-semibold" onClick={() => setGuestN(Math.max(1, guestN - 1))}>−</Button>
                          <div className="font-display text-3xl tabular-nums text-foreground font-medium">{guestN}</div>
                          <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full text-lg font-semibold" onClick={() => setGuestN(Math.min(4, guestN + 1))}>+</Button>
                        </div>
                        <div className="text-[11px] text-foreground/60 mt-2 text-center">
                          {guestN <= 2 ? "Quarto duplo casal" : guestN === 3 ? "Quarto triplo" : "Quarto quádruplo"}
                        </div>
                      </>
                    )}
                  </div>



                  {(() => {
                    const nightly = guestN <= 2 ? 450 : guestN === 3 ? 550 : 650;
                    const estTotal = nightly * (nights || 0);
                    return (
                      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Estimativa</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">{nightly.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })} × {nights || 0} noite{nights === 1 ? "" : "s"}</span>
                        </div>
                        <div className="border-t border-primary/20 pt-2 flex justify-between items-baseline">
                          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Total</span>
                          <span className="font-display text-2xl font-semibold text-primary tabular-nums">
                            {estTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="text-[10px] text-foreground/50 text-center">Valor final pode variar conforme o quarto escolhido</div>
                      </div>
                    );
                  })()}
                </aside>

              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                <Benefit icon={<ShieldCheck className="h-4 w-4" />} text="Melhor tarifa garantida" />
                <Benefit icon={<Heart className="h-4 w-4" />} text="Chegada surpresa no quarto" />
                <Benefit icon={<CheckCircle2 className="h-4 w-4" />} text="Cancelamento flexível" />
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-base font-semibold tracking-wide"
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
                    {r.image ? (
                      <img src={r.image} alt={String(r.name ?? "Quarto")} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div>
                         <div className="font-display text-lg leading-tight">{String(r.name ?? "Quarto")}</div>
                         <div className="text-xs text-muted-foreground capitalize">{Number(r.capacity) || 1} pessoas · {String(r.type ?? "duplo_casal").replace("_", " ")}</div>
                      </div>
                      <div className="text-right shrink-0">
                         <div className="font-display text-xl">{(Number(r.basePrice) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}</div>
                        <div className="text-[10px] text-muted-foreground">/noite</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                       {(Array.isArray(r.amenities) ? r.amenities.filter((a) => typeof a === "string" && a.trim()) : []).slice(0, 3).map((a) => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}
                    </div>
                    <Button className="w-full" size="sm">
                       Selecionar · {((Number(r.basePrice) || 0) * nights).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
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
                 {room.image ? <img src={room.image} alt={String(room.name ?? "Quarto")} className="h-16 w-16 rounded-lg object-cover shrink-0" /> : <div className="h-16 w-16 rounded-lg bg-muted shrink-0" />}
                <div className="flex-1 min-w-0">
                   <div className="font-medium truncate">{String(room.name ?? "Quarto")}</div>
                  <div className="text-muted-foreground text-xs">
                    {range?.from && fmtBR(range.from)} → {range?.to && fmtBR(range.to)} · {nights} noite{nights > 1 ? "s" : ""} · {guestN} hósp.
                  </div>
                </div>
                <div className="font-display text-xl shrink-0">
                  {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                </div>
              </div>
              {(() => {
                const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
                const phoneDigits = phone.replace(/\D/g, "");
                const phoneOk = phoneDigits.length >= 10 && phoneDigits.length <= 13;
                const nameOk = name.trim().length >= 3 && name.trim().includes(" ");
                const allOk = emailOk && phoneOk && nameOk;
                return (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Nome completo">
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Maria da Silva" required />
                        {name && !nameOk && <p className="text-[11px] text-destructive mt-1">Informe nome e sobrenome.</p>}
                      </Field>
                      <Field label="E-mail">
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" required />
                        {email && !emailOk && <p className="text-[11px] text-destructive mt-1">E-mail inválido.</p>}
                      </Field>
                      <Field label="WhatsApp">
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(71) 99999-9999" required />
                        {phone && !phoneOk && <p className="text-[11px] text-destructive mt-1">Inclua DDD + número (10 a 13 dígitos).</p>}
                      </Field>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Voltar</Button>
                      <Button onClick={confirm} disabled={!allOk || submitting} className="flex-1">
                        {submitting ? "Enviando..." : "Confirmar reserva"}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Você receberá a confirmação por e-mail e WhatsApp. Sem cobrança agora.
                    </p>
                  </>
                );
              })()}

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
            <div className={cn("text-xs md:text-sm mt-2 font-medium", active ? "text-foreground" : done ? "text-foreground/70" : "text-foreground/40")}>{l}</div>
          </div>
        );
      })}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/70">{label}</Label>
      {children}
    </div>
  );
}
function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-foreground/80 font-medium">
      <span className="text-primary">{icon}</span>{text}
    </div>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-foreground/60 font-medium">{label}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}
