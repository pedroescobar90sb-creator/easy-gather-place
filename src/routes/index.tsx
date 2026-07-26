import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MapPin, Star, ShieldCheck, Check, ExternalLink, AirVent, MonitorPlay, Refrigerator, Wifi, UtensilsCrossed, Gamepad2, Users, Sunset, Sofa, MoreVertical, Instagram, Navigation, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { SiteFooter } from "@/components/SiteFooter";
import { InlineCarousel } from "@/components/GalleryLightbox";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { CountUp } from "@/components/CountUp";
import { trackWhatsAppLead } from "@/lib/whatsapp-lead";
import { useReveal } from "@/hooks/use-reveal";
import { preloadImage } from "@/lib/image-cache";
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
import piscinaNoitePergola480 from "@/assets/thumbs/piscina-noite-pergola@480.webp";
import piscinaNoitePergola960 from "@/assets/thumbs/piscina-noite-pergola@960.webp";
import piscinaHero from "@/assets/piscina-hero-clean.webp";


import salaoJogosBilhar from "@/assets/salao-jogos-bilhar.jpg";
import lazerDrone from "@/assets/lazer-drone-piscina.jpg";
import aereaOrla from "@/assets/aerea-itacimirim-orla.jpg";
import aereaOrla480 from "@/assets/thumbs/aerea-itacimirim-orla@480.webp";
import aereaOrla960 from "@/assets/thumbs/aerea-itacimirim-orla@960.webp";
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

// Fundos decorativos usam a variante reduzida: todos ficam atrás de camada escura ou de
// grão, então a original (de 253 a 474 KB cada) não acrescentava nada visível.
import heroPousada960 from "@/assets/thumbs/pousada-0@960.webp";
import bgCoqueiros960 from "@/assets/thumbs/bg-coqueiros-escuro@960.webp";
import lazerDrone960 from "@/assets/thumbs/lazer-drone-piscina@960.webp";
import palmBg2_960 from "@/assets/thumbs/palm-bg-2@960.webp";
import piscinaNoite960 from "@/assets/thumbs/piscina-noite@960.webp";
import piscinaHero480 from "@/assets/thumbs/piscina-hero-clean@480.webp";
import piscinaHero960 from "@/assets/thumbs/piscina-hero-clean@960.webp";

// Variantes reduzidas das fotos de galeria (geradas por scripts/gen-thumbs.py).
import fachadaNoite_480 from "@/assets/thumbs/acomodacoes-fachada-hd@480.webp";
import fachadaNoite_960 from "@/assets/thumbs/acomodacoes-fachada-hd@960.webp";
import piscinaHero_480 from "@/assets/thumbs/piscina-hero-clean@480.webp";
import piscinaHero_960 from "@/assets/thumbs/piscina-hero-clean@960.webp";
import quiosqueJardim_480 from "@/assets/thumbs/quiosque-jardim@480.webp";
import quiosqueJardim_960 from "@/assets/thumbs/quiosque-jardim@960.webp";
import recepcaoNoite_480 from "@/assets/thumbs/recepcao-noite-2@480.webp";
import recepcaoNoite_960 from "@/assets/thumbs/recepcao-noite-2@960.webp";
import quartoDuplo_480 from "@/assets/thumbs/quarto-duplo-cover-hd@480.webp";
import quartoDuplo_960 from "@/assets/thumbs/quarto-duplo-cover-hd@960.webp";
import quartoDuploDetalhe_480 from "@/assets/thumbs/quarto-duplo-detalhe-hd@480.webp";
import quartoDuploDetalhe_960 from "@/assets/thumbs/quarto-duplo-detalhe-hd@960.webp";
import quartoDuploAlt2_480 from "@/assets/thumbs/quarto-duplo-varanda-hd@480.webp";
import quartoDuploAlt2_960 from "@/assets/thumbs/quarto-duplo-varanda-hd@960.webp";
import quartoTriplo1_480 from "@/assets/thumbs/quarto-triplo-1@480.webp";
import quartoTriplo1_960 from "@/assets/thumbs/quarto-triplo-1@960.webp";
import quartoTriplo2_480 from "@/assets/thumbs/quarto-triplo-2@480.webp";
import quartoTriplo2_960 from "@/assets/thumbs/quarto-triplo-2@960.webp";
import quartoTriploVaranda_480 from "@/assets/thumbs/quarto-triplo-varanda@480.webp";
import quartoTriploVaranda_960 from "@/assets/thumbs/quarto-triplo-varanda@960.webp";
import quartoTriploVista_480 from "@/assets/thumbs/quarto-triplo-vista-piscina@480.webp";
import quartoTriploVista_960 from "@/assets/thumbs/quarto-triplo-vista-piscina@960.webp";
import quartoQuadruplo_480 from "@/assets/thumbs/quarto-quadruplo-1@480.webp";
import quartoQuadruplo_960 from "@/assets/thumbs/quarto-quadruplo-1@960.webp";
import quartoQuadruplo2_480 from "@/assets/thumbs/quarto-quadruplo-2@480.webp";
import quartoQuadruplo2_960 from "@/assets/thumbs/quarto-quadruplo-2@960.webp";
import quartoQuadruploDetalhe_480 from "@/assets/thumbs/quarto-quadruplo-detalhe-hd@480.webp";
import quartoQuadruploDetalhe_960 from "@/assets/thumbs/quarto-quadruplo-detalhe-hd@960.webp";
import quartoQuadruplo3_480 from "@/assets/thumbs/quarto-quadruplo-3@480.webp";
import quartoQuadruplo3_960 from "@/assets/thumbs/quarto-quadruplo-3@960.webp";
import quartoQuadruploRede_480 from "@/assets/thumbs/quarto-quadruplo-rede-hd@480.webp";
import quartoQuadruploRede_960 from "@/assets/thumbs/quarto-quadruplo-rede-hd@960.webp";
import salaoJogosBilhar_480 from "@/assets/thumbs/salao-jogos-bilhar@480.webp";
import salaoJogosBilhar_960 from "@/assets/thumbs/salao-jogos-bilhar@960.webp";
import salaoJogosMesa_480 from "@/assets/thumbs/salao-jogos-mesa-hd@480.webp";
import salaoJogosMesa_960 from "@/assets/thumbs/salao-jogos-mesa-hd@960.webp";

/** Cada foto com suas variantes e as dimensões reais do original. */
const P = {
  fachadaNoite: { src: fachadaNoite, thumb: fachadaNoite_480, mid: fachadaNoite_960, width: 1152, height: 928 },
  piscinaHero: { src: piscinaHero, thumb: piscinaHero_480, mid: piscinaHero_960, width: 1600, height: 1600 },
  quiosqueJardim: { src: quiosqueJardim, thumb: quiosqueJardim_480, mid: quiosqueJardim_960, width: 1125, height: 2000 },
  recepcaoNoite: { src: recepcaoNoite, thumb: recepcaoNoite_480, mid: recepcaoNoite_960, width: 1200, height: 1600 },
  quartoDuplo: { src: quartoDuplo, thumb: quartoDuplo_480, mid: quartoDuplo_960, width: 1200, height: 1600 },
  quartoDuploDetalhe: { src: quartoDuploDetalhe, thumb: quartoDuploDetalhe_480, mid: quartoDuploDetalhe_960, width: 1500, height: 1000 },
  quartoDuploAlt2: { src: quartoDuploAlt2, thumb: quartoDuploAlt2_480, mid: quartoDuploAlt2_960, width: 1200, height: 1600 },
  quartoTriplo1: { src: quartoTriplo1, thumb: quartoTriplo1_480, mid: quartoTriplo1_960, width: 1200, height: 1600 },
  quartoTriplo2: { src: quartoTriplo2, thumb: quartoTriplo2_480, mid: quartoTriplo2_960, width: 1200, height: 1600 },
  quartoTriploVaranda: { src: quartoTriploVaranda, thumb: quartoTriploVaranda_480, mid: quartoTriploVaranda_960, width: 900, height: 1600 },
  quartoTriploVista: { src: quartoTriploVista, thumb: quartoTriploVista_480, mid: quartoTriploVista_960, width: 900, height: 1600 },
  quartoQuadruplo: { src: quartoQuadruplo, thumb: quartoQuadruplo_480, mid: quartoQuadruplo_960, width: 1500, height: 1000 },
  quartoQuadruplo2: { src: quartoQuadruplo2, thumb: quartoQuadruplo2_480, mid: quartoQuadruplo2_960, width: 1200, height: 1600 },
  quartoQuadruploDetalhe: { src: quartoQuadruploDetalhe, thumb: quartoQuadruploDetalhe_480, mid: quartoQuadruploDetalhe_960, width: 1200, height: 1600 },
  quartoQuadruplo3: { src: quartoQuadruplo3, thumb: quartoQuadruplo3_480, mid: quartoQuadruplo3_960, width: 1200, height: 1600 },
  quartoQuadruploRede: { src: quartoQuadruploRede, thumb: quartoQuadruploRede_480, mid: quartoQuadruploRede_960, width: 1500, height: 1000 },
  salaoJogosBilhar: { src: salaoJogosBilhar, thumb: salaoJogosBilhar_480, mid: salaoJogosBilhar_960, width: 1200, height: 1600 },
  salaoJogosMesa: { src: salaoJogosMesa, thumb: salaoJogosMesa_480, mid: salaoJogosMesa_960, width: 1400, height: 1867 },
} as const;

/** Preços de referência do Quarto Duplo em baixa temporada.
 *
 * Ficam aqui, num lugar só, porque o mesmo número aparece na primeira tela, no
 * comparativo com o Booking e na seção de acomodações. Espalhados pelo arquivo, um
 * reajuste faria o site se contradizer sozinho. */
const PRECO_DIRETO = 400;
const PRECO_BOOKING = 530;
const ECONOMIA = PRECO_BOOKING - PRECO_DIRETO;

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

/**
 * Revela um bloco com fade + leve subida ao entrar na tela durante o scroll, uma vez
 * só. Devolve ref+className pra colar no elemento existente (em vez de embrulhar em
 * outro nó), então não muda nenhuma estrutura de grid/posicionamento já existente.
 * transform+opacity rodam na GPU (sem travar a 60fps) e já respeitam "reduzir
 * movimento" via a regra global em styles.css.
 */
// Implementação em src/hooks/use-reveal.ts · compartilhada com a página de ambientes.


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
      { ...P.quartoDuplo, caption: "Quarto Duplo · Vista geral", desc: "Ambiente confortável, ideal para casais." },
      { ...P.quartoDuploDetalhe, caption: "Quarto Duplo · Outro ângulo", desc: "Cama de casal com TV, ar-condicionado e banheiro privativo." },
      { ...P.quartoDuploAlt2, caption: "Quarto Duplo · Varanda com vista", desc: "Varanda privativa com rede, vista para o jardim e piscina." },
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
      { ...P.quartoTriplo1, caption: "Quarto Triplo · Vista geral", desc: "Cama de casal e cama de solteiro, espaço amplo para 3 pessoas." },
      { ...P.quartoTriplo2, caption: "Quarto Triplo · Camas", desc: "Roupa de cama branca, frigobar e ambiente aconchegante." },
      { ...P.quartoTriploVaranda, caption: "Quarto Triplo · Varanda com rede", desc: "Varanda privativa em madeira, rede e vista para os coqueiros." },
      { ...P.quartoTriploVista, caption: "Quarto Triplo · Vista da piscina", desc: "Vista da varanda para a piscina e o verde ao redor." },
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
      { ...P.quartoQuadruplo, caption: "Quarto Quadruplo · Vista geral", desc: "Pensado para a família toda descansar junto, acomoda 3 ou 4 pessoas." },
      { ...P.quartoQuadruplo2, caption: "Quarto Quadruplo · Camas", desc: "Camas bem dispostas, boa circulação e ambiente aconchegante." },
      { ...P.quartoQuadruploDetalhe, caption: "Quarto Quadruplo · Outro ângulo", desc: "Camas com acesso direto à área externa da pousada." },
      { ...P.quartoQuadruplo3, caption: "Quarto Quadruplo · Varanda", desc: "Varanda em madeira com vista para o jardim." },
      { ...P.quartoQuadruploRede, caption: "Quarto Quadruplo · Rede na varanda", desc: "Rede privativa com vista aberta para o verde ao redor." },
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
  { ...P.fachadaNoite, caption: "Acomodações", desc: "Cabines com fachada amarela, varanda em madeira e clima acolhedor." },
  { ...P.piscinaHero, caption: "Piscina", desc: "Piscina de água cristalina, deck de madeira e coqueiros ao redor." },
  { ...P.quiosqueJardim, caption: "Área de Convivência", desc: "Espaço de convivência para relaxar entre um passeio e outro." },
  { ...P.recepcaoNoite, caption: "Recepção", desc: "Área de convivência da recepção, com estrutura em madeira e clima acolhedor." },
];

const GALLERY_META = [
  { kicker: "01. Suítes", tags: ["Varanda privativa", "Ar-condicionado", "Wi-Fi"] },
  { kicker: "02. Piscina", tags: ["Deck de madeira", "Área externa", "Iluminada"] },
  { kicker: "03. Convivência", tags: ["Quiosque", "Jardim", "Sombra natural"] },
  { kicker: "04. Recepção", tags: ["Check-in fácil", "Suporte local", "24h no WhatsApp"] },
];

type MosaicItem = { src: string; thumb?: string; mid?: string; caption: string; desc: string };
type MosaicMeta = { kicker: string; tags: string[] };

/**
 * Um cartão da grade "Quatro ambientes" — cada foto é a entrada clicável pro ambiente.
 *
 * Os quatro têm exatamente a mesma altura e o mesmo tratamento: a leitura que se quer é
 * "são quatro espaços, todos importantes", e qualquer assimetria fazia os três menores
 * parecerem rodapé do primeiro. O destaque das suítes ficou onde não quebra a simetria:
 * uma tarja discreta de "Principal".
 */
function MosaicTile({
  item,
  meta,
  anchor,
  destaque = false,
}: {
  item: MosaicItem;
  meta: MosaicMeta;
  anchor: string;
  destaque?: boolean;
}) {
  return (
    <Link
      to="/ambientes"
      hash={anchor}
      aria-label={`Ver ${item.caption}`}
      className={cn(
        // Canto quase reto e 3:2 deitado · medidas tiradas da referência que o dono mandou
        // (cartão de 302x201 com raio de ~4px). O arredondamento grande dava ar de app;
        // o canto reto é o que faz o bloco ler como material impresso de hotel.
        "group relative block aspect-[3/2] overflow-hidden rounded-[4px] bg-card",
        "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.40)] transition-shadow duration-500",
        "hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.50)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <img
        src={item.mid ?? item.src}
        srcSet={item.thumb && item.mid ? `${item.thumb} 480w, ${item.mid} 960w` : undefined}
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 92vw"
        alt={item.desc}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]"
      />
      {/* Véu constante + degradê embaixo: o texto precisa se sustentar em foto clara (piscina
          ao meio-dia) e escura (recepção à noite) com o mesmo peso nos quatro cartões. */}
      <div aria-hidden className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {/* O numerador some contra céu de meio-dia (foto da piscina) · esta sombra curta no
          topo é o que mantém os quatro rótulos com o mesmo peso de leitura. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

      {/* Tudo escala junto com o cartão · no celular são dois por linha, então cada um tem
          ~170px de largura e o mesmo conteúdo precisa caber sem virar sopa de letra. */}
      <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-1.5 sm:inset-x-4 sm:top-4 sm:gap-2">
        <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-sand sm:text-[10px] sm:tracking-[0.22em]">
          {meta.kicker}
        </span>
        {destaque && (
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-foreground sm:px-2.5 sm:text-[9px] sm:tracking-[0.18em]">
            Principal
          </span>
        )}
      </div>

      <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-4 sm:bottom-4">
        <div className="flex items-end justify-between gap-1.5 sm:gap-2">
          <p className="font-display text-[15px] leading-tight text-white sm:text-2xl">{item.caption}</p>
          <ChevronRight
            className="hidden h-5 w-5 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5 sm:block"
            aria-hidden
          />
        </div>
        {/* Duas palavras do que existe ali · o suficiente pra diferenciar os cartões sem
            transformar a grade num folheto. Somem no celular: em 170px de largura elas
            quebrariam em três linhas e comeriam a foto, que é o que se veio ver. */}
        <p className="mt-1 hidden text-[11px] leading-none text-white/70 sm:block">{meta.tags.slice(0, 2).join(" · ")}</p>
      </div>
    </Link>
  );
}

/** Seção da piscina com alternância dia/noite — toggle por toque (não por hover, que não existe em touch). */
function PiscinaSection() {
  const [time, setTime] = useState<"dia" | "noite">("dia");
  // A foto de "noite" só entra no DOM na primeira vez que for selecionada — evita baixar
  // as duas fotos grandes pra quem nunca troca de aba (era o achado do PRD de performance).
  const [noiteLoaded, setNoiteLoaded] = useState(false);
  const handleTime = (t: "dia" | "noite") => {
    if (t === "noite") setNoiteLoaded(true);
    setTime(t);
  };
  const toggleTime = () => handleTime(time === "dia" ? "noite" : "dia");

  // A foto da noite entra na fila logo depois que a página assenta: não disputa banda
  // com o carregamento inicial, mas já está pronta quando a troca automática dispara
  // aos 5s — sem isso a primeira troca engasgava esperando o download.
  useEffect(() => {
    // Baixa a variante de 960, que é a que o srcset vai pedir na maioria das telas · o
    // original de 1200 só entra em desktop grande, e aí o preload seria peso à toa.
    const t = window.setTimeout(() => preloadImage(piscinaNoitePergola960), 2500);
    return () => window.clearTimeout(t);
  }, []);

  // Troca sozinha entre dia/noite, pausando enquanto o visitante segura/arrasta a foto.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(toggleTime, 5000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, time]);

  const dragX = useRef<number | null>(null);
  const onDragStart = (x: number) => {
    dragX.current = x;
    setPaused(true);
  };
  const onDragEnd = (x: number) => {
    if (dragX.current !== null && Math.abs(x - dragX.current) > 40) toggleTime();
    dragX.current = null;
    setPaused(false);
  };

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
                onClick={() => handleTime(t)}
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

        {/* Canto reto e sombra no lugar do anel · mesmo acabamento dos cartões de ambientes,
            duas seções acima. Com o anel, a foto ganhava uma moldura que a página não usa em
            mais lugar nenhum. */}
        <figure
          className="mt-8 relative overflow-hidden rounded-[4px] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.40)] aspect-[4/5] sm:aspect-[16/10] cursor-grab active:cursor-grabbing touch-pan-y select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onMouseDown={(e) => onDragStart(e.clientX)}
          onMouseUp={(e) => onDragEnd(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0]?.clientX ?? 0)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0]?.clientX ?? 0)}
        >
          <img
            src={piscinaHero960}
            srcSet={`${piscinaHero480} 480w, ${piscinaHero960} 960w, ${piscinaHero} 1600w`}
            /* A figura ocupa a largura inteira do container (~1120px no desktop) · o "60vw"
               que estava aqui fazia o navegador baixar a variante de 960 e esticar, deixando
               a foto mole justamente no elemento maior da seção. */
            sizes="(min-width: 1200px) 1120px, (min-width: 640px) 92vw, 100vw"
            width={1600}
            height={1600}
            alt="Piscina da Pousada Ilha do Meio durante o dia"
            decoding="async"
            className={cn("absolute inset-0 h-full w-full object-cover object-[50%_72%] transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", time === "dia" ? "opacity-100" : "opacity-0")}
          />
          {noiteLoaded && (
            <img
              src={piscinaNoitePergola960}
              srcSet={`${piscinaNoitePergola480} 480w, ${piscinaNoitePergola960} 960w, ${piscinaNoitePergola} 1200w`}
              sizes="(min-width: 1200px) 1120px, (min-width: 640px) 92vw, 100vw"
              width={1200}
              height={1600}
              loading="lazy"
              decoding="async"
              alt="Piscina da Pousada Ilha do Meio iluminada à noite"
              className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", time === "noite" ? "opacity-100" : "opacity-0")}
            />
          )}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <figcaption className="absolute bottom-4 left-4 text-sm font-medium uppercase tracking-[0.18em] text-white">
            {time === "dia" ? "Piscina · dia" : "Piscina · noite"}
          </figcaption>
        </figure>

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

  const revealTrust = useReveal<HTMLDivElement>();
  const revealPousada = useReveal<HTMLDivElement>();
  const revealAvaliacoes = useReveal<HTMLDivElement>();
  const revealLazer = useReveal<HTMLDivElement>();
  const revealAcomodacoes = useReveal<HTMLDivElement>();
  const revealLocalizacao = useReveal<HTMLDivElement>();
  const revealReservar = useReveal<HTMLDivElement>();
  const revealFaq = useReveal<HTMLDivElement>();

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
        // Altura em svh com teto fixo, e não px puro. O px puro já cometeu os dois erros
        // possíveis aqui: 860px cortava as notas de avaliação no notebook de 800px, e o
        // 720px que veio depois deixava o sobrevoo pequeno em monitor grande. Com
        // min(88svh,820px) a tela de cada um manda, e o teto impede que vire um hero sem
        // fim em monitor de 1440. svh, e não vh, porque no celular o vh ignora a barra do
        // navegador e empurra o conteúdo pra fora.
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat min-h-[min(80svh,640px)] sm:min-h-[min(85svh,760px)] lg:min-h-[min(88svh,820px)] flex items-center"
        style={{ backgroundImage: `url(${heroPousada960})` }}
      >
        {/* Sobrevoo de drone da própria pousada, em loop mudo. Entra por cima da foto
            depois que a página carrega — se não puder tocar, a foto continua ali. */}
        <HeroVideoBackground src="/hero-pousada-loop.mp4" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/80" />
        <GrainOverlay />
        {/* Menos respiro vertical em telas grandes: com o cabeçalho fixo ocupando ~137px,
            o padding de 80px empurrava as notas de avaliação para fora da primeira tela
            num notebook comum. */}
        <div className="relative w-full mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-12 text-white">
          {/* Distância da praia em vez do CEP: a linha mais nobre da página precisa vender
              algo, e "a 450m da praia" é o que o hóspede quer saber. */}
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.32em] opacity-90 font-medium">
            <MapPin className="h-3.5 w-3.5" />
            Itacimirim, Bahia · 450m da praia
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-3xl text-balance">
            Pousada Ilha do Meio.<br />
            <em className="italic font-normal opacity-95">Perto do mar.</em>
          </h1>

          {/* A economia da reserva direta é o argumento mais forte da pousada · estava
              escondida no meio da página, agora abre a conversa. */}
          <div className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-2.5 text-white">
            <span className="font-display text-xl leading-none">R$ {PRECO_DIRETO}</span>
            <span className="text-xs text-white/75">a diária direto com a casa</span>
            <span className="text-xs text-white/50 line-through decoration-white/40">
              R$ {PRECO_BOOKING} no Booking
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-white">
            Economize R$ {ECONOMIA}/noite · café incluso
          </p>

          {/* Um só botão forte. O secundário virou link discreto que desce a própria
              página: antes era um botão que levava pra outra rota, tirando o visitante
              do caminho da reserva. */}
          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              onClick={() => trackWhatsAppLead("Hero - Reservar pelo WhatsApp", PRECO_DIRETO)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-7 py-4 text-base font-semibold shadow-2xl shadow-black/30 transition"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Reservar pelo WhatsApp
            </a>
            <a
              href="#acomodacoes"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white/70"
            >
              Ver fotos e quartos
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/70">
            Resposta em minutos · Segunda a segunda
          </p>

          {/* Duas fontes de nota somam 476 avaliações · antes só aparecia uma delas. */}
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-base text-white/90">
            <li className="inline-flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span><strong className="font-semibold">9,2</strong> de 10 · 204 avaliações</span>
            </li>
            <li className="inline-flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span><strong className="font-semibold">4,6</strong> no Google · 272 avaliações</span>
            </li>
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Atendimento direto com a casa</li>
          </ul>
        </div>
      </section>

      {/* TRUST BAR */}
      {/* A faixa tinha min-h de até 360px, mas o conteúdo dela ocupa ~190px · sobrava uma
          tarja preta vazia embaixo dos números, que no desktop tomava meia tela à toa. Sem
          a altura mínima, quem define o tamanho é o próprio conteúdo. */}
      <section className="relative isolate overflow-hidden">
        {/* Wallpaper coqueiros — verde escuro, sem mar */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgCoqueiros960})` }}
        />
        {/* Overlays escuros para legibilidade */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/50" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <GrainOverlay />

        <div ref={revealTrust.ref} className={cn(revealTrust.revealClass, "relative mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3")}>
          {[
            { n: "17", l: "Suítes" },
            { n: "9,2", l: "Nota dos hóspedes (204 avaliações)" },
            { n: "Direto", l: "Sem intermediário" },
          ].map((s) => (
            <div key={s.l} className="px-4 py-10 sm:py-12 text-center border-b sm:border-b-0 sm:border-r border-white/10 last:border-0">
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">{s.n}</div>
              <div className="text-xs lg:text-sm xl:text-base text-white/90 font-medium mt-2 whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* A POUSADA — apresentação editorial + acesso a /ambientes */}
      <section ref={revealPousada.ref} id="galeria" className={cn(revealPousada.revealClass, "mx-auto max-w-6xl px-4 py-16 sm:py-24")}>
        {/* items-center, e não items-end: com os cartões em 3:2 a grade encurtou, e o texto
            ancorado na base deixava um vão solto no topo. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">A casa</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
              Quatro ambientes,<br />
              <span className="italic opacity-90">uma ilha de sossego</span> entre coqueiros.
            </h2>
            {/* text-foreground/75 no lugar do muted: o cinza antigo ficava em ~3,9:1 sobre o
                creme do fundo, abaixo do mínimo de 4,5:1 de contraste. E 15px em vez de 14
                porque este é o parágrafo que explica a pousada — no celular ele era pequeno. */}
            <p className="mt-5 text-[15px] sm:text-base text-foreground/75 leading-relaxed">
              A Ilha do Meio não é um resort. São 17 suítes dispostas ao redor de um jardim
              com piscina, quiosque e salão de jogos separados por poucos passos. Fotografado sem retoque,
              como você vai encontrar.
            </p>
            <Link
              to="/ambientes"
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground group"
            >
              <span className="border-b-2 border-sand pb-1 group-hover:text-sand transition-colors">
                Percorrer todos os ambientes
              </span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          <div className="lg:col-span-7">
            {/* Grade 2x2 no desktop, coluna única no celular · na ordem em que se conhece a
                pousada: quarto, piscina, convivência, recepção. */}
            <div className="grid grid-cols-2 gap-3 sm:gap-[18px]">
              <MosaicTile item={GALLERY[0]} meta={GALLERY_META[0]} anchor="suites" destaque />
              <MosaicTile item={GALLERY[1]} meta={GALLERY_META[1]} anchor="piscina" />
              <MosaicTile item={GALLERY[2]} meta={GALLERY_META[2]} anchor="convivencia" />
              <MosaicTile item={GALLERY[3]} meta={GALLERY_META[3]} anchor="recepcao" />
            </div>
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES REAIS */}
      <section id="avaliacoes" className="bg-background">
        <div ref={revealAvaliacoes.ref} className={cn(revealAvaliacoes.revealClass, "mx-auto max-w-6xl px-4 py-10 sm:py-14")}>
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
      <section id="lazer" className="relative isolate overflow-hidden">
        {/* Wallpaper: vista aérea da piscina, preenche o fundo da seção */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${lazerDrone960})` }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/55" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/35 to-black/65" />
        <GrainOverlay />

        <div ref={revealLazer.ref} className={cn(revealLazer.revealClass, "relative mx-auto max-w-6xl px-4 py-16 sm:py-24")}>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">II. Lazer</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance text-white">
              Bilhar, quiosque, rede.<br />
              <span className="italic opacity-90">Tudo a três passos do quarto.</span>
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed max-w-md">
              O salão de jogos é o ponto de encontro entre famílias, casais e grupos de amigos: espaço pensado para relaxar entre um passeio e outro, com clima leve e descontraído.
            </p>
          </div>
        </div>

        {/* Filmstrip horizontal — arraste pro lado */}
        <div className="mt-10 flex gap-4 overflow-x-auto pb-6 pl-4 sm:pl-[max(1rem,calc((100vw-72rem)/2+1rem))] pr-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { ...P.salaoJogosBilhar, caption: "Mesa de Bilhar", desc: "Sinuca em ambiente coberto, com vista para o jardim." },
            { ...P.salaoJogosMesa, caption: "Mesa de jogos", desc: "Sinuca, pebolim e jogos de mesa para todas as idades." },
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

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
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
          style={{ backgroundImage: `url(${palmBg2_960})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/68 to-card/85" />
        <div ref={revealReservar.ref} className={cn(revealReservar.revealClass, "relative mx-auto max-w-6xl px-4 py-14 sm:py-20")}>
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
                <span className="font-display text-4xl sm:text-5xl tabular-nums">{PRECO_BOOKING}</span>
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
                <span className="font-display text-5xl sm:text-6xl tabular-nums text-primary">{PRECO_DIRETO}</span>
                <span className="text-xs text-muted-foreground">/ noite</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-primary">Você economiza até R$ {ECONOMIA}/noite</p>
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
      <section ref={revealAcomodacoes.ref} id="acomodacoes" className={cn(revealAcomodacoes.revealClass, "mx-auto max-w-6xl px-4 py-16 sm:py-24")}>
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-sand font-medium">III. Acomodações</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.02] text-balance">
            17 suítes.<br />
            <span className="italic opacity-90">Três configurações,</span> mesma tranquilidade.
          </h2>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-xs text-muted-foreground">Suítes a partir de</span>
            <span className="text-primary text-2xl font-semibold tabular-nums">R$ {PRECO_DIRETO}</span>
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
                <InlineCarousel items={r.photos} autoPlay autoPlayInterval={4500} />
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

      <section className="relative isolate overflow-hidden">
        {/* Aérea da orla de Itacimirim atrás da seção · como <img> e não background de CSS
            porque só assim existe srcset: o celular baixa 18 KB e o desktop 361 KB, em vez
            do mesmo arquivo pra todo mundo. O enquadramento muda de tamanho pra tamanho —
            a foto é panorâmica (2,43:1) e, cortada no centro no celular, ela perderia
            justamente o mar, que é o motivo de existir aqui. */}
        <img
          src={aereaOrla960}
          srcSet={`${aereaOrla480} 480w, ${aereaOrla960} 960w, ${aereaOrla} 1560w`}
          sizes="100vw"
          width={1560}
          height={642}
          alt="Vista aérea da orla de Itacimirim, com a praia, o mar e a lagoa ao lado da pousada"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_33%] sm:object-center"
        />
        {/* Véu leve: não é pra escurecer a foto, é pra segurar o estouro do céu. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/15" />
        <GrainOverlay />

        <div ref={revealLocalizacao.ref} className={cn(revealLocalizacao.revealClass, "relative mx-auto max-w-6xl px-4 py-20 sm:py-28")}>
          {/* Texto e mapa dentro de uma peça só, ocupando a largura inteira da seção · antes
              eram dois blocos soltos boiando sobre a foto, cada um com sua borda e sua
              sombra. Juntos, viram um painel: o endereço e o mapa passam a ser a mesma
              informação, que é o que eles sempre foram. O cartão é quem sustenta a leitura
              do texto sobre a foto, por isso nenhuma cor de texto precisou mudar. */}
          <div className="grid overflow-hidden rounded-[4px] bg-background/85 backdrop-blur-md shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)] md:grid-cols-[1.05fr_1fr]">
            <div className="p-6 sm:p-10">
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
            {/* O mapa encosta nas bordas do painel · sem canto, sem sombra e sem moldura
                própria, porque agora quem tem borda é o painel inteiro. No celular ele fica
                embaixo do texto, na mesma peça. */}
            <div className="relative min-h-[300px] border-t border-border/50 md:min-h-[460px] md:border-l md:border-t-0">
              <iframe
                title="Localização da Pousada Ilha do Meio no mapa"
                src="https://www.google.com/maps?q=Pousada+Ilha+do+Meio+Itacimirim&output=embed"
                className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05] saturate-[0.9]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <button
                type="button"
                onClick={() => setPendingRedirect({ url: GOOGLE_MAPS_URL, label: "Google Maps" })}
                className="absolute top-4 left-4 right-4 sm:right-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md transition hover:bg-white sm:text-sm"
              >
                <MapPin className="h-4 w-4 text-primary" />
                Abrir no Google Maps
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <VideoTestimonials />

      {/* FAQ INLINE */}
      <section id="faq" className="bg-background border-t border-border/60">
        <div ref={revealFaq.ref} className={cn(revealFaq.revealClass, "mx-auto max-w-6xl px-4 py-16 sm:py-24")}>
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
        style={{ backgroundImage: `url(${piscinaNoite960})` }}
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
