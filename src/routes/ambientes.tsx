import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  AirVent,
  Wifi,
  MonitorPlay,
  Refrigerator,
  Users,
  Sofa,
  UtensilsCrossed,
  Gamepad2,
  Sunset,
  ShieldCheck,
  Expand,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryLightbox, type GalleryItem } from "@/components/GalleryLightbox";
import { cn } from "@/lib/utils";

import fachadaNoite from "@/assets/acomodacoes-fachada-hd.jpg";
import recepcaoNoite1 from "@/assets/recepcao-noite-1.png";
import recepcaoNoite2 from "@/assets/recepcao-noite-2.png";
import quiosqueJardim from "@/assets/quiosque-jardim.jpg";
import piscinaNoite from "@/assets/piscina-noite.jpg";
import piscinaHero from "@/assets/piscina-hero-clean.jpg";
import piscinaDeck from "@/assets/piscina-aerea.png";
import piscinaNoiteArvore from "@/assets/piscina-noite-arvore.png";
import piscinaNoitePergola from "@/assets/piscina-noite-pergola.png";
import bgCoqueiros from "@/assets/bg-coqueiros-escuro.jpg";

import quartoDuplo from "@/assets/quarto-duplo-cover-hd.jpg";
import quartoDuploAlt from "@/assets/quarto-duplo-varanda-hd.jpg";
import quartoQuadruplo from "@/assets/quarto-quadruplo-1.png";
import quartoQuadruplo2 from "@/assets/quarto-quadruplo-2.png";
import quartoQuadruplo3 from "@/assets/quarto-quadruplo-3.png";
import salaoJogos from "@/assets/salao-jogos-v2.jpg";
import salaoJogosBilhar from "@/assets/salao-jogos-bilhar.jpg";
import salaoJogosMesa from "@/assets/salao-jogos-mesa-hd.jpg";

const WHATSAPP =
  "https://api.whatsapp.com/send/?phone=557191263096&text=" +
  encodeURIComponent(
    "Olá! Vim pelo site da Pousada Ilha do Meio e quero ver a disponibilidade dos ambientes.",
  );

type Ambiente = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  gallery: GalleryItem[];
  amenities: { icon: React.ComponentType<{ className?: string }>; label: string }[];
};

const AMBIENTES: Ambiente[] = [
  {
    id: "suites",
    index: "01",
    title: "Suítes em madeira",
    subtitle: "Conforto e charme em cada detalhe",
    description:
      "Cabines com fachada amarela, varanda de madeira e ambiente acolhedor. Cama confortável, ar-condicionado silencioso e o clima de Itacimirim entrando pela janela.",
    cover: fachadaNoite,
    gallery: [
      { src: fachadaNoite, caption: "Fachada das cabines", desc: "Fachada amarela iluminada em meio ao jardim." },
      { src: quartoDuplo, caption: "Quarto duplo", desc: "Cama de casal, ar-condicionado, TV e frigobar." },
      { src: quartoDuploAlt, caption: "Varanda privativa", desc: "Varanda em madeira, ideal pro café da manhã." },
      { src: quartoQuadruplo, caption: "Quarto quádruplo", desc: "Ideal para famílias e grupos de amigos." },
      { src: quartoQuadruplo2, caption: "Quarto quádruplo — detalhes", desc: "Espaço amplo, roupa de cama macia." },
      { src: quartoQuadruplo3, caption: "Quarto quádruplo — vista", desc: "Vista para o jardim da pousada." },
    ],
    amenities: [
      { icon: AirVent, label: "Ar-condicionado" },
      { icon: Wifi, label: "Wi-Fi grátis" },
      { icon: MonitorPlay, label: "Smart TV" },
      { icon: Refrigerator, label: "Frigobar" },
      { icon: Users, label: "Até 4 pessoas" },
    ],
  },
  {
    id: "piscina",
    index: "02",
    title: "Piscina & deck",
    subtitle: "Para refrescar sem sair da pousada",
    description:
      "Piscina iluminada com deck em madeira, espreguiçadeiras e sombra dos coqueiros. A poucos passos da porta do quarto — perfeita pro fim de tarde.",
    cover: piscinaHero,
    gallery: [
      { src: piscinaHero, caption: "Piscina de dia", desc: "Água cristalina, deck de madeira e coqueiros ao redor." },
      { src: piscinaNoitePergola, caption: "Pérgola e piscina iluminada", desc: "Pérgola com iluminação suave, mesas ao redor e piscina refletindo as luzes da pousada." },
      { src: piscinaNoiteArvore, caption: "Piscina sob a copa das árvores", desc: "Deck de madeira, luzes quentes e a copa da amendoeira emoldurando a piscina." },
      { src: piscinaNoite, caption: "Piscina à noite", desc: "Piscina iluminada, ambiente romântico." },
      { src: piscinaDeck, caption: "Vista aérea", desc: "Deck cercado pela vegetação nativa." },
    ],
    amenities: [
      { icon: Sunset, label: "Deck de madeira" },
      { icon: Sofa, label: "Espreguiçadeiras" },
      { icon: ShieldCheck, label: "Iluminação noturna" },
    ],
  },
  {
    id: "convivencia",
    index: "03",
    title: "Área de convivência",
    subtitle: "Quiosque, jardim e salão de jogos",
    description:
      "Espaço ao ar livre pra descansar entre um passeio e outro. Quiosque com sombra, mesas para conversar e jardim que respira o clima da Bahia.",
    cover: salaoJogos,
    gallery: [
      { src: salaoJogos, caption: "Salão de jogos", desc: "Bilhar, mesa e ambiente para todos." },
      { src: salaoJogosBilhar, caption: "Mesa de bilhar", desc: "Diversão garantida em qualquer horário." },
      { src: salaoJogosMesa, caption: "Salão — mesa central", desc: "Ambiente climatizado e aconchegante." },
    ],
    amenities: [
      { icon: UtensilsCrossed, label: "Quiosque" },
      { icon: Gamepad2, label: "Salão de jogos" },
      { icon: Sofa, label: "Áreas de descanso" },
    ],
  },
  {
    id: "recepcao",
    index: "04",
    title: "Recepção & atendimento",
    subtitle: "Do check-in ao check-out, sem pressa",
    description:
      "Recepção acolhedora e atendimento local que conhece Itacimirim de verdade. Dicas de praia, restaurantes e passeios — antes mesmo de você chegar.",
    cover: recepcaoNoite1,
    gallery: [
      { src: recepcaoNoite1, caption: "Recepção iluminada à noite", desc: "Estrutura de troncos de madeira, luzes quentes e ambiente aconchegante para o check-in." },
      { src: recepcaoNoite2, caption: "Área de convivência da recepção", desc: "Mesas de madeira, lustres artesanais e decoração inspirada no mar." },
    ],
    amenities: [
      { icon: ShieldCheck, label: "Check-in fácil" },
      { icon: WhatsAppIcon as unknown as React.ComponentType<{ className?: string }>, label: "Suporte no WhatsApp" },
      { icon: Users, label: "Atendimento local" },
    ],
  },
];

export const Route = createFileRoute("/ambientes")({
  head: () => ({
    meta: [
      { title: "Ambientes — Pousada Ilha do Meio · Itacimirim/BA" },
      {
        name: "description",
        content:
          "Conheça cada ambiente da Pousada Ilha do Meio em Itacimirim: suítes em madeira, piscina iluminada, área de convivência e recepção acolhedora.",
      },
      { property: "og:title", content: "Ambientes — Pousada Ilha do Meio" },
      {
        property: "og:description",
        content:
          "Um tour completo pelos espaços da pousada — suítes, piscina, convivência e recepção.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AmbientesPage,
});

function AmbientesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />
      <HeroAmbientes />
      <main>
        {AMBIENTES.map((a, idx) => (
          <AmbienteBlock key={a.id} ambiente={a} reversed={idx % 2 === 1} />
        ))}
      </main>
      <CTAReserva />
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------------- */
/* Header                                    */
/* ---------------------------------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="group flex items-center gap-2" aria-label="Voltar para o início">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition group-hover:bg-accent">
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </span>
          <Logo className="h-12 w-12 sm:h-14 sm:w-14 drop-shadow-sm" />
        </Link>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/20 transition hover:brightness-110"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span className="hidden xs:inline">Reservar</span>
        </a>
      </div>
    </header>
  );
}

/* ---------------------------------------- */
/* Hero                                      */
/* ---------------------------------------- */

function HeroAmbientes() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-card">
      <div aria-hidden className="absolute inset-0">
        <img
          src={fachadaNoite}
          alt=""
          className="h-full w-full object-cover opacity-40"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          A pousada · Itacimirim/BA
        </p>
        <h1
          className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] sm:text-6xl"
          style={{ textShadow: "0 2px 22px rgba(0,0,0,0.35)" }}
        >
          Todos os ambientes,
          <br className="hidden sm:block" /> em detalhe.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Um tour visual pelos espaços da Pousada Ilha do Meio — das suítes em madeira à piscina iluminada. Toque em qualquer imagem para abrir a galeria em tela cheia.
        </p>
        <nav aria-label="Índice de ambientes" className="mt-8 flex flex-wrap gap-2">
          {AMBIENTES.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium text-foreground backdrop-blur transition hover:bg-card"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-primary">{a.index}</span>
              {a.title}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

/* ---------------------------------------- */
/* Bloco de ambiente (uma única Lightbox)    */
/* ---------------------------------------- */

function AmbienteBlock({ ambiente, reversed }: { ambiente: Ambiente; reversed: boolean }) {
  const { id, index, title, subtitle, description, cover, gallery, amenities } = ambiente;
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const open = React.useCallback((idx: number, el?: HTMLButtonElement | null) => {
    if (el) triggerRef.current = el;
    setOpenIndex(Math.max(0, Math.min(gallery.length - 1, idx)));
  }, [gallery.length]);

  const handleChange = React.useCallback((idx: number | null) => {
    setOpenIndex(idx);
    if (idx === null) triggerRef.current?.focus?.();
  }, []);

  const thumbs = gallery.slice(1, 5);

  return (
    <section id={id} className="scroll-mt-20 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12",
            reversed && "lg:[&>*:first-child]:order-2",
          )}
        >
          {/* Cover clicável */}
          <div className="lg:col-span-7">
            <button
              type="button"
              onClick={(e) => open(0, e.currentTarget)}
              aria-label={`Abrir galeria de ${title}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-card transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:aspect-[16/10] sm:rounded-3xl"
            >
              <img
                src={cover}
                alt={`${title} — ${subtitle}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white ring-1 ring-white/20 backdrop-blur-md sm:text-[11px]">
                  <span className="text-primary/90">{index}</span>
                  {title}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-foreground shadow-lg transition group-hover:brightness-105 sm:bottom-5 sm:right-5 sm:text-sm">
                <Expand className="h-4 w-4" aria-hidden />
                Ver {gallery.length} fotos
              </div>
            </button>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              {index} — {title}
            </p>
            <h2 className="mt-3 font-display text-3xl leading-[1.05] sm:text-4xl">{title}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted-foreground/90">{subtitle}</p>
            <p className="mt-5 text-base leading-relaxed text-foreground/85">{description}</p>

            <ul className="mt-6 grid grid-cols-2 gap-2.5" aria-label={`Detalhes de ${title}`}>
              {amenities.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-foreground/90"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={(e) => open(0, e.currentTarget)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition hover:brightness-110"
              >
                Explorar galeria
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Reservar
              </a>
            </div>

            {thumbs.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Mais fotos
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {thumbs.map((g, i) => (
                    <button
                      key={g.src}
                      type="button"
                      onClick={(e) => open(i + 1, e.currentTarget)}
                      aria-label={`Abrir ${g.caption}`}
                      className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <img
                        src={g.src}
                        alt={g.caption}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 ring-1 ring-inset ring-white/10 transition group-hover:ring-white/25"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox — uma instância por bloco, controlada */}
      <GalleryLightbox
        items={gallery}
        openIndex={openIndex}
        onOpenIndexChange={handleChange}
      />
    </section>
  );
}

/* ---------------------------------------- */
/* CTA final                                 */
/* ---------------------------------------- */

function CTAReserva() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border/40">
      {/* Wallpaper coqueiros — verde escuro */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgCoqueiros})` }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:py-20 text-white">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary-foreground/90">
          Pronto pra reservar?
        </p>
        <h2 className="mt-3 font-display text-3xl leading-[1.05] sm:text-5xl text-white">
          Sua estadia começa aqui.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Tire dúvidas, veja disponibilidade e reserve direto pelo WhatsApp — falamos com você em minutos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-black/25 transition hover:brightness-110 sm:text-base"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Reservar no WhatsApp
          </a>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}
