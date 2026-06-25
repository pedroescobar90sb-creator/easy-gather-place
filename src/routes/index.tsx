import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Wifi, Wind, Tv, Refrigerator, Star, MessageCircle, Calendar, ShieldCheck, Heart, Instagram } from "lucide-react";
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

const WHATSAPP = "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20na%20Pousada%20Ilha%20do%20Meio.";
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { name: "description", content: "Pousada boutique em Itacimirim a poucos minutos das praias. Quartos com ar-condicionado, TV e frigobar. Reserve direto e ganhe 10% off." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim" },
      { property: "og:description", content: "Sua estadia tranquila em Itacimirim — Costa dos Coqueiros, Bahia. Reserve direto e economize." },
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
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-background/85 border-b border-border/60">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <a href="#top" className="font-display text-base sm:text-lg tracking-tight">
            Pousada <span className="text-primary">Ilha do Meio</span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-3 py-2 text-xs sm:text-sm font-medium hover:bg-emerald-700 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xs:inline">WhatsApp</span>
              <span className="xs:hidden">Reservar</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative">
        <div className="absolute inset-0">
          <img src={f0.url} alt="Pousada Ilha do Meio em Itacimirim" className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs">
            <MapPin className="h-3.5 w-3.5" />
            Itacimirim · Costa dos Coqueiros · BA
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Sua pausa tranquila a 2 minutos do mar.
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-white/85">
            Pousada boutique com 17 quartos, ar-condicionado, frigobar e café da manhã. Reserve direto e ganhe <strong className="text-white">10% de desconto</strong>.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 text-base font-semibold shadow-lg shadow-emerald-900/30 transition"
            >
              <MessageCircle className="h-5 w-5" />
              Reservar pelo WhatsApp
            </a>
            <a
              href="#acomodacoes"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white px-6 py-4 text-base font-semibold transition"
            >
              <Calendar className="h-5 w-5" />
              Ver acomodações
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> Avaliações 9.4 Booking</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Reserva direta sem comissão</span>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/60">
          {[
            { n: "17", l: "Quartos" },
            { n: "42", l: "Hóspedes" },
            { n: "2 min", l: "Da praia" },
            { n: "10%", l: "Off reserva direta" },
          ].map((s) => (
            <div key={s.l} className="bg-card px-4 py-5 text-center">
              <div className="font-display text-2xl sm:text-3xl text-primary">{s.n}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ACOMODAÇÕES */}
      <section id="acomodacoes" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Acomodações</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Conforto para casal, família ou grupo.</h2>
          <p className="mt-3 text-muted-foreground">Todos os quartos com ar-condicionado, TV, frigobar e cama confortável. Diárias incluem café da manhã.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { img: f2.url, name: "Duplo Casal", capacity: "2 pessoas", count: 10, price: "R$ 450" },
            { img: f3.url, name: "Triplo", capacity: "3 pessoas", count: 3, price: "R$ 550" },
            { img: f4.url, name: "Quádruplo", capacity: "4 pessoas", count: 4, price: "R$ 650" },
          ].map((r) => (
            <article key={r.name} className="group overflow-hidden rounded-2xl bg-card border border-border/60 flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.img} alt={r.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl">{r.name}</h3>
                  <span className="text-xs text-muted-foreground">{r.count} quartos</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{r.capacity}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Wind className="h-3.5 w-3.5" /> Ar</span>
                  <span className="inline-flex items-center gap-1"><Tv className="h-3.5 w-3.5" /> TV</span>
                  <span className="inline-flex items-center gap-1"><Refrigerator className="h-3.5 w-3.5" /> Frigobar</span>
                  <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" /> Wi-Fi</span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] text-muted-foreground">a partir de</div>
                    <div className="font-display text-2xl text-primary">{r.price}<span className="text-xs text-muted-foreground font-sans">/noite</span></div>
                  </div>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium"
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* RESERVA DIRETA = BENEFÍCIOS */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Reserva direta</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Reserve com a gente e pague menos.</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { i: Heart, t: "10% de desconto", d: "Reservando direto pelo WhatsApp ou recepção, sem comissão de intermediário." },
              { i: ShieldCheck, t: "Atendimento humano", d: "Falar direto com a pousada, sem robô. Tira dúvidas antes e ajuda durante a estadia." },
              { i: Star, t: "Melhores condições", d: "Flexibilidade de check-in, cortesias e upgrade quando disponível." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="rounded-2xl bg-card border border-border/60 p-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 text-base font-semibold shadow-lg shadow-emerald-900/20"
            >
              <MessageCircle className="h-5 w-5" />
              Falar agora no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">A pousada</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Ambientes pensados pro seu descanso.</h2>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {[f5, f6, f7, f8, f9, f11, f1, f2].map((img, i) => (
            <div key={i} className={`overflow-hidden rounded-xl bg-card ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
              <img src={img.url} alt={`Pousada Ilha do Meio - ambiente ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Localização</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Itacimirim, Bahia.</h2>
            <p className="mt-3 text-muted-foreground">A poucos minutos das praias de Itacimirim, Guarajuba e Praia do Forte. Cerca de 1h do Aeroporto de Salvador.</p>
            <address className="not-italic mt-5 text-sm text-foreground/85">
              Rua Sítio Novo, 7 — Loteamento Santa Maria, Lote 8<br />
              Itacimirim, Camaçari — BA · CEP 42823-000
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={WHATSAPP} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-medium">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-border bg-background hover:bg-muted px-5 py-3 text-sm font-medium">
                <Instagram className="h-4 w-4" /> @pousadailhadomeio
              </a>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img src={f7.url} alt="Entorno da pousada em Itacimirim" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={f5.url} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center text-white">
          <h2 className="font-display text-3xl sm:text-5xl">Garanta sua estadia.</h2>
          <p className="mt-3 text-white/85">Disponibilidade limitada para os próximos finais de semana. Fale com a gente agora.</p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-4 text-base font-semibold shadow-lg shadow-emerald-900/30"
          >
            <MessageCircle className="h-5 w-5" />
            Reservar pelo WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Pousada Ilha do Meio · Itacimirim, BA</div>
          <div className="flex items-center gap-4">
            <a href={INSTAGRAM} target="_blank" rel="noopener" className="hover:text-foreground inline-flex items-center gap-1">
              <Instagram className="h-3.5 w-3.5" /> Instagram
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener" className="hover:text-foreground inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY WHATSAPP */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener"
        aria-label="Reservar pelo WhatsApp"
        className="md:hidden fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3.5 text-sm font-semibold shadow-2xl shadow-emerald-900/40"
      >
        <MessageCircle className="h-5 w-5" />
        Reservar
      </a>
    </div>
  );
}
