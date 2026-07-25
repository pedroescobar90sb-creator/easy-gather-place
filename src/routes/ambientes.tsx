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
import { trackWhatsAppLead } from "@/lib/whatsapp-lead";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

import fachadaNoite from "@/assets/acomodacoes-fachada-hd.jpg";
import recepcaoNoite2 from "@/assets/recepcao-noite-2.webp";
import piscinaNoite from "@/assets/piscina-noite.jpg";
import piscinaHero from "@/assets/piscina-hero-clean.webp";
import piscinaDeck from "@/assets/piscina-drone-aerea.jpg";
import piscinaNoiteArvore from "@/assets/piscina-noite-arvore.webp";
import piscinaNoitePergola from "@/assets/piscina-noite-pergola.webp";
import piscinaMesaJardim from "@/assets/piscina-mesa-jardim.jpg";
import piscinaPergolaDia from "@/assets/piscina-pergola-dia.jpg";
import piscinaCoqueirosDia from "@/assets/piscina-coqueiros-dia.jpg";
// Só a versão reduzida: essa foto é fundo do bloco final e fica atrás de uma camada
// escura, então a original de 396 KB não acrescentava nada visível.
import bgCoqueiros from "@/assets/thumbs/bg-coqueiros-escuro@960.webp";
import quartoDuplo from "@/assets/quarto-duplo-cover-hd.jpg";
import quartoDuploAlt from "@/assets/quarto-duplo-varanda-hd.jpg";
import quartoQuadruplo from "@/assets/quarto-quadruplo-1.webp";
import quartoQuadruplo2 from "@/assets/quarto-quadruplo-2.webp";
import quartoQuadruplo3 from "@/assets/quarto-quadruplo-3.webp";
import quartoTriplo from "@/assets/quarto-triplo-2.jpg";
import salaoJogosBilhar from "@/assets/salao-jogos-bilhar.jpg";
import salaoJogosMesa from "@/assets/salao-jogos-mesa-hd.jpg";

// Variantes reduzidas (geradas por scripts/gen-thumbs.py). As miniaturas do grid são
// exibidas em ~240px, então baixar o original de até 1920x2560 era desperdício puro.
import fachadaNoite480 from "@/assets/thumbs/acomodacoes-fachada-hd@480.webp";
import fachadaNoite960 from "@/assets/thumbs/acomodacoes-fachada-hd@960.webp";
import recepcaoNoite2_480 from "@/assets/thumbs/recepcao-noite-2@480.webp";
import recepcaoNoite2_960 from "@/assets/thumbs/recepcao-noite-2@960.webp";
import piscinaNoite480 from "@/assets/thumbs/piscina-noite@480.webp";
import piscinaNoite960 from "@/assets/thumbs/piscina-noite@960.webp";
import piscinaHero480 from "@/assets/thumbs/piscina-hero-clean@480.webp";
import piscinaHero960 from "@/assets/thumbs/piscina-hero-clean@960.webp";
import piscinaDeck480 from "@/assets/thumbs/piscina-drone-aerea@480.webp";
import piscinaDeck960 from "@/assets/thumbs/piscina-drone-aerea@960.webp";
import piscinaNoiteArvore480 from "@/assets/thumbs/piscina-noite-arvore@480.webp";
import piscinaNoiteArvore960 from "@/assets/thumbs/piscina-noite-arvore@960.webp";
import piscinaNoitePergola480 from "@/assets/thumbs/piscina-noite-pergola@480.webp";
import piscinaNoitePergola960 from "@/assets/thumbs/piscina-noite-pergola@960.webp";
import piscinaMesaJardim480 from "@/assets/thumbs/piscina-mesa-jardim@480.webp";
import piscinaMesaJardim960 from "@/assets/thumbs/piscina-mesa-jardim@960.webp";
import piscinaPergolaDia480 from "@/assets/thumbs/piscina-pergola-dia@480.webp";
import piscinaPergolaDia960 from "@/assets/thumbs/piscina-pergola-dia@960.webp";
import piscinaCoqueirosDia480 from "@/assets/thumbs/piscina-coqueiros-dia@480.webp";
import piscinaCoqueirosDia960 from "@/assets/thumbs/piscina-coqueiros-dia@960.webp";
import quartoDuplo480 from "@/assets/thumbs/quarto-duplo-cover-hd@480.webp";
import quartoDuplo960 from "@/assets/thumbs/quarto-duplo-cover-hd@960.webp";
import quartoDuploAlt480 from "@/assets/thumbs/quarto-duplo-varanda-hd@480.webp";
import quartoDuploAlt960 from "@/assets/thumbs/quarto-duplo-varanda-hd@960.webp";
import quartoQuadruplo480 from "@/assets/thumbs/quarto-quadruplo-1@480.webp";
import quartoQuadruplo960 from "@/assets/thumbs/quarto-quadruplo-1@960.webp";
import quartoQuadruplo2_480 from "@/assets/thumbs/quarto-quadruplo-2@480.webp";
import quartoQuadruplo2_960 from "@/assets/thumbs/quarto-quadruplo-2@960.webp";
import quartoQuadruplo3_480 from "@/assets/thumbs/quarto-quadruplo-3@480.webp";
import quartoQuadruplo3_960 from "@/assets/thumbs/quarto-quadruplo-3@960.webp";
import quartoTriplo480 from "@/assets/thumbs/quarto-triplo-2@480.webp";
import quartoTriplo960 from "@/assets/thumbs/quarto-triplo-2@960.webp";
import salaoJogosBilhar480 from "@/assets/thumbs/salao-jogos-bilhar@480.webp";
import salaoJogosBilhar960 from "@/assets/thumbs/salao-jogos-bilhar@960.webp";
import salaoJogosMesa480 from "@/assets/thumbs/salao-jogos-mesa-hd@480.webp";
import salaoJogosMesa960 from "@/assets/thumbs/salao-jogos-mesa-hd@960.webp";

/** Cada foto com suas variantes e as dimensões reais do original (evitam salto de layout). */
const P = {
  fachadaNoite: { src: fachadaNoite, thumb: fachadaNoite480, mid: fachadaNoite960, width: 1152, height: 928 },
  quartoDuplo: { src: quartoDuplo, thumb: quartoDuplo480, mid: quartoDuplo960, width: 1200, height: 1600 },
  quartoDuploAlt: { src: quartoDuploAlt, thumb: quartoDuploAlt480, mid: quartoDuploAlt960, width: 1200, height: 1600 },
  quartoQuadruplo: { src: quartoQuadruplo, thumb: quartoQuadruplo480, mid: quartoQuadruplo960, width: 1500, height: 1000 },
  quartoQuadruplo2: { src: quartoQuadruplo2, thumb: quartoQuadruplo2_480, mid: quartoQuadruplo2_960, width: 1200, height: 1600 },
  quartoQuadruplo3: { src: quartoQuadruplo3, thumb: quartoQuadruplo3_480, mid: quartoQuadruplo3_960, width: 1200, height: 1600 },
  quartoTriplo: { src: quartoTriplo, thumb: quartoTriplo480, mid: quartoTriplo960, width: 1200, height: 1600 },
  piscinaDeck: { src: piscinaDeck, thumb: piscinaDeck480, mid: piscinaDeck960, width: 691, height: 858 },
  piscinaHero: { src: piscinaHero, thumb: piscinaHero480, mid: piscinaHero960, width: 1600, height: 1600 },
  piscinaNoitePergola: { src: piscinaNoitePergola, thumb: piscinaNoitePergola480, mid: piscinaNoitePergola960, width: 1200, height: 1600 },
  piscinaNoiteArvore: { src: piscinaNoiteArvore, thumb: piscinaNoiteArvore480, mid: piscinaNoiteArvore960, width: 1200, height: 1600 },
  piscinaNoite: { src: piscinaNoite, thumb: piscinaNoite480, mid: piscinaNoite960, width: 1920, height: 2560 },
  piscinaMesaJardim: { src: piscinaMesaJardim, thumb: piscinaMesaJardim480, mid: piscinaMesaJardim960, width: 1200, height: 1600 },
  piscinaPergolaDia: { src: piscinaPergolaDia, thumb: piscinaPergolaDia480, mid: piscinaPergolaDia960, width: 1200, height: 1600 },
  piscinaCoqueirosDia: { src: piscinaCoqueirosDia, thumb: piscinaCoqueirosDia480, mid: piscinaCoqueirosDia960, width: 1200, height: 1600 },
  salaoJogosBilhar: { src: salaoJogosBilhar, thumb: salaoJogosBilhar480, mid: salaoJogosBilhar960, width: 1200, height: 1600 },
  salaoJogosMesa: { src: salaoJogosMesa, thumb: salaoJogosMesa480, mid: salaoJogosMesa960, width: 1400, height: 1867 },
  recepcaoNoite2: { src: recepcaoNoite2, thumb: recepcaoNoite2_480, mid: recepcaoNoite2_960, width: 1200, height: 1600 },
} as const;

const WHATSAPP =
  "https://api.whatsapp.com/send/?phone=557191263096&text=" +
  encodeURIComponent(
    "Olá! Vim pelo site da Pousada Ilha do Meio e quero ver a disponibilidade dos ambientes.",
  );
const PAGE_URL = "https://pousadailhadomeio.com.br/ambientes";

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
    title: "Suítes",
    subtitle: "Conforto e charme em cada detalhe",
    description:
      "Cabines com fachada amarela, varanda de madeira e ambiente acolhedor. Cama confortável, ar-condicionado silencioso e o clima de Itacimirim entrando pela janela.",
    cover: fachadaNoite,
    gallery: [
      { ...P.fachadaNoite, caption: "Fachada das cabines", desc: "Fachada amarela iluminada em meio ao jardim." },
      { ...P.quartoDuplo, caption: "Quarto duplo", desc: "Cama de casal, ar-condicionado, TV e frigobar." },
      // Os cinco primeiros itens são os que aparecem no mosaico · aqui só entram fotos de
      // quarto, uma de cada tipo. A varanda foi pro fim: é foto da vista, não do quarto.
      { ...P.quartoTriplo, caption: "Quarto triplo", desc: "Cama de casal e cama de solteiro no mesmo quarto, com frigobar." },
      { ...P.quartoQuadruplo, caption: "Quarto quádruplo", desc: "Ideal para famílias e grupos de amigos." },
      { ...P.quartoQuadruplo2, caption: "Quarto quádruplo: detalhes", desc: "Espaço amplo, roupa de cama macia." },
      { ...P.quartoQuadruplo3, caption: "Quarto quádruplo: vista", desc: "Vista para o jardim da pousada." },
      { ...P.quartoDuploAlt, caption: "Varanda privativa", desc: "Varanda em madeira, ideal pro café da manhã." },
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
      "Piscina iluminada com deck em madeira, espreguiçadeiras e sombra dos coqueiros. A poucos passos da porta do quarto, perfeita pro fim de tarde.",
    cover: piscinaDeck,
    gallery: [
      { ...P.piscinaDeck, caption: "Vista aérea da piscina", desc: "Vista de drone da piscina, deck de madeira e área de descanso." },
      { ...P.piscinaHero, caption: "Piscina de dia", desc: "Água cristalina, deck de madeira e coqueiros ao redor." },
      { ...P.piscinaNoitePergola, caption: "Pérgola e piscina iluminada", desc: "Pérgola com iluminação suave, mesas ao redor e piscina refletindo as luzes da pousada." },
      { ...P.piscinaNoiteArvore, caption: "Piscina sob a copa das árvores", desc: "Deck de madeira, luzes quentes e a copa da amendoeira emoldurando a piscina." },
      // A água fica na faixa de baixo deste retrato · ancorar embaixo é o que faz a
      // miniatura mostrar a piscina em vez de só céu e coqueiro.
      { ...P.piscinaNoite, focus: "50% 100%", caption: "Piscina à noite", desc: "Piscina iluminada, ambiente romântico." },
      { ...P.piscinaMesaJardim, caption: "Área de estar", desc: "Mesa e cadeiras à beira da piscina, ideal para relaxar." },
      { ...P.piscinaPergolaDia, caption: "Pérgola de dia", desc: "Pérgola de madeira com mesas à sombra, jardim e os chalés ao fundo." },
      { ...P.piscinaCoqueirosDia, caption: "Piscina entre os coqueiros", desc: "Piscina de água azul cercada de coqueiros, com os chalés ao fundo." },
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
    cover: salaoJogosBilhar,
    gallery: [
      { ...P.salaoJogosBilhar, caption: "Mesa de bilhar", desc: "Diversão garantida em qualquer horário." },
      { ...P.salaoJogosMesa, caption: "Salão: mesa central", desc: "Ambiente climatizado e aconchegante." },
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
      "Recepção acolhedora e atendimento local que conhece Itacimirim de verdade. Dicas de praia, restaurantes e passeios, antes mesmo de você chegar.",
    cover: recepcaoNoite2,
    gallery: [
      { ...P.recepcaoNoite2, caption: "Área de convivência da recepção", desc: "Mesas de madeira, lustres artesanais e decoração inspirada no mar." },
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
      { title: "Ambientes · Pousada Ilha do Meio · Itacimirim/BA" },
      {
        name: "description",
        content:
          "Conheça cada ambiente da Pousada Ilha do Meio em Itacimirim: suítes, piscina iluminada, área de convivência e recepção acolhedora.",
      },
      { property: "og:title", content: "Ambientes · Pousada Ilha do Meio" },
      {
        property: "og:description",
        content:
          "Um tour completo pelos espaços da pousada: suítes, piscina, convivência e recepção.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: fachadaNoite },
      { name: "twitter:image", content: fachadaNoite },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: AmbientesPage,
});

function AmbientesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />
      <HeroAmbientes />
      <TabNav />
      <main>
        {AMBIENTES.map((a) => (
          <AmbienteBlock key={a.id} ambiente={a} />
        ))}
      </main>
      <CTAReserva />
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------------- */
/* Navegação fixa por abas                   */
/* ---------------------------------------- */

function TabNav() {
  return (
    <nav
      aria-label="Navegar por ambiente"
      className="sticky top-[65px] sm:top-[73px] z-30 border-b border-border/50 bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {AMBIENTES.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition hover:bg-accent hover:text-foreground"
          >
            <span className="text-[10px] font-semibold tracking-[0.2em] text-primary">{a.index}</span>
            {a.title}
          </a>
        ))}
      </div>
    </nav>
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
          onClick={() => trackWhatsAppLead("Ambientes - Header Reservar")}
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
        {/* Decorativa: fica em 40% de opacidade atrás de um degradê, então a versão
            reduzida é indistinguível da original e economiza banda no primeiro carregamento. */}
        <img
          src={fachadaNoite960}
          srcSet={`${fachadaNoite480} 480w, ${fachadaNoite960} 960w`}
          sizes="100vw"
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
          Um tour visual pelos espaços da Pousada Ilha do Meio, das suítes à piscina iluminada. Toque em qualquer imagem para abrir a galeria em tela cheia.
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

function AmbienteBlock({ ambiente }: { ambiente: Ambiente }) {
  const { id, index, title, subtitle, description, gallery, amenities } = ambiente;
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const open = React.useCallback((idx: number, el?: HTMLButtonElement | null) => {
    if (el) triggerRef.current = el;
    setOpenIndex(Math.max(0, Math.min(gallery.length - 1, idx)));
  }, [gallery.length]);

  const handleChange = React.useCallback((idx: number | null) => {
    setOpenIndex(idx);
    // Devolve o foco pra foto que abriu a galeria, senão quem navega por teclado
    // perde o lugar e volta pro topo da página. O adiamento é necessário: o diálogo
    // ainda está desmontando e sobrescreveria um focus() chamado agora.
    if (idx === null) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => triggerRef.current?.focus?.());
      });
    }
  }, []);

  const revealGrid = useReveal<HTMLDivElement>();
  const revealText = useReveal<HTMLDivElement>();

  const isSmallSet = gallery.length <= 2;
  // 1 tile grande + 4 pequenos preenche a grade 2x2 sem sobras; fotos extras seguem
  // acessíveis pela lightbox (setas), sem precisar de um tile visível pra cada uma.
  const tiles = isSmallSet ? gallery : gallery.slice(0, 5);

  return (
    <section id={id} className="scroll-mt-32 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Mosaico de fotos · foco visual do bloco */}
        <div
          ref={revealGrid.ref}
          className={cn(
            "grid grid-cols-2 gap-2.5 sm:gap-3",
            isSmallSet
              ? "auto-rows-[220px] sm:auto-rows-[340px]"
              : "auto-rows-[130px] sm:grid-cols-4 sm:auto-rows-[170px]",
          )}
        >
          {tiles.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`Abrir ${g.caption}`}
              className={cn(
                "group relative block overflow-hidden rounded-2xl bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:rounded-3xl",
                !isSmallSet && i === 0 && "col-span-2 row-span-2",
                "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                revealGrid.shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
              )}
              // Escalonado só na entrada · na saída fica 0 pra nada sumir em cascata.
              style={{ transitionDelay: revealGrid.shown ? `${Math.min(i, 4) * 90}ms` : "0ms" }}
            >
              <img
                src={g.thumb ?? g.src}
                srcSet={g.thumb && g.mid ? `${g.thumb} 480w, ${g.mid} 960w, ${g.src} 1920w` : undefined}
                sizes={!isSmallSet && i === 0 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
                width={g.width}
                height={g.height}
                alt={g.desc}
                loading="lazy"
                decoding="async"
                style={g.focus ? { objectPosition: g.focus } : undefined}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 ring-1 ring-inset ring-white/10 transition group-hover:ring-white/25"
              />
              {i === 0 && (
                <>
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white ring-1 ring-white/20 backdrop-blur-md sm:text-[11px]">
                      <span className="text-primary/90">{index}</span>
                      {title}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-lg transition group-hover:brightness-105 sm:bottom-4 sm:right-4 sm:text-xs">
                    <Expand className="h-3.5 w-3.5" aria-hidden />
                    Ver {gallery.length} fotos
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Legenda: texto compacto + amenidades + CTA */}
        <div
          ref={revealText.ref}
          className={cn(revealText.revealClass, "mt-6 grid gap-6 sm:mt-8 sm:grid-cols-[1.3fr_1fr] sm:gap-10")}
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              {index}. {title}
            </p>
            <h2 className="mt-2 font-display text-2xl leading-[1.05] sm:text-3xl">{title}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground/90">{subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">{description}</p>
          </div>

          <div>
            <ul className="flex flex-wrap gap-2" aria-label={`Detalhes de ${title}`}>
              {amenities.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-foreground/90 sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
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
                onClick={() => trackWhatsAppLead(`Ambientes - ${title}`)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Reservar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox · uma instância por bloco, controlada */}
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
      {/* Wallpaper coqueiros · verde escuro */}
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
          Tire dúvidas, veja disponibilidade e reserve direto pelo WhatsApp, falamos com você em minutos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            onClick={() => trackWhatsAppLead("Ambientes - CTA final")}
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
