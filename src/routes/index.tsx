import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Check, ExternalLink, AirVent, MonitorPlay, Refrigerator, Wifi, UtensilsCrossed, Gamepad2, Users, Sunset, Sofa, MoreVertical, Instagram, Navigation, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { InlineCarousel } from "@/components/GalleryLightbox";
import { Testimonials } from "@/components/Testimonials";
import { CountUp } from "@/components/CountUp";
import { trackWhatsAppLead } from "@/lib/whatsapp-lead";
import { cn } from "@/lib/utils";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


import heroPousada from "@/assets/pousada-0.jpg";

import recepcaoNoite from "@/assets/recepcao-noite-2.webp";
import quiosqueJardim from "@/assets/quiosque-jardim.webp";
import fachadaNoite from "@/assets/acomodacoes-fachada-hd.jpg";
import piscinaNoite from "@/assets/piscina-noite.jpg";
import piscinaNoitePergola from "@/assets/piscina-noite-pergola.webp";
import piscinaHero from "@/assets/piscina-hero-clean.webp";
import piscinaVistaCompleta from "@/assets/piscina-deck-espreguicadeiras.jpg";
import piscinaEspreguicadeiras from "@/assets/piscina-azul-detalhe.jpg";
import piscinaMesaJardim from "@/assets/piscina-mesa-jardim.jpg";


import salaoJogosBilhar from "@/assets/salao-jogos-bilhar.jpg";
import salaoJogosMesa from "@/assets/salao-jogos-mesa-hd.jpg";

import quartoDuplo from "@/assets/quarto-duplo-cover-hd.jpg";
import quartoDuploAlt2 from "@/assets/quarto-duplo-varanda-hd.jpg";
import quartoDuploDetalhe from "@/assets/quarto-duplo-detalhe-hd.jpg";
import quartoQuadruplo from "@/assets/quarto-quadruplo-1.webp";
import quartoQuadruplo2 from "@/assets/quarto-quadruplo-2.webp";
import quartoQuadruplo3 from "@/assets/quarto-quadruplo-3.webp";
import quartoQuadruploDetalhe from "@/assets/quarto-quadruplo-detalhe-hd.jpg";
import quartoQuadruploRede from "@/assets/quarto-quadruplo-rede-hd.jpg";
import quartoTriplo1 from "@/assets/quarto-triplo-1.jpg";
import quartoTriplo2 from "@/assets/quarto-triplo-2.jpg";
import quartoTriploVaranda from "@/assets/quarto-triplo-varanda.jpg";
import quartoTriploVista from "@/assets/quarto-triplo-vista-piscina.jpg";
import bgCoqueiros from "@/assets/bg-coqueiros-escuro.jpg";
import palmBg2 from "@/assets/palm-bg-2.webp";

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


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia. Reserve pelo WhatsApp" },
      { name: "description", content: "Pousada em Itacimirim (BA), perto do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia. Reserve pelo WhatsApp" },
      { property: "og:description", content: "Pousada em Itacimirim (BA), perto do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:image", content: heroPousada },
      { name: "twitter:image", content: heroPousada },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://pousadailhadomeio.com.br/" },
    ],
    links: [{ rel: "canonical", href: "https://pousadailhadomeio.com.br/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "@id": "https://pousadailhadomeio.com.br/#pousada",
          name: "Pousada Ilha do Meio",
          description:
            "Pousada boutique em Itacimirim (Bahia), perto do mar, entre Guarajuba e Praia do Forte. 17 quartos, café da manhã, piscina e atendimento direto com a casa.",
          url: "https://pousadailhadomeio.com.br/",
          image: heroPousada,
          telephone: "+55-71-9126-3096",
          priceRange: "R$ 400 – R$ 650",
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
    capacity: "Cama de casal, ar-condicionado, frigobar e café da manhã incluso. Perto da praia.",
    price: "R$ 400",
    image: quartoDuplo,
    alt: "Quarto Duplo da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Duplo",
    waMsg: "Olá! Tenho interesse no Quarto Duplo (2 pessoas) da Pousada Ilha do Meio, a partir de R$ 400/noite. Pode confirmar disponibilidade para as minhas datas?",
    photos: [
      { src: quartoDuplo, caption: "Quarto Duplo · Vista geral", desc: "Ambiente confortável, ideal para casais." },
      { src: quartoDuploDetalhe, caption: "Quarto Duplo · Outro ângulo", desc: "Cama de casal com TV, ar-condicionado e banheiro privativo." },
      { src: quartoDuploAlt2, caption: "Quarto Duplo · Varanda com vista", desc: "Varanda privativa com rede, vista para o jardim e piscina." },
    ],
  },
  {
    name: "Quarto Triplo · para 3 pessoas",
    capacity: "Cama de casal, cama de solteiro, ar-condicionado, frigobar e café da manhã incluso. Varanda privativa com rede.",
    price: "R$ 550",
    image: quartoTriplo1,
    alt: "Quarto Triplo (3 pessoas) da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Triplo",
    waMsg: "Olá! Tenho interesse no Quarto Triplo (3 pessoas) da Pousada Ilha do Meio, a partir de R$ 550/noite. Pode confirmar disponibilidade para as minhas datas?",
    photos: [
      { src: quartoTriplo1, caption: "Quarto Triplo · Vista geral", desc: "Cama de casal e cama de solteiro, espaço amplo para 3 pessoas." },
      { src: quartoTriplo2, caption: "Quarto Triplo · Camas", desc: "Roupa de cama branca, frigobar e ambiente aconchegante." },
      { src: quartoTriploVaranda, caption: "Quarto Triplo · Varanda com rede", desc: "Varanda privativa em madeira, rede e vista para os coqueiros." },
      { src: quartoTriploVista, caption: "Quarto Triplo · Vista da piscina", desc: "Vista da varanda para a piscina e o verde ao redor." },
    ],
  },
  {
    name: "Quarto Quadruplo · para 3 ou 4 pessoas",
    capacity: "Acomoda 3 ou 4 hóspedes com conforto. Ar-condicionado, café da manhã incluso e a poucos passos da piscina e da praia.",
    price: "R$ 650",
    image: quartoQuadruplo,
    alt: "Quarto Quadruplo (3 a 4 pessoas) da Pousada Ilha do Meio",
    cta: "Quero reservar o Quarto Quadruplo",
    waMsg: "Olá! Tenho interesse no Quarto Quadruplo (3 ou 4 pessoas) da Pousada Ilha do Meio, a partir de R$ 650/noite. Pode confirmar disponibilidade?",
    photos: [
      { src: quartoQuadruplo, caption: "Quarto Quadruplo · Vista geral", desc: "Pensado para a família toda descansar junto, acomoda 3 ou 4 pessoas." },
      { src: quartoQuadruplo2, caption: "Quarto Quadruplo · Camas", desc: "Camas bem dispostas, boa circulação e ambiente aconchegante." },
      { src: quartoQuadruploDetalhe, caption: "Quarto Quadruplo · Outro ângulo", desc: "Camas com acesso direto à área externa da pousada." },
      { src: quartoQuadruplo3, caption: "Quarto Quadruplo · Varanda", desc: "Varanda em madeira com vista para o jardim." },
      { src: quartoQuadruploRede, caption: "Quarto Quadruplo · Rede na varanda", desc: "Rede privativa com vista aberta para o verde ao redor." },
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
  { src: piscinaHero, caption: "Piscina", desc: "Piscina de água cristalina, deck de madeira e coqueiros ao redor." },
  { src: quiosqueJardim, caption: "Área de Convivência", desc: "Espaço de convivência para relaxar entre um passeio e outro." },
  { src: recepcaoNoite, caption: "Recepção", desc: "Área de convivência da recepção, com estrutura em madeira e clima acolhedor." },
];

const GALLERY_META = [
  { kicker: "01. Suítes", tags: ["Varanda privativa", "Ar-condicionado", "Wi-Fi"] },
  { kicker: "02. Piscina", tags: ["Deck de madeira", "Área externa", "Iluminada"] },
  { kicker: "03. Convivência", tags: ["Quiosque", "Jardim", "Sombra natural"] },
  { kicker: "04. Recepção", tags: ["Check-in fácil", "Suporte local", "24h no WhatsApp"] },
];

type MosaicItem = { src: string; caption: string; desc: string };
type MosaicMeta = { kicker: string; tags: string[] };

/** Um tile do mosaico "Quatro ambientes" — cada foto é sua própria entrada clicável pro ambiente correspondente. */
function MosaicTile({
  item,
  meta,
  anchor,
  className,
  compact = false,
}: {
  item: MosaicItem;
  meta: MosaicMeta;
  anchor: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      to="/ambientes"
      hash={anchor}
      aria-label={`Ver ${item.caption}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl sm:rounded-3xl bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <img
        src={item.src}
        alt={item.desc}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <div className={cn("absolute left-3 top-3 sm:left-4 sm:top-4 text-[10px] font-medium uppercase tracking-[0.22em] text-sand", compact && "text-[9px]")}>
        {meta.kicker}
      </div>
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 flex items-end justify-between gap-2">
        <p className={cn("font-display text-white leading-tight", compact ? "text-sm sm:text-base" : "text-xl sm:text-3xl")}>
          {item.caption}
        </p>
        <ChevronRight className={cn("text-white/80 shrink-0 transition-transform group-hover:translate-x-0.5", compact ? "h-3.5 w-3.5" : "h-5 w-5")} aria-hidden />
      </div>
    </Link>
  );
}

/** Seção da piscina com alternância dia/noite — toggle por toque (não por hover, que não existe em touch). */
function PiscinaSection() {
  const [time, setTime] = useState<"dia" | "noite">("dia");
  const DETAILS = [
    { src: piscinaVistaCompleta, caption: "Vista completa" },
    { src: piscinaEspreguicadeiras, caption: "Espreguiçadeiras" },
    { src: piscinaMesaJardim, caption: "Área de estar" },
  ];
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">IV. Piscina</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Um mergulho de água azul<br />
              <span className="italic opacity-90">à sombra dos coqueiros.</span>
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg leading-relaxed">
              Aberta o dia todo, iluminada até tarde da noite, com deck em madeira e vista aberta pro verde ao redor.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/60 bg-card p-1">
            {(["dia", "noite"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold capitalize transition",
                  time === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <figure className="mt-8 relative overflow-hidden rounded-2xl ring-1 ring-border/60 aspect-[4/5] sm:aspect-[16/10]">
          <img
            src={piscinaHero}
            alt="Piscina da Pousada Ilha do Meio durante o dia"
            className={cn("absolute inset-0 h-full w-full object-cover object-[50%_72%] transition-opacity duration-700", time === "dia" ? "opacity-100" : "opacity-0")}
          />
          <img
            src={piscinaNoitePergola}
            alt="Piscina da Pousada Ilha do Meio iluminada à noite"
            className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", time === "noite" ? "opacity-100" : "opacity-0")}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <figcaption className="absolute bottom-4 left-4 text-sm font-medium uppercase tracking-[0.18em] text-white">
            {time === "dia" ? "Piscina · dia" : "Piscina · noite"}
          </figcaption>
        </figure>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {DETAILS.map((d) => (
            <figure key={d.src} className="relative overflow-hidden rounded-xl aspect-square ring-1 ring-border/60">
              <img src={d.src} alt={d.caption} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </figure>
          ))}
        </div>

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
          <span className="text-sm text-muted-foreground">Café da manhã incluso · A 450m da praia</span>
        </div>
      </div>
    </section>
  );
}

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
            <span className="truncate font-medium">Itacimirim · Bahia · perto do mar</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
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
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat min-h-[560px] sm:min-h-[640px] lg:min-h-[760px] xl:min-h-[860px]"
        style={{ backgroundImage: `url(${heroPousada})` }}
      >
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/80" />
        <GrainOverlay />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-32 sm:pb-36 text-white">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.32em] opacity-90 font-medium">
            <MapPin className="h-3.5 w-3.5" />
            Itacimirim, Bahia · CEP 42823-000
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-3xl text-balance">
            Pousada Ilha do Meio.<br />
            <em className="italic font-normal opacity-95">Perto do mar.</em>
          </h1>
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-2 text-sm text-white">
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">Diárias</span>
            <span className="font-display text-lg leading-none">a partir de R$ 400</span>
            <span className="text-xs text-white/70">/ noite · café incluso</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("Hero - Ver disponibilidade")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-7 py-4 text-base font-semibold shadow-2xl shadow-black/30 transition"
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
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/70">
            Resposta em minutos · Segunda a segunda
          </p>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-base text-white/90">
            <li className="inline-flex items-center gap-2"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> 204 avaliações reais</li>
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Atendimento direto com a casa</li>
            <li className="inline-flex items-center gap-2"><Check className="h-5 w-5" /> Melhor tarifa garantida</li>
          </ul>
        </div>
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

        <div className="relative mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3">
          {[
            { n: "17", l: "Suítes em madeira" },
            { n: "9,2", l: "Nota dos hóspedes (204 avaliações)" },
            { n: "Direto", l: "Sem intermediário" },
          ].map((s) => (
            <div key={s.l} className="px-4 py-10 sm:py-14 text-center border-b sm:border-b-0 sm:border-r border-white/10 last:border-0">
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">{s.n}</div>
              <div className="text-xs lg:text-sm xl:text-base text-white/90 font-medium mt-2 whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* A POUSADA — apresentação editorial + acesso a /ambientes */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">A casa</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Quatro ambientes,<br />
              <span className="italic opacity-90">uma ilha de sossego</span> entre coqueiros.
            </h2>
            <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              A Ilha do Meio não é um resort. São 17 suítes em madeira dispostas ao redor de um jardim
              com piscina, quiosque e salão de jogos separados por poucos passos. Fotografado sem retoque,
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
          </div>

          <div className="lg:col-span-7">
            <div className="flex gap-3 sm:gap-4 aspect-[4/5] sm:aspect-[16/11]">
              <MosaicTile item={GALLERY[0]} meta={GALLERY_META[0]} anchor="suites" className="flex-[3]" />
              <div className="flex flex-[2] flex-col gap-3 sm:gap-4">
                <MosaicTile item={GALLERY[1]} meta={GALLERY_META[1]} anchor="piscina" className="flex-1" compact />
                <MosaicTile item={GALLERY[2]} meta={GALLERY_META[2]} anchor="convivencia" className="flex-1" compact />
                <MosaicTile item={GALLERY[3]} meta={GALLERY_META[3]} anchor="recepcao" className="flex-1" compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES REAIS */}
      <section id="avaliacoes" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Avaliações reais</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl leading-tight">Avaliações reais, sem filtro.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              <strong className="text-foreground">204 avaliações reais</strong> de hóspedes: famílias, casais e grupos que já se hospedaram conosco.
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

          <div className="mt-5 grid grid-cols-1 max-w-xs gap-3 sm:gap-4">
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
      <section id="lazer" className="bg-card border-y border-border/60 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">II. Lazer</p>
              <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
                Bilhar, quiosque, rede.<br />
                <span className="italic opacity-90">Tudo a três passos do quarto.</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
                O salão de jogos é o ponto de encontro entre famílias, casais e grupos de amigos: espaço pensado para relaxar entre um passeio e outro, com clima leve e descontraído.
              </p>
            </div>
          </div>
        </div>

        {/* Filmstrip horizontal — arraste pro lado */}
        <div className="mt-10 flex gap-4 overflow-x-auto pb-6 pl-4 sm:pl-[max(1rem,calc((100vw-72rem)/2+1rem))] pr-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { src: salaoJogosBilhar, caption: "Mesa de Bilhar", desc: "Sinuca em ambiente coberto, com vista para o jardim." },
            { src: salaoJogosMesa, caption: "Mesa de jogos", desc: "Sinuca, pebolim e jogos de mesa para todas as idades." },
          ].map((photo) => (
            <figure
              key={photo.src}
              className="relative shrink-0 w-[78vw] sm:w-[420px] aspect-[4/5] overflow-hidden rounded-3xl bg-background ring-1 ring-border/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] snap-center"
            >
              <img
                src={photo.src}
                alt={photo.desc}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 font-display text-lg text-white">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <ul className="flex flex-wrap gap-3 text-sm text-foreground/90">
            {[
              { icon: Gamepad2, label: "Sinuca, pebolim e jogos de mesa" },
              { icon: Users, label: "Ambiente reservado para hóspedes" },
              { icon: Sunset, label: "Ideal para finais de tarde e noites" },
              { icon: Sofa, label: "Próximo à área de convivência" },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-background px-4 py-2.5"
              >
                <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.8} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RESERVA DIRETA vs BOOKING — economia real */}
      <section className="relative border-y border-border/60 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${palmBg2})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/68 to-card/85" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-primary font-medium">Reserve direto</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-[1.05] text-balance">
              Reservando com a casa,<br />
              <span className="italic opacity-90">você paga menos.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              As plataformas cobram taxa de serviço em cima de cada diária. Falando direto com a recepção, esse valor volta pra você, sem intermediário e sem surpresas na hora da cobrança.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Booking */}
            <div className="relative rounded-2xl border border-border/60 bg-background/95 backdrop-blur-sm p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white font-bold text-[13px] leading-none"
                  style={{ backgroundColor: "#003580", fontFamily: "system-ui, sans-serif" }}
                >
                  B.
                </span>
                <span className="text-sm font-medium text-muted-foreground">Booking · Quarto Duplo</span>
              </div>
              <div className="mt-6 flex items-baseline gap-2 text-muted-foreground line-through decoration-2 decoration-red-500/70">
                <span className="text-xs">R$</span>
                <span className="font-display text-4xl sm:text-5xl tabular-nums">530</span>
                <span className="text-xs">/ noite</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-red-500">×</span> Taxa de serviço do site</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-red-500">×</span> Atendimento por chat da plataforma</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-red-500">×</span> Sem contato direto com a recepção</li>
              </ul>
            </div>

            {/* Direto */}
            <div className="relative rounded-2xl border-2 border-primary/70 bg-background/95 backdrop-blur-sm p-6 sm:p-7 shadow-xl shadow-primary/10">
              <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow">
                <Check className="h-3 w-3" /> Recomendado
              </div>
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Direto com a recepção · WhatsApp</span>
              </div>
              <div className="mt-6 flex items-baseline gap-2 text-foreground">
                <span className="text-xs text-muted-foreground">R$</span>
                <span className="font-display text-5xl sm:text-6xl tabular-nums text-primary">400</span>
                <span className="text-xs text-muted-foreground">/ noite</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-primary">Você economiza até R$ 130/noite</p>
              <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Melhor tarifa garantida</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Pagamento por PIX ou cartão</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Falar com quem administra a pousada</li>
              </ul>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                onClick={() => trackWhatsAppLead("Comparativo Booking vs Direto", 400)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:brightness-110 px-5 py-3 text-sm font-semibold shadow-lg shadow-primary/20 transition"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Reservar direto pelo WhatsApp
              </a>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            *Valor de referência para diária baixa temporada em Quarto Duplo. Consulte disponibilidade e datas.
          </p>
        </div>
      </section>

      {/* ACOMODAÇÕES */}
      <section id="acomodacoes" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">III. Acomodações</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
            17 suítes em madeira.<br />
            <span className="italic opacity-90">Três configurações,</span> mesma tranquilidade.
          </h2>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-xs text-muted-foreground">Suítes a partir de</span>
            <span className="text-primary text-2xl font-semibold tabular-nums">R$ 400</span>
            <span className="text-xs text-muted-foreground">/ noite</span>
          </div>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Ar-condicionado silencioso, TV, frigobar, café da manhã e Wi-Fi em todos os quartos, sem cobrança extra. Fale no WhatsApp e veja qual suíte combina com o seu grupo.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:items-stretch max-w-6xl mx-auto">
          {ROOMS.map((r) => (
            <article key={r.name} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <InlineCarousel items={r.photos} />
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

                <a
                  href={wa(r.waMsg)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackWhatsAppLead(r.name, Number(r.price.replace(/\D/g, "")))}
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

      {/* PISCINA — comparativo dia/noite */}
      <PiscinaSection />

      {/* LOCALIZAÇÃO */}

      <section className="bg-card border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">V. Onde fica</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Entre Guarajuba<br />
              <span className="italic opacity-90">e Praia do Forte.</span>
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg leading-relaxed">
              Rua Sítio Novo, 7 - Loteamento Santa Maria, Lote 8. A 450 metros da praia por caminho asfaltado
              e a uma curta viagem dos principais destinos do Litoral Norte da Bahia.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {[
                { n: 450, unit: "m", l: "Da praia" },
                { n: 18, unit: "km", l: "Praia do Forte" },
                { n: 60, unit: "km", l: "Aeroporto de Salvador" },
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

      {/* FAQ INLINE */}
      <section id="faq" className="bg-background border-t border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">Perguntas frequentes</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Antes de reservar,<br />
              <span className="italic opacity-90">tudo o que perguntam.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Não achou sua dúvida? Fale com a recepção pelo WhatsApp, respondemos em minutos.
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-8">
            {[
              { q: "Quais formas de pagamento vocês aceitam?", a: "PIX, cartão de crédito, cartão de débito e dinheiro. A recepção envia as instruções de pagamento assim que você confirma as datas pelo WhatsApp." },
              { q: "Qual a política de cancelamento?", a: "Buscamos flexibilidade sempre que possível. As condições exatas dependem do período e da antecedência da reserva. A recepção informa tudo antes de você confirmar." },
              { q: "Que horas é o check-in e check-out?", a: "Check-in das 13h às 22h. Check-out das 9h às 12h. Chegando fora do horário? Basta avisar a recepção com antecedência." },
              { q: "Tem estacionamento?", a: "Sim, estacionamento privativo gratuito para hóspedes, sujeito à disponibilidade de vagas." },
              { q: "O café da manhã está incluso?", a: "Sim, todas as diárias incluem café da manhã completo: frutas, pães, frios, sucos naturais, bolos e itens regionais servidos diariamente." },
              { q: "A pousada aceita pets?", a: "No momento não recebemos animais de estimação, para preservar o conforto de todos os hóspedes." },
              { q: "Crianças pagam?", a: "Crianças são bem-vindas. As condições variam com a idade e a configuração do quarto. Fale com a recepção pra montarmos a melhor acomodação para sua família." },
              { q: "É seguro reservar direto pela pousada?", a: "Sim. Somos administração local: você fala direto com quem opera a pousada. Emitimos comprovante de pagamento e enviamos confirmação por escrito antes da estadia." },
            ].map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-border/60">
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-5 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card px-5 py-5 sm:px-7 sm:py-6">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground">Ainda com dúvida?</p>
              <p className="text-sm text-muted-foreground">A recepção responde em minutos, de segunda a segunda.</p>
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("FAQ - Tirar dúvida")}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:brightness-110 px-5 py-3 text-sm font-semibold shadow-lg shadow-primary/20 transition shrink-0"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Falar com a recepção
            </a>
          </div>
        </div>
      </section>

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
            Fale com<br />
            <span className="italic opacity-95">a recepção.</span>
          </h2>
          <p className="mt-5 text-white/85 sm:text-lg max-w-xl mx-auto">
            Sem intermediário, sem taxa de reserva. Respondemos em minutos pelo WhatsApp, de segunda a segunda.
          </p>
          <div className="mt-9 flex justify-center">
            <a
              href={WHATSAPP_CONFIRM}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("CTA final - Confirmar reserva")}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:brightness-110 px-8 py-4 text-base font-semibold shadow-2xl shadow-black/40 transition"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar com a recepção
            </a>
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
