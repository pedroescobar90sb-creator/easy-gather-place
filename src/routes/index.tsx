import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star, ShieldCheck, Check, ExternalLink, Snowflake, Tv, Refrigerator, Camera, Wifi, Coffee } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { Testimonials } from "@/components/Testimonials";
import { ImmersiveVideoSection } from "@/components/ImmersiveVideoSection";


import heroPousada from "@/assets/pousada-0.jpg.asset.json";

import recepcaoDia from "@/assets/recepcao-dia.jpg.asset.json";
import quiosqueJardim from "@/assets/quiosque-jardim.jpg.asset.json";
import fachadaNoite from "@/assets/fachada-noite.jpg.asset.json";
import piscinaNoite from "@/assets/piscina-noite.jpg.asset.json";
import salaoJogosUrl from "@/assets/salao-jogos-v2.jpg";
const salaoJogos = { url: salaoJogosUrl };

import quartoDuplo from "@/assets/quarto-duplo-v2.jpg.asset.json";
import quartoDuploAlt from "@/assets/quarto-duplo.jpg.asset.json";
import quartoTriplo from "@/assets/quarto-triplo-v2.jpg.asset.json";
import quartoTriploAlt from "@/assets/quarto-triplo.jpg.asset.json";
import quartoQuadruplo from "@/assets/quarto-quadruplo.jpg.asset.json";
import bgPraiaDesktop from "@/assets/bg-praia-aereo-desktop.jpg.asset.json";
import bgPraiaMobile from "@/assets/bg-praia-aereo-mobile.jpg.asset.json";

const wa = (msg: string) => `https://api.whatsapp.com/send/?phone=557191263096&text=${encodeURIComponent(msg)}`;
const WHATSAPP = wa("Olá! Vim pelo site da Pousada Ilha do Meio e quero ver a disponibilidade e os valores.");
const WHATSAPP_CONFIRM = wa("Olá! Vim pelo site da Pousada Ilha do Meio e quero confirmar minha reserva. Pode me ajudar?");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia — Reserve pelo WhatsApp" },
      { name: "description", content: "Pousada em Itacimirim (BA), a 2 minutos do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { property: "og:description", content: "Atendimento direto com a casa. Reserve em minutos pelo WhatsApp." },
      { property: "og:image", content: heroPousada.url },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

type RoomPhoto = { src: string; caption: string; desc: string };
type RoomCard = {
  name: string;
  price: string;
  image: string;
  alt: string;
  capacity: string;
  cta: string;
  waMsg: string;
  photos: RoomPhoto[];
};

const ROOMS: RoomCard[] = [
  {
    name: "Quarto Duplo",
    capacity: "Ideal para casal · 2 pessoas",
    price: "R$ 400/noite",
    image: quartoDuplo.url,
    alt: "Quarto Duplo da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Duplo",
    waMsg: "Olá! Quero reservar o Quarto Duplo (2 pessoas) da Pousada Ilha do Meio. Pode me passar disponibilidade e valores?",
    photos: [
      { src: quartoDuplo.url, caption: "Quarto Duplo · Vista geral", desc: "Ambiente confortável, ideal para casais." },
      { src: quartoDuploAlt.url, caption: "Quarto Duplo · Detalhe", desc: "Iluminação suave e acabamento aconchegante." },
    ],
  },
  {
    name: "Quarto Triplo",
    capacity: "Ideal para pequenos grupos ou família · 3 pessoas",
    price: "R$ 500/noite",
    image: quartoTriplo.url,
    alt: "Quarto Triplo da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Triplo",
    waMsg: "Olá! Quero reservar o Quarto Triplo (3 pessoas) da Pousada Ilha do Meio. Pode me passar disponibilidade e valores?",
    photos: [
      { src: quartoTriplo.url, caption: "Quarto Triplo · Vista geral", desc: "Espaço para três, sem abrir mão do conforto." },
      { src: quartoTriploAlt.url, caption: "Quarto Triplo · Detalhe", desc: "Camas bem dispostas e ambiente arejado." },
    ],
  },
  {
    name: "Quarto Quádruplo",
    capacity: "Ideal para família · 4 pessoas",
    price: "R$ 550/noite",
    image: quartoQuadruplo.url,
    alt: "Quarto Quádruplo da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Quádruplo",
    waMsg: "Olá! Quero reservar o Quarto Quádruplo (4 pessoas) da Pousada Ilha do Meio. Pode me passar disponibilidade e valores?",
    photos: [
      { src: quartoQuadruplo.url, caption: "Quarto Quádruplo · Vista geral", desc: "Pensado para a família toda descansar junto." },
      { src: quartoTriplo.url, caption: "Quarto Quádruplo · Detalhe", desc: "Boa circulação e camas confortáveis." },
    ],
  },
];

const ROOM_AMENITIES = [
  { icon: Snowflake, label: "Ar-condicionado" },
  { icon: Tv, label: "TV" },
  { icon: Refrigerator, label: "Frigobar" },
  { icon: Coffee, label: "Café da manhã" },
  { icon: Wifi, label: "Wi-Fi grátis" },
];

const GALLERY = [
  { src: recepcaoDia.url, caption: "Recepção", desc: "Recepção pronta para te atender, do check-in ao check-out." },
  { src: quiosqueJardim.url, caption: "Área de Convivência", desc: "Espaço de convivência para relaxar entre um passeio e outro." },
  { src: fachadaNoite.url, caption: "Acomodações", desc: "Quartos confortáveis, pensados pro seu descanso." },
  { src: piscinaNoite.url, caption: "Piscina", desc: "Piscina para refrescar o dia, a poucos passos do quarto." },
];


function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center">
            <Logo className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-sm" />
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-4 sm:px-5 py-2.5 text-sm font-semibold transition"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Reservar pelo WhatsApp
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPousada.url} alt="Piscina e área externa da Pousada Ilha do Meio" className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
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
            Hospedagem em Itacimirim, entre Guarajuba e Praia do Forte.
            Atendimento direto com a recepção e reserva confirmada em minutos pelo WhatsApp.
          </p>

          <div className="mt-7">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-7 py-4 text-base font-semibold shadow-2xl shadow-black/30 transition"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Ver disponibilidade no WhatsApp
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-base text-white/90">
            <li className="inline-flex items-center gap-2"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> 9,2 · 204 avaliações reais</li>
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Atendimento direto com a casa</li>
            <li className="inline-flex items-center gap-2"><Check className="h-5 w-5" /> Melhor tarifa garantida</li>
          </ul>
        </div>
      </section>

      {/* EXPERIÊNCIA EM VÍDEO */}
      <ImmersiveVideoSection />

      {/* TRUST BAR */}
      <section className="relative isolate border-y border-border/60 overflow-hidden">
        {/* Background — mobile (portrait) */}
        <img
          src={bgPraiaMobile.url}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center sm:hidden"
        />
        {/* Background — desktop (wide) */}
        <img
          src={bgPraiaDesktop.url}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center hidden sm:block"
        />
        {/* Legibility overlays — stronger on mobile, lighter on desktop */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-card/85 sm:bg-card/70" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-card/40 via-transparent to-card/40 hidden sm:block" />

        <div className="relative mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/20">
          {[
            { n: "2 min", l: "Da praia" },
            { n: "9,2", l: "Nota dos hóspedes (204 avaliações)" },
            { n: "Direto", l: "Sem intermediário" },
          ].map((s) => (
            <div key={s.l} className="px-4 py-8 sm:py-10 text-center backdrop-blur-[2px]">
              <div className="font-display text-3xl sm:text-4xl text-primary drop-shadow-sm">{s.n}</div>
              <div className="text-xs sm:text-sm text-foreground/80 mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* A POUSADA — GALERIA */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">A pousada</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Ambientes pensados pro seu descanso.</h2>
        </div>
        <div className="mt-10">
          <GalleryLightbox
            items={GALLERY}
            trigger={
              <button
                type="button"
                className="group relative block w-full overflow-hidden rounded-3xl bg-card aspect-[16/9] sm:aspect-[21/9] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Abrir galeria de ambientes"
              >
                <img
                  src={GALLERY[0].src}
                  alt="Ambientes da Pousada Ilha do Meio"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-4">
                  <div className="text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/80">Galeria</p>
                    <p className="mt-1 font-display text-xl sm:text-2xl">Explore os ambientes</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs sm:text-sm font-medium text-foreground shadow-sm transition group-hover:bg-white">
                    Ver galeria ({GALLERY.length})
                  </span>
                </div>
              </button>
            }
          />
        </div>
      </section>

      {/* AVALIAÇÕES REAIS */}
      <section id="avaliacoes" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Avaliações reais</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Nota 9,2 — Fantástico.</h2>
            <p className="mt-4 text-muted-foreground">
              <strong className="text-foreground">204 avaliações reais</strong> de hóspedes em plataformas
              especializadas de viagem. Nossa meta é manter avaliações 100% autênticas, refletindo a experiência
              de famílias, casais, grupos de amigos e viajantes individuais que já se hospedaram conosco.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { score: "9,6", label: "Funcionários", desc: "Simpatia, acolhimento e atendimento próximo." },
              { score: "9,1", label: "Limpeza", desc: "Quartos sempre bem cuidados e funcionais." },
              { score: "9,0", label: "Conforto", desc: "Acomodações pensadas pro seu descanso." },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl text-primary">{s.score}</span>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="mt-2 font-medium">{s.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Destaques recorrentes: <strong className="text-foreground">área verde</strong>,{" "}
            <strong className="text-foreground">localização privilegiada</strong> e{" "}
            <strong className="text-foreground">café da manhã</strong>, com variedade e qualidade constantes.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl text-primary">9,2</span>
                <span className="text-sm font-medium text-muted-foreground">— Fantástico</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Booking.com · 204 avaliações reais</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl text-primary">4,6</span>
                <span className="text-sm font-medium text-muted-foreground">de 5</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Google · 272 avaliações</div>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Veja nossas avaliações reais no{" "}
            <a
              href="https://www.booking.com/hotel/br/pousada-ilha-do-meio.pt-br.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:text-primary transition"
            >
              Booking.com
              <ExternalLink className="h-3.5 w-3.5" />
            </a>{" "}
            e no{" "}
            <a
              href="https://www.google.com/travel/search?q=pousada%20ilha%20do%20meio%20avalia%C3%A7%C3%A3o%20google"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:text-primary transition"
            >
              Google
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            .
          </p>
        </div>
      </section>

      {/* LAZER — SALÃO DE JOGOS */}
      <section className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Lazer</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Para quem busca conforto e diversão.</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 items-center">
            <figure className="md:col-span-3 group relative overflow-hidden rounded-2xl bg-background aspect-video">
              <img src={salaoJogos.url} alt="Salão de Jogos da Pousada Ilha do Meio" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5">
                <figcaption className="text-white text-base font-semibold tracking-wide">Salão de Jogos</figcaption>
              </div>
            </figure>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">Experiência</p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl leading-tight">Diversão sem sair da pousada.</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                O salão de jogos é o ponto de encontro entre famílias, casais e grupos de amigos — espaço pensado para quem quer relaxar entre um passeio e outro, com clima leve e descontraído.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                <li className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Ambiente reservado para hóspedes</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Ideal para finais de tarde e noites</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Próximo à área de convivência</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ACOMODAÇÕES */}
      <section id="acomodacoes" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Acomodações</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Escolha seu quarto ideal.</h2>
          <p className="mt-3 text-muted-foreground">Todos os quartos com ar-condicionado, TV, frigobar, café da manhã e Wi-Fi inclusos.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {ROOMS.map((r) => (
            <article key={r.name} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                <img src={r.image} alt={r.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <GalleryLightbox
                  items={r.photos}
                  trigger={
                    <button
                      type="button"
                      aria-label={`Ver fotos do ${r.name}`}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 text-white backdrop-blur-md hover:bg-black/75 px-3.5 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Ver fotos do quarto
                    </button>
                  }
                />
              </div>
              <div className="flex flex-col gap-4 p-5 flex-1">
                <div>
                  <h3 className="font-display text-xl">{r.name}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{r.capacity}</div>
                </div>

                <ul className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                  {ROOM_AMENITIES.slice(0, 3).map(({ icon: Icon, label }) => (
                    <li key={label} className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/50 py-2.5">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-center leading-tight">{label}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Coffee className="h-3.5 w-3.5" /> Café da manhã</span>
                  <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" /> Wi-Fi grátis</span>
                </div>

                <div className="text-primary text-lg font-medium tabular-nums">{r.price}</div>

                <a
                  href={wa(r.waMsg)}
                  target="_blank"
                  rel="noopener"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-5 py-3 text-sm font-semibold transition"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {r.cta}
                </a>
              </div>
            </article>
          ))}
        </div>

      </section>

      {/* LOCALIZAÇÃO */}
      <section className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Localização</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">Itacimirim, Camaçari — BA.</h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">A 2 minutos da praia, entre Guarajuba e Praia do Forte. Cerca de 1h do Aeroporto de Salvador.</p>
            <address className="not-italic mt-6 rounded-xl border border-border/60 bg-background p-5 text-sm text-foreground/90 leading-relaxed">
              <div className="font-medium text-foreground">Pousada Ilha do Meio</div>
              <div className="mt-1.5 space-y-0.5">
                <div>Rua Sítio Novo, 7</div>
                <div>Loteamento Santa Maria, Lote 8</div>
                <div>Itacimirim, Camaçari — BA</div>
                <div className="text-muted-foreground">CEP 42823-000</div>
              </div>
            </address>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-black/10">
            <img src={quiosqueJardim.url} alt="Entorno da pousada em Itacimirim" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <Testimonials />

      {/* FINAL CTA */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={piscinaNoite.url} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-24 sm:py-28 text-center text-white">
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.02]">Garanta sua reserva.</h2>
          <p className="mt-4 text-white/85 sm:text-lg">Fins de semana costumam esgotar primeiro. Fale com a recepção e garanta sua data.</p>
          <div className="mt-8">
            <a
              href={WHATSAPP_CONFIRM}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-8 py-4 text-base font-semibold shadow-2xl shadow-black/40"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Confirmar minha reserva agora
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />

    </div>
  );
}
