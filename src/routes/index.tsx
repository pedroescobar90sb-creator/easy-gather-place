import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Wifi, Wind, Tv, Refrigerator, Star, Calendar, ShieldCheck, Heart, Instagram, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import f0 from "@/assets/pousada-0.jpg.asset.json";
import f1 from "@/assets/pousada-1.jpg.asset.json";
import f2 from "@/assets/pousada-2.jpg.asset.json";
import f3 from "@/assets/pousada-3.jpg.asset.json";
import f4 from "@/assets/pousada-4.jpg.asset.json";
import f5 from "@/assets/pousada-5.jpg.asset.json";
import f6 from "@/assets/pousada-6.jpg.asset.json";
import f7 from "@/assets/pousada-7.jpg.asset.json";
import f8 from "@/assets/pousada-8.jpg.asset.json";
import f9 from "@/assets/pousada-9.jpg.asset.json";
import f11 from "@/assets/pousada-11.jpg.asset.json";
import quartoDuplo from "@/assets/quarto-duplo.jpg.asset.json";
import quartoTriplo from "@/assets/quarto-triplo.jpg.asset.json";
import quartoQuadruplo from "@/assets/quarto-quadruplo.jpg.asset.json";


const WHATSAPP = "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20na%20Pousada%20Ilha%20do%20Meio.";
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pousada Ilha do Meio · Itacimirim, Camaçari — BA" },
      { name: "description", content: "Pousada boutique em Itacimirim (Camaçari, BA) a 2 minutos do mar. 17 quartos com ar, TV e frigobar. Reserve direto e ganhe 10% off." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Camaçari — BA" },
      { property: "og:description", content: "Sua estadia tranquila em Itacimirim — Camaçari, Bahia. Reserve direto e economize." },
      { property: "og:image", content: f0.url },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Pousada</div>
              <div className="font-display text-base sm:text-lg leading-none">Ilha do Meio</div>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full text-emerald-700 hover:bg-emerald-50 transition"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <Link
              to="/reservar"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 sm:px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
            >
              <Calendar className="h-4 w-4" />
              Reservar
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={f0.url} alt="Pousada Ilha do Meio em Itacimirim" className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/80" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-32 sm:pb-36 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-xs ring-1 ring-white/20">
            <MapPin className="h-3.5 w-3.5" />
            Itacimirim, Camaçari — BA
          </div>
          <h1 className="mt-5 font-display font-medium text-5xl sm:text-7xl leading-[1.02] tracking-tight max-w-3xl">
            Sua pausa tranquila<br />a 2 minutos do mar.
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
            Pousada boutique com 17 quartos, ar-condicionado, frigobar e café da manhã.{" "}
            <span className="text-white font-medium">Reserve direto e ganhe 10% off.</span>
          </p>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 max-w-lg">
            <Link
              to="/reservar"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:opacity-95 text-primary-foreground px-7 py-4 text-base font-semibold shadow-2xl shadow-black/30 transition"
            >
              <Calendar className="h-5 w-5" />
              Reservar online agora
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 text-white/95 hover:text-white text-sm font-medium underline-offset-4 hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" />
              ou falar no WhatsApp
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
            <li className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 9.4 no Booking</li>
            <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Sem comissão</li>
            <li className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" /> Cancelamento flexível</li>
          </ul>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/40">
          {[
            { n: "17", l: "Quartos" },
            { n: "42", l: "Hóspedes" },
            { n: "2 min", l: "Da praia" },
            { n: "10%", l: "Off reserva direta" },
          ].map((s) => (
            <div key={s.l} className="bg-card px-4 py-6 text-center">
              <div className="font-display text-2xl sm:text-3xl text-primary">{s.n}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ACOMODAÇÕES */}
      <section id="acomodacoes" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Acomodações</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Conforto para casal, família ou grupo.</h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">Todos os quartos com ar-condicionado, TV, frigobar e cama confortável. Diárias incluem café da manhã.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {([
            { img: quartoQuadruplo.url, name: "Duplo Casal", capacity: "2 pessoas", count: 10, price: "R$ 450", type: "duplo_casal" as const, guests: 2 },
            { img: quartoTriplo.url, name: "Triplo", capacity: "3 pessoas", count: 3, price: "R$ 550", type: "triplo" as const, guests: 3 },
            { img: quartoDuplo.url, name: "Quádruplo", capacity: "4 pessoas", count: 4, price: "R$ 650", type: "quadruplo" as const, guests: 4 },
          ]).map((r) => (
            <article key={r.name} className="group overflow-hidden rounded-2xl bg-card border border-border/60 flex flex-col hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.img} alt={r.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl">{r.name}</h3>
                  <span className="text-xs text-muted-foreground">{r.count} unidades</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Até {r.capacity}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Wind className="h-3.5 w-3.5" /> Ar</span>
                  <span className="inline-flex items-center gap-1"><Tv className="h-3.5 w-3.5" /> TV</span>
                  <span className="inline-flex items-center gap-1"><Refrigerator className="h-3.5 w-3.5" /> Frigobar</span>
                  <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" /> Wi-Fi</span>
                </div>
                <div className="mt-6 pt-5 border-t border-border/50 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-muted-foreground">a partir de</div>
                    <div className="font-display text-2xl text-primary leading-none">{r.price}<span className="text-xs text-muted-foreground font-sans ml-1">/noite</span></div>
                  </div>
                  <Link
                    to="/reservar"
                    search={{ type: r.type, guests: r.guests }}
                    className="rounded-full bg-primary text-primary-foreground hover:opacity-90 px-4 py-2.5 text-sm font-medium"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* RESERVA DIRETA = BENEFÍCIOS */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Reserva direta</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Reserve com a gente e pague menos.</h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">Sem comissão de intermediário. O valor que você economiza fica com você.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { i: Heart, t: "10% de desconto", d: "Reservando direto pelo site, WhatsApp ou recepção." },
              { i: ShieldCheck, t: "Atendimento humano", d: "Fale com a pousada, sem robô. Tira dúvidas e ajuda na estadia." },
              { i: Star, t: "Melhores condições", d: "Flexibilidade de check-in, cortesias e upgrade quando disponível." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="rounded-2xl bg-card border border-border/60 p-6 hover:border-primary/40 transition">
                <div className="h-11 w-11 rounded-full bg-primary/10 grid place-items-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/reservar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-95 px-7 py-4 text-base font-semibold shadow-lg shadow-primary/20"
            >
              <Calendar className="h-5 w-5" />
              Reservar online com 10% off
            </Link>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">A pousada</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Ambientes pensados pro seu descanso.</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {[f5, f6, f7, f8, f9, f11, f1, f2].map((img, i) => (
            <div key={i} className={`overflow-hidden rounded-xl bg-card ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
              <img src={img.url} alt={`Pousada Ilha do Meio - ambiente ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Localização</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Itacimirim, Camaçari — BA.</h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">Praia da Espera, a poucos minutos de Itacimirim, Guarajuba e Praia do Forte. Cerca de 1h do Aeroporto de Salvador.</p>
            <address className="not-italic mt-6 rounded-xl border border-border/60 bg-background p-5 text-sm text-foreground/90 leading-relaxed">
              <div className="font-medium text-foreground">Pousada Ilha do Meio</div>
              <div className="mt-1.5 space-y-0.5">
                <div>Rua Sítio Novo, 7</div>
                <div>Loteamento Santa Maria, Lote 8</div>
                <div>Itacimirim, Camaçari — BA</div>
                <div className="text-muted-foreground">CEP 42823-000</div>
              </div>
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={INSTAGRAM} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-border bg-background hover:bg-muted px-5 py-2.5 text-sm font-medium">
                <Instagram className="h-4 w-4" /> @pousadailhadomeio
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-5 py-2.5 text-sm font-medium">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-black/10">
            <img src={f7.url} alt="Entorno da pousada em Itacimirim" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={f5.url} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-24 sm:py-28 text-center text-white">
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.02]">Garanta sua estadia.</h2>
          <p className="mt-4 text-white/85 sm:text-lg">Disponibilidade limitada para os próximos finais de semana.</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              to="/reservar"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-95 px-8 py-4 text-base font-semibold shadow-2xl shadow-black/40"
            >
              <Calendar className="h-5 w-5" />
              Reservar online
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-white/85 hover:text-white text-sm font-medium underline-offset-4 hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" /> ou falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <div>
              <div className="font-display text-sm text-foreground leading-none">Pousada Ilha do Meio</div>
              <div className="mt-1">© {new Date().getFullYear()} · Itacimirim, Camaçari — BA</div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <a href={INSTAGRAM} target="_blank" rel="noopener" className="hover:text-foreground inline-flex items-center gap-1.5">
              <Instagram className="h-3.5 w-3.5" /> Instagram
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener" className="hover:text-foreground inline-flex items-center gap-1.5">
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-50 flex gap-2">
        <Link
          to="/reservar"
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-3.5 text-sm font-semibold shadow-2xl shadow-black/30"
        >
          <Calendar className="h-4 w-4" />
          Reservar online
        </Link>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener"
          aria-label="WhatsApp"
          className="inline-flex items-center justify-center h-[46px] w-[46px] rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
