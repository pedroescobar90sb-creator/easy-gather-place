import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star, ShieldCheck, Check, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SiteFooter } from "@/components/SiteFooter";
import f0 from "@/assets/pousada-0.jpg.asset.json";
import f1 from "@/assets/pousada-1.jpg.asset.json";
import f2 from "@/assets/pousada-2.jpg.asset.json";
import f5 from "@/assets/pousada-5.jpg.asset.json";
import f6 from "@/assets/pousada-6.jpg.asset.json";
import f7 from "@/assets/pousada-7.jpg.asset.json";
import f8 from "@/assets/pousada-8.jpg.asset.json";
import f9 from "@/assets/pousada-9.jpg.asset.json";

const WHATSAPP_MESSAGE = "Olá! Vim pelo site da Pousada Ilha do Meio e quero reservar. Pode me passar disponibilidade e valores?";
const WHATSAPP = `https://api.whatsapp.com/send/?phone=557191263096&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia — Reserve pelo WhatsApp" },
      { name: "description", content: "Pousada em Itacimirim (BA), a 2 minutos do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { property: "og:description", content: "Atendimento direto com a casa. Reserve em minutos pelo WhatsApp." },
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
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-5 py-2.5 text-sm font-semibold transition"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Reservar pelo WhatsApp
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={f0.url} alt="Pousada Ilha do Meio em Itacimirim" className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/80" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-32 sm:pb-36 text-white">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] opacity-90">
            <MapPin className="h-3.5 w-3.5" />
            Itacimirim · Bahia
          </div>
          <h1 className="mt-5 font-display font-medium text-5xl sm:text-7xl leading-[1.02] tracking-tight max-w-3xl">
            O sossego da Bahia,<br />a dois minutos do mar.
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
            Pousada autoral em Itacimirim, entre Guarajuba e Praia do Forte.
            Atendimento direto com a casa, melhor tarifa garantida e reserva em minutos pelo WhatsApp.
          </p>

          <div className="mt-7">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-4 text-base font-semibold shadow-2xl shadow-black/30 transition"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Reservar pelo WhatsApp
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
            <li className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 9.4 no Booking</li>
            <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Atendimento direto com a casa</li>
            <li className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" /> Melhor tarifa garantida</li>
          </ul>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40">
          {[
            { n: "2 min", l: "Da praia" },
            { n: "9.4", l: "Avaliação dos hóspedes" },
            { n: "Direto", l: "Sem intermediário" },
          ].map((s) => (
            <div key={s.l} className="bg-card px-4 py-6 text-center">
              <div className="font-display text-2xl sm:text-3xl text-primary">{s.n}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">A pousada</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Ambientes pensados pro seu descanso.</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {[f5, f6, f7, f8, f9, f1].map((img, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-card aspect-square">
              <img src={img.url} alt={`Pousada Ilha do Meio - ambiente ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-4 text-base font-semibold"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Ver opções e valores no WhatsApp
          </a>
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Localização</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Itacimirim, Camaçari — BA.</h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">Praia da Espera, a poucos minutos de Guarajuba e Praia do Forte. Cerca de 1h do Aeroporto de Salvador.</p>
            <address className="not-italic mt-6 rounded-xl border border-border/60 bg-background p-5 text-sm text-foreground/90 leading-relaxed">
              <div className="font-medium text-foreground">Pousada Ilha do Meio</div>
              <div className="mt-1.5 space-y-0.5">
                <div>Rua Sítio Novo, 7</div>
                <div>Loteamento Santa Maria, Lote 8</div>
                <div>Itacimirim, Camaçari — BA</div>
                <div className="text-muted-foreground">CEP 42823-000</div>
              </div>
            </address>
            <div className="mt-6">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 text-sm font-semibold"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Tirar dúvidas no WhatsApp
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
          <img src={f2.url} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-24 sm:py-28 text-center text-white">
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.02]">Garanta sua estadia.</h2>
          <p className="mt-4 text-white/85 sm:text-lg">Disponibilidade limitada para os próximos finais de semana. Responda em minutos.</p>
          <div className="mt-8">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-base font-semibold shadow-2xl shadow-black/40"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Reservar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-50">
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3.5 text-sm font-semibold shadow-2xl shadow-emerald-900/40"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Reservar pelo WhatsApp
        </a>
      </div>

      {/* hidden link for crawlers */}
      <a href={INSTAGRAM} className="sr-only">Instagram</a>
    </div>
  );
}
