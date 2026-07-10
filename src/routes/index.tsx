import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Check, ExternalLink, AirVent, MonitorPlay, Refrigerator, Camera, Wifi, UtensilsCrossed, Gamepad2, Users, Sunset, Sofa, MoreVertical, Instagram, Navigation, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { Testimonials } from "@/components/Testimonials";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { KenBurns } from "@/components/motion/KenBurns";
import { metaTrack, newMetaEventId, getFbCookie } from "@/lib/meta-pixel";
import { sendMetaCapiEvent } from "@/lib/meta-capi.functions";
import { cn } from "@/lib/utils";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


import heroPousada from "@/assets/pousada-0.jpg";

import recepcaoDia from "@/assets/recepcao-dia.jpg";
import quiosqueJardim from "@/assets/quiosque-jardim.jpg";
import fachadaNoite from "@/assets/acomodacoes-fachada-hd.jpg";
import piscinaNoite from "@/assets/piscina-noite.jpg";
import piscinaHero from "@/assets/piscina-hero-clean.jpg";
import piscinaDeck from "@/assets/piscina-aerea.png";


import salaoJogos from "@/assets/salao-jogos-v2.jpg";
import salaoJogosBilhar from "@/assets/salao-jogos-bilhar.jpg";
import salaoJogosMesa from "@/assets/salao-jogos-mesa-hd.jpg";

import quartoDuplo from "@/assets/quarto-duplo-cover-hd.jpg";
import quartoDuploAlt2 from "@/assets/quarto-duplo-varanda-hd.jpg";
import quartoQuadruplo from "@/assets/quarto-quadruplo-1.png";
import quartoQuadruplo2 from "@/assets/quarto-quadruplo-2.png";
import quartoQuadruplo3 from "@/assets/quarto-quadruplo-3.png";
import bgCoqueiros from "@/assets/bg-coqueiros-escuro.jpg";

const wa = (msg: string) => `https://api.whatsapp.com/send/?phone=557191263096&text=${encodeURIComponent(msg)}`;
const WHATSAPP = wa("Olá! Vim pelo site da Pousada Ilha do Meio e quero ver a disponibilidade e os valores.");
const WHATSAPP_CONFIRM = wa("Olá! Vim pelo site da Pousada Ilha do Meio e quero confirmar minha reserva. Pode me ajudar?");
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/pousada+ilha+do+meio+bahia/data=!4m2!3m1!1s0x71653f7b2133acd:0x8a9713485778b80e?sa=X&ved=1t:242&ictx=111";

/** Textura de grão sutil pras seções escuras full-bleed — evita o visual "gradiente flat genérico". */
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.06]"
      style={{ backgroundImage: GRAIN_BG }}
    />
  );
}

/** Dispara Lead (Pixel + Conversions API) no clique de um CTA de WhatsApp — sinal mais forte que "Contact" pro Meta otimizar o anúncio. */
function trackWhatsAppLead(contentName: string, value?: number) {
  const eventId = newMetaEventId();
  metaTrack("Lead", { content_name: contentName, ...(value ? { value, currency: "BRL" } : {}) }, eventId);
  sendMetaCapiEvent({
    data: {
      eventName: "Lead",
      eventId,
      eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
      value,
      currency: value ? "BRL" : undefined,
      fbp: getFbCookie("_fbp"),
      fbc: getFbCookie("_fbc"),
    },
  }).catch(() => {});
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia — Reserve pelo WhatsApp" },
      { name: "description", content: "Pousada em Itacimirim (BA), a 2 minutos do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia — Reserve pelo WhatsApp" },
      { property: "og:description", content: "Pousada em Itacimirim (BA), a 2 minutos do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:image", content: heroPousada },
      { name: "twitter:image", content: heroPousada },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://easy-gather-place.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://easy-gather-place.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "@id": "https://easy-gather-place.lovable.app/#pousada",
          name: "Pousada Ilha do Meio",
          description:
            "Pousada boutique em Itacimirim (Bahia), a 2 minutos do mar, entre Guarajuba e Praia do Forte. 17 quartos, café da manhã, piscina e atendimento direto com a casa.",
          url: "https://easy-gather-place.lovable.app/",
          image: heroPousada,
          telephone: "+55-71-9126-3096",
          priceRange: "R$ 450 – R$ 650",
          checkinTime: "13:00",
          checkoutTime: "12:00",
          numberOfRooms: 17,
          currenciesAccepted: "BRL",
          paymentAccepted: "Cash, Credit Card, Debit Card, PIX",
          petsAllowed: false,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Itacimirim",
            addressLocality: "Camaçari",
            addressRegion: "BA",
            addressCountry: "BR",
          },
          amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Wi-Fi gratuito", value: true },
            { "@type": "LocationFeatureSpecification", name: "Piscina", value: true },
            { "@type": "LocationFeatureSpecification", name: "Estacionamento gratuito", value: true },
            { "@type": "LocationFeatureSpecification", name: "Café da manhã incluso", value: true },
            { "@type": "LocationFeatureSpecification", name: "Ar-condicionado", value: true },
            { "@type": "LocationFeatureSpecification", name: "Salão de jogos", value: true },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "9.2",
            bestRating: "10",
            ratingCount: 204,
          },
          sameAs: [
            "https://www.instagram.com/pousadailhadomeio/",
            "https://www.booking.com/hotel/br/pousada-ilha-do-meio.pt-br.html",
          ],
        }),
      },
    ],
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
    name: "Quarto Duplo · para o casal",
    capacity: "Cama de casal, ar-condicionado, frigobar e café da manhã incluso. A 2 minutos da praia.",
    price: "R$ 450",
    image: quartoDuplo,
    alt: "Quarto Duplo da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Duplo",
    waMsg: "Olá! Tenho interesse no Quarto Duplo (2 pessoas) da Pousada Ilha do Meio, a partir de R$ 450/noite. Pode confirmar disponibilidade para as minhas datas?",
    photos: [
      { src: quartoDuplo, caption: "Quarto Duplo · Vista geral", desc: "Ambiente confortável, ideal para casais." },
      
      { src: quartoDuploAlt2, caption: "Quarto Duplo · Varanda com vista", desc: "Varanda privativa com rede, vista para o jardim e piscina." },
    ],
  },
  {
    name: "Quarto Família · para 3 ou 4 pessoas",
    capacity: "Acomoda 3 ou 4 hóspedes com conforto. Ar-condicionado, café da manhã incluso e a poucos passos da piscina e da praia.",
    price: "R$ 550",
    image: quartoQuadruplo,
    alt: "Quarto Família (3 a 4 pessoas) da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Família",
    waMsg: "Olá! Tenho interesse no Quarto Família (3 ou 4 pessoas) da Pousada Ilha do Meio, a partir de R$ 550/noite. Pode confirmar disponibilidade?",
    photos: [
      { src: quartoQuadruplo, caption: "Quarto Família · Vista geral", desc: "Pensado para a família toda descansar junto — acomoda 3 ou 4 pessoas." },
      { src: quartoQuadruplo2, caption: "Quarto Família · Camas", desc: "Camas bem dispostas, boa circulação e ambiente aconchegante." },
      { src: quartoQuadruplo3, caption: "Quarto Família · Varanda", desc: "Varanda em madeira com vista para o jardim." },
    ],
  },
];


const ROOM_AMENITIES = [
  { icon: AirVent, label: "Ar-cond.", full: "Ar-condicionado" },
  { icon: MonitorPlay, label: "Smart TV", full: "Smart TV" },
  { icon: Refrigerator, label: "Frigobar", full: "Frigobar" },
  { icon: UtensilsCrossed, label: "Café", full: "Café da manhã incluso" },
  { icon: Wifi, label: "Wi-Fi", full: "Wi-Fi grátis" },
];

const GALLERY = [
  { src: fachadaNoite, caption: "Acomodações", desc: "Cabines com fachada amarela, varanda em madeira e clima acolhedor." },
  { src: piscinaNoite, caption: "Piscina", desc: "Piscina para refrescar o dia, a poucos passos do quarto." },
  { src: quiosqueJardim, caption: "Área de Convivência", desc: "Espaço de convivência para relaxar entre um passeio e outro." },
  { src: recepcaoDia, caption: "Recepção", desc: "Recepção pronta para te atender, do check-in ao check-out." },
];

const GALLERY_META = [
  { kicker: "01 — Suítes", tags: ["Varanda privativa", "Ar-condicionado", "Wi-Fi"] },
  { kicker: "02 — Piscina", tags: ["Deck de madeira", "Área externa", "Iluminada"] },
  { kicker: "03 — Convivência", tags: ["Quiosque", "Jardim", "Sombra natural"] },
  { kicker: "04 — Recepção", tags: ["Check-in fácil", "Suporte local", "24h no WhatsApp"] },
];


function HomePage() {
  const [showHeader, setShowHeader] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState<{ url: string; label: string } | null>(null);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 10) setShowHeader(true);
      else if (y > lastY + 4) setShowHeader(false);
      else if (y < lastY - 4) setShowHeader(true);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ANNOUNCEMENT BAR */}
      <div className="w-full bg-primary text-primary-foreground text-[11px] sm:text-xs tracking-wide">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0 opacity-90" />
            <span className="truncate font-medium">Itacimirim · Bahia · a 2 minutos do mar</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold">9,2</span>
              <span className="opacity-80">Booking</span>
            </span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Reserva direta · melhor tarifa
            </span>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            onClick={() => trackWhatsAppLead("Barra topo - Fale conosco")}
            className="inline-flex items-center gap-1.5 font-semibold hover:opacity-90 transition shrink-0"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            <span className="hidden xs:inline sm:inline">Fale conosco</span>
          </a>
        </div>
      </div>

      {/* TOP BAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/50 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center">
            <Logo className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-sm" />
          </a>
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1 text-sm">
            {[
              { href: "#acomodacoes", label: "Acomodações" },
              { href: "#galeria", label: "Galeria" },
              { href: "#lazer", label: "Lazer" },
              { href: "#avaliacoes", label: "Avaliações" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative px-3 py-2 text-foreground/75 hover:text-foreground transition-colors font-medium tracking-wide after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Abrir menu"
              className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background/70 hover:bg-background text-foreground h-10 w-10 transition shadow-sm"
            >
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-60">
              <DropdownMenuLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
                Pousada Ilha do Meio
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="https://www.instagram.com/pousadailhadomeio/"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <Instagram className="h-4 w-4 text-primary" />
                  <span className="flex-1">Instagram</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pousada+Ilha+do+Meio+Itacimirim"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <Navigation className="h-4 w-4 text-primary" />
                  <span className="flex-1">Como chegar</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://g.page/r/pousada-ilha-do-meio/review"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <Star className="h-4 w-4 text-primary" />
                  <span className="flex-1">Avaliar no Google</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackWhatsAppLead("Menu - Falar no WhatsApp")}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span className="flex-1">Falar no WhatsApp</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative overflow-hidden min-h-[560px] sm:min-h-[640px] lg:min-h-[760px] xl:min-h-[860px]"
      >
        <div aria-hidden className="absolute inset-0 -z-10">
          <KenBurns src={heroPousada} alt="" eager duration={26} sizes="100vw" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/80" />
        <GrainOverlay />
        <StaggerGroup
          className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-32 sm:pb-36 text-white"
          gap={0.09}
          delay={0.15}
          amount={0.15}
        >
          <StaggerItem>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.32em] opacity-90 font-medium">
              <MapPin className="h-3.5 w-3.5" />
              Itacimirim · Bahia · 42823-000
            </div>
          </StaggerItem>
          <StaggerItem as="h1" className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-3xl text-balance">
            2 minutos do mar.<br />
            <em className="italic font-normal opacity-95">50 de Salvador.</em>
          </StaggerItem>
          <StaggerItem as="p" className="mt-5 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
            Cabines de madeira entre coqueiros, piscina acesa até tarde e a recepção
            que atende pelo WhatsApp — antes, durante e depois da sua estadia.
          </StaggerItem>

          <StaggerItem className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("Hero - Ver disponibilidade")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] px-7 py-4 text-base font-semibold shadow-2xl shadow-black/30 transition-all"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Ver disponibilidade
            </a>
            <Link
              to="/ambientes"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Conhecer a pousada
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </StaggerItem>

          <StaggerItem className="mt-9">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-base text-white/90">
              <li className="inline-flex items-center gap-2"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> 9,2 · 204 avaliações reais</li>
              <li className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Atendimento direto com a casa</li>
              <li className="inline-flex items-center gap-2"><Check className="h-5 w-5" /> Melhor tarifa garantida</li>
            </ul>
          </StaggerItem>
        </StaggerGroup>
      </section>


      {/* TRUST BAR */}
      <section className="relative isolate overflow-hidden min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]">
        {/* Wallpaper coqueiros — verde escuro, sem mar */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgCoqueiros})` }}
        />
        {/* Overlays escuros para legibilidade */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/50" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <GrainOverlay />

        <StaggerGroup className="relative mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3" gap={0.12} amount={0.3}>
          {[
            { n: "2 min", l: "Da praia" },
            { n: "9,2", l: "Nota dos hóspedes (204 avaliações)" },
            { n: "Direto", l: "Sem intermediário" },
          ].map((s) => (
            <StaggerItem key={s.l} className="px-4 py-10 sm:py-14 text-center border-b sm:border-b-0 sm:border-r border-white/10 last:border-0">
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">{s.n}</div>
              <div className="text-xs lg:text-sm xl:text-base text-white/90 font-medium mt-2 whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">{s.l}</div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          <Reveal className="lg:col-span-5" y={28}>
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">A casa</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Quatro ambientes,<br />
              <span className="italic opacity-90">uma ilha de sossego</span> entre coqueiros.
            </h2>
            <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              A Ilha do Meio não é um resort. São 17 suítes em madeira dispostas ao redor de um jardim
              — piscina, quiosque e salão de jogos separados por poucos passos. Fotografado sem retoque,
              como você vai encontrar.
            </p>
            <Link
              to="/ambientes"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-foreground group"
            >
              <span className="border-b-2 border-sand pb-1 group-hover:text-sand transition-colors">
                Percorrer todos os ambientes
              </span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>

          <Reveal className="lg:col-span-7" y={40} delay={0.12}>
            <Link
              to="/ambientes"
              aria-label="Acessar todos os ambientes da pousada"
              className="group relative block w-full overflow-hidden rounded-3xl bg-card aspect-[4/5] sm:aspect-[16/11] focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src={GALLERY[0].src}
                alt="Ambientes da Pousada Ilha do Meio — cabines, varanda em madeira e área de lazer"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.03]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

              {/* índice romano lateral */}
              <div className="absolute left-6 top-6 sm:left-8 sm:top-8 flex flex-col gap-1 text-white/70">
                {["I", "II", "III", "IV"].map((n, i) => (
                  <span
                    key={n}
                    className={cn(
                      "font-display text-sm tracking-[0.2em] transition",
                      i === 0 ? "text-sand" : "opacity-40",
                    )}
                  >
                    {n}
                  </span>
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 flex items-end justify-between gap-4">
                <div className="text-white">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-sand mb-2">Fachada · à noite</p>
                  <h3
                    className="font-display text-2xl sm:text-4xl leading-[1.05]"
                    style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
                  >
                    Cabines em madeira,<br className="hidden sm:block" /> luz baixa, silêncio.
                  </h3>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-lg transition group-hover:brightness-105 shrink-0">
                  Ver ambientes
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* AVALIAÇÕES REAIS */}
      <section id="avaliacoes" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Avaliações reais</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl leading-tight">Nota 9,2 — Fantástico.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <strong className="text-foreground">204 avaliações reais</strong> de hóspedes — famílias, casais e grupos que já se hospedaram conosco.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { score: "9,6", label: "Funcionários" },
              { score: "9,1", label: "Limpeza" },
              { score: "9,0", label: "Conforto" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl sm:text-3xl text-primary leading-none">{s.score}</span>
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="mt-1.5 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs sm:text-sm text-muted-foreground">
            Destaques recorrentes: <strong className="text-foreground">área verde</strong>,{" "}
            <strong className="text-foreground">localização</strong> e{" "}
            <strong className="text-foreground">café da manhã</strong>.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setPendingRedirect({ url: "https://www.booking.com/hotel/br/pousada-ilha-do-meio.pt-br.html", label: "Booking" })}
              className="group text-left rounded-xl border border-border/60 bg-card px-4 py-3 sm:px-5 sm:py-4 hover:border-primary/40 transition"
            >
              <div className="flex items-center gap-2">
                {/* Booking.com logo mark */}
                <span
                  aria-hidden="true"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white font-bold text-[13px] leading-none"
                  style={{ backgroundColor: "#003580", fontFamily: "system-ui, sans-serif" }}
                >
                  B.
                </span>
                <span className="font-display text-2xl sm:text-3xl text-primary leading-none">9,2</span>
                <span className="text-xs font-medium text-muted-foreground">Fantástico</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                Booking · 204 avaliações
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPendingRedirect({ url: "https://www.google.com/travel/search?q=pousada%20ilha%20do%20meio%20avalia%C3%A7%C3%A3o%20google", label: "Google" })}
              className="group text-left rounded-xl border border-border/60 bg-card px-4 py-3 sm:px-5 sm:py-4 hover:border-primary/40 transition"
            >
              <div className="flex items-center gap-2">
                {/* Google "G" official logo */}
                <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="font-display text-2xl sm:text-3xl text-primary leading-none">4,6</span>
                <span className="text-xs font-medium text-muted-foreground">de 5</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                Google · 272 avaliações
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* LAZER — SALÃO DE JOGOS */}
      <section id="lazer" className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Reveal className="max-w-2xl" y={24}>
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">II — Lazer</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Bilhar, quiosque, rede.<br />
              <span className="italic opacity-90">Tudo a três passos do quarto.</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 items-center">
            <GalleryLightbox
              className="md:col-span-3"
              items={[
                { src: salaoJogosBilhar, caption: "Mesa de Bilhar", desc: "Sinuca em ambiente coberto, com vista para o jardim." },
                { src: salaoJogos, caption: "Salão de Jogos", desc: "Espaço reservado aos hóspedes, com clima leve e descontraído." },
                { src: salaoJogosMesa, caption: "Mesa de jogos", desc: "Sinuca, pebolim e jogos de mesa para todas as idades." },
              ]}
              trigger={
                <figure className="group relative overflow-hidden rounded-3xl bg-background aspect-[4/5] ring-1 ring-border/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] cursor-zoom-in">
                  <img
                    src={salaoJogosBilhar}
                    alt="Mesa de bilhar no salão de jogos da Pousada Ilha do Meio"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-5">
                    <figcaption className="flex items-center gap-2 text-white text-base font-semibold tracking-wide">
                      <Gamepad2 className="h-4.5 w-4.5" strokeWidth={1.8} />
                      Acessar o ambiente
                    </figcaption>
                  </div>
                </figure>
              }
            />
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">O que rola por aqui</p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl leading-[1.1]">Uma mesa de sinuca, um pebolim e a noite inteira pela frente.</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                O salão de jogos é o ponto de encontro entre famílias, casais e grupos de amigos — espaço pensado para quem quer relaxar entre um passeio e outro, com clima leve e descontraído.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-foreground/90">
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Gamepad2 className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <span className="pt-1.5">Sinuca, pebolim e jogos de mesa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Users className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <span className="pt-1.5">Ambiente reservado para hóspedes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Sunset className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <span className="pt-1.5">Ideal para finais de tarde e noites</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Sofa className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <span className="pt-1.5">Próximo à área de convivência</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ACOMODAÇÕES */}
      <section id="acomodacoes" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <Reveal className="max-w-2xl" y={24}>
          <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">III — Acomodações</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
            17 suítes em madeira.<br />
            <span className="italic opacity-90">Duas configurações,</span> mesma tranquilidade.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Ar-condicionado silencioso, TV, frigobar, café da manhã e Wi-Fi em todos os quartos — sem cobrança extra.
          </p>
        </Reveal>
        <StaggerGroup
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:items-stretch max-w-5xl mx-auto"
          gap={0.12}
          amount={0.15}
        >
          {ROOMS.map((r) => (
            <StaggerItem as="article" key={r.name} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
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

                <ul className="grid grid-cols-5 gap-1.5 text-[11px] text-foreground/80">
                  {ROOM_AMENITIES.map(({ icon: Icon, label, full }) => (
                    <li
                      key={label}
                      className="flex flex-col items-center justify-start gap-1.5 rounded-xl border border-border/60 bg-gradient-to-b from-background to-background/40 px-1 py-2.5"
                      title={full}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="text-center leading-tight tracking-tight whitespace-nowrap">{label}</span>
                    </li>
                  ))}
                </ul>
                <p className="-mt-2 text-[11px] text-muted-foreground">Café da manhã e Wi-Fi inclusos.</p>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-muted-foreground">a partir de</span>
                  <span className="text-primary text-xl font-semibold tabular-nums">{r.price}</span>
                  <span className="text-xs text-muted-foreground">/ noite</span>
                </div>


                <a
                  href={wa(r.waMsg)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackWhatsAppLead(r.name, Number(r.price.replace(/\D/g, "")))}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] px-5 py-3 text-sm font-semibold transition-all"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {r.cta}
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Aviso profissional: Quarto Triplo sob consulta */}
        <div className="mt-8 mx-auto max-w-3xl px-1">
          <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/60 px-5 py-4 sm:px-6 sm:py-5">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              <Users className="h-4 w-4" strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Também temos Quarto Triplo (3 pessoas)</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Disponível sob consulta, conforme disponibilidade das datas. Fale com a gente pelo WhatsApp e confirmamos valores e reserva na hora.
              </p>
            </div>
            <a
              href={wa("Olá! Tenho interesse no Quarto Triplo (3 pessoas) da Pousada Ilha do Meio. Pode confirmar disponibilidade e valores para as minhas datas?")}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("Quarto Triplo")}
              className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 text-xs font-semibold transition"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              Consultar Triplo
            </a>
          </div>
          <a
            href={wa("Olá! Tenho interesse no Quarto Triplo (3 pessoas) da Pousada Ilha do Meio. Pode confirmar disponibilidade e valores para as minhas datas?")}
            target="_blank"
            rel="noopener"
            onClick={() => trackWhatsAppLead("Quarto Triplo")}
            className="sm:hidden mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2.5 text-xs font-semibold transition"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            Consultar Quarto Triplo
          </a>
        </div>

      </section>

      {/* PISCINA */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Reveal className="max-w-2xl" y={24}>
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">IV — Piscina</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Acesa até você decidir<br />
              <span className="italic opacity-90">que é hora de dormir.</span>
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg leading-relaxed">
              Deck em madeira, espreguiçadeiras à sombra dos coqueiros e iluminação noturna suave.
              Aberta o dia todo — na alta temporada, a área permanece iluminada até a meia-noite.
            </p>
          </Reveal>

          <GalleryLightbox
            items={[
              { src: piscinaHero, caption: "Piscina da Pousada Ilha do Meio", desc: "Água azul, deck de madeira e coqueiros — o cartão-postal da pousada." },
              { src: piscinaDeck, caption: "Deck e área gourmet", desc: "Pergolado de bambu, mesas à sombra e jardim ao redor da piscina." },
            ]}
            className="mt-10"
            trigger={
              <figure className="relative overflow-hidden rounded-2xl ring-1 ring-border/60 aspect-[16/10] group cursor-zoom-in">
                <img
                  src={piscinaHero}
                  alt="Piscina da Pousada Ilha do Meio com deck de madeira e coqueiros"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 text-white backdrop-blur-md hover:bg-black/75 px-3.5 py-2 text-xs font-medium transition">
                  <Camera className="h-3.5 w-3.5" />
                  Ver fotos da piscina
                </span>
              </figure>
            }

          />



          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={wa("Olá! Quero reservar na Pousada Ilha do Meio com vista pra piscina. Pode me passar disponibilidade e valores?")}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("Reservar com vista pra piscina")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 text-sm font-semibold transition"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Reservar com vista pra piscina
            </a>
            <span className="text-sm text-muted-foreground">Café da manhã incluso · A 2 min da praia</span>
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO */}

      <section className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">V — Onde fica</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Entre Guarajuba<br />
              <span className="italic opacity-90">e Praia do Forte.</span>
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg leading-relaxed">
              Rua Sítio Novo, 7 — Loteamento Santa Maria, Lote 8. A 800m da praia por caminho asfaltado
              e a uma curta viagem dos principais destinos do Litoral Norte da Bahia.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {[
                { n: 2, unit: "min", l: "Da praia a pé" },
                { n: 12, unit: "km", l: "Praia do Forte" },
                { n: 55, unit: "km", l: "Aeroporto de Salvador" },
                { n: 78, unit: "km", l: "Centro de Salvador" },
              ].map((d) => (
                <div key={d.l} className="border-l-2 border-sand/70 pl-4">
                  <dt className="flex items-baseline gap-1.5">
                    <CountUp end={d.n} className="font-display text-4xl sm:text-5xl leading-none text-foreground tabular-nums" />
                    <span className="text-sm font-medium text-muted-foreground">{d.unit}</span>
                  </dt>
                  <dd className="mt-1.5 text-sm text-muted-foreground">{d.l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-3xl shadow-xl shadow-black/15 ring-1 ring-border/60">
            <iframe
              title="Localização da Pousada Ilha do Meio no mapa"
              src="https://www.google.com/maps?q=Pousada+Ilha+do+Meio+Itacimirim&output=embed"
              className="h-full w-full border-0 grayscale-[20%] contrast-[1.05] saturate-[0.9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
            <button
              type="button"
              onClick={() => setPendingRedirect({ url: GOOGLE_MAPS_URL, label: "Google Maps" })}
              className="absolute bottom-4 left-4 right-4 sm:right-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-lg hover:bg-white transition"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Abrir no Google Maps
            </button>
          </div>

        </div>
      </section>

      {/* DEPOIMENTOS */}
      <Testimonials />

      {/* FINAL CTA */}
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[480px] sm:min-h-[560px] lg:min-h-[620px]"
        style={{ backgroundImage: `url(${piscinaNoite})` }}
      >
        <div aria-hidden className="absolute inset-0 bg-black/75" />
        <GrainOverlay />
        <div className="relative mx-auto max-w-3xl px-4 py-24 sm:py-28 text-center text-white">
          <p className="text-[11px] uppercase tracking-[0.32em] text-sand font-medium">Reserva direta com a casa</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.02] text-balance">
            Fale com quem<br />
            <span className="italic opacity-95">atende a porta.</span>
          </h2>
          <p className="mt-5 text-white/85 sm:text-lg max-w-xl mx-auto">
            Sem intermediário, sem taxa de reserva. Respondemos em minutos pelo WhatsApp — de segunda a segunda.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href={WHATSAPP_CONFIRM}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("CTA final - Confirmar reserva")}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:brightness-110 px-8 py-4 text-base font-semibold shadow-2xl shadow-black/40 transition"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar com a casa
            </a>
            <span className="text-xs uppercase tracking-[0.24em] text-white/60">
              +55 71 9126-3096 · resposta média em 4 min
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />

      {/* Confirmação de redirecionamento para avaliações externas */}
      <AlertDialog open={!!pendingRedirect} onOpenChange={(o) => !o && setPendingRedirect(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você será redirecionado ao {pendingRedirect?.label}</AlertDialogTitle>
            <AlertDialogDescription>
              Ao continuar, você sairá do site da Pousada Ilha do Meio e abrirá a página de avaliações no {pendingRedirect?.label} em uma nova aba. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRedirect) window.open(pendingRedirect.url, "_blank", "noopener,noreferrer");
                setPendingRedirect(null);
              }}
            >
              Sim, continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
