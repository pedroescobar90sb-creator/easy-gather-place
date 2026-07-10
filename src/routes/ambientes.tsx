import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, AirVent, Wifi, MonitorPlay, Refrigerator, Users, Sofa, UtensilsCrossed, Gamepad2, Sunset, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryLightbox, type GalleryItem } from "@/components/GalleryLightbox";
import { cn } from "@/lib/utils";

import fachadaNoite from "@/assets/acomodacoes-fachada-hd.jpg";
import recepcaoDia from "@/assets/recepcao-dia.jpg";
import quiosqueJardim from "@/assets/quiosque-jardim.jpg";
import piscinaNoite from "@/assets/piscina-noite.jpg";
import piscinaHero from "@/assets/piscina-hero-clean.jpg";
import piscinaDeck from "@/assets/piscina-aerea.png";
import piscinaLagoa from "@/assets/piscina-lagoa.jpg";
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
  encodeURIComponent("Olá! Vim pelo site da Pousada Ilha do Meio e quero ver a disponibilidade dos ambientes.");

type Ambiente = {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  gallery: GalleryItem[];
  amenities: { icon: React.ComponentType<{ className?: string }>; label: string }[];
  layout: "hero" | "wide" | "tall";
};

const AMBIENTES: Ambiente[] = [
  {
    id: "suites",
    kicker: "01 — Acomodações",
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
    layout: "hero",
  },
  {
    id: "piscina",
    kicker: "02 — Piscina",
    title: "Piscina & deck",
    subtitle: "Para refrescar sem sair da pousada",
    description:
      "Piscina iluminada com deck em madeira, espreguiçadeiras e sombra dos coqueiros. A poucos passos da porta do quarto — perfeita pro fim de tarde.",
    cover: piscinaNoite,
    gallery: [
      { src: piscinaNoite, caption: "Piscina à noite", desc: "Piscina iluminada, ambiente romântico." },
      { src: piscinaHero, caption: "Piscina de dia", desc: "Água cristalina e deck de madeira." },
      { src: piscinaDeck, caption: "Vista aérea", desc: "Deck cercado pela vegetação nativa." },
      { src: piscinaLagoa, caption: "Área da lagoa", desc: "Cantinho reservado ao lado da piscina." },
    ],
    amenities: [
      { icon: Sunset, label: "Deck de madeira" },
      { icon: Sofa, label: "Espreguiçadeiras" },
      { icon: ShieldCheck, label: "Iluminação noturna" },
    ],
    layout: "wide",
  },
  {
    id: "convivencia",
    kicker: "03 — Convivência",
    title: "Área de convivência",
    subtitle: "Quiosque e jardim",
    description:
      "Espaço ao ar livre pra descansar entre um passeio e outro. Quiosque com sombra, mesas para conversar e jardim que respira o clima da Bahia.",
    cover: quiosqueJardim,
    gallery: [
      { src: quiosqueJardim, caption: "Quiosque no jardim", desc: "Sombra natural e mesas para descansar." },
      { src: salaoJogos, caption: "Salão de jogos", desc: "Bilhar, mesa e ambiente para todos." },
      { src: salaoJogosBilhar, caption: "Mesa de bilhar", desc: "Diversão garantida em qualquer horário." },
      { src: salaoJogosMesa, caption: "Salão — mesa central", desc: "Ambiente climatizado e aconchegante." },
    ],
    amenities: [
      { icon: UtensilsCrossed, label: "Quiosque" },
      { icon: Gamepad2, label: "Salão de jogos" },
      { icon: Sofa, label: "Áreas de descanso" },
    ],
    layout: "tall",
  },
  {
    id: "recepcao",
    kicker: "04 — Recepção",
    title: "Recepção & atendimento",
    subtitle: "Do check-in ao check-out, sem pressa",
    description:
      "Recepção acolhedora e atendimento local que conhece Itacimirim de verdade. Dicas de praia, restaurantes e passeios — antes mesmo de você chegar.",
    cover: recepcaoDia,
    gallery: [
      { src: recepcaoDia, caption: "Recepção da pousada", desc: "Ambiente acolhedor, sempre pronto pra receber." },
    ],
    amenities: [
      { icon: ShieldCheck, label: "Check-in fácil" },
      { icon: WhatsAppIcon as unknown as React.ComponentType<{ className?: string }>, label: "Suporte no WhatsApp" },
      { icon: Users, label: "Atendimento local" },
    ],
    layout: "wide",
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
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER simples */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Voltar para o início">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition group-hover:bg-accent">
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </span>
            <Logo className="h-12 w-12 sm:h-14 sm:w-14 drop-shadow-sm" />
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 min-h-11 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/20 transition hover:brightness-110"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden xs:inline">Reservar</span>
          </a>
        </div>
      </header>

      {/* HERO editorial */}
      <section className="relative overflow-hidden border-b border-border/40 bg-card">
        <div className="absolute inset-0">
          <img
            src={fachadaNoite}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-40 scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary font-medium">
            A pousada · Itacimirim/BA
          </p>
          <h1
            className="mt-4 font-display text-4xl sm:text-6xl leading-[1.02] max-w-3xl"
            style={{ textShadow: "0 2px 22px rgba(0,0,0,0.35)" }}
          >
            Todos os ambientes,<br className="hidden sm:block" /> em detalhe.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Um tour visual pelos espaços da Pousada Ilha do Meio — das suítes em madeira à piscina iluminada. Toque em qualquer ambiente para abrir a galeria em tela cheia.
          </p>
          {/* Índice de navegação */}
          <nav aria-label="Índice de ambientes" className="mt-8 flex flex-wrap gap-2">
            {AMBIENTES.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 backdrop-blur px-4 py-2 min-h-11 text-sm font-medium text-foreground transition hover:bg-card"
              >
                {a.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* AMBIENTES — cada um como bloco editorial completo */}
      <main>
        {AMBIENTES.map((a, idx) => (
          <AmbienteBlock key={a.id} ambiente={a} reversed={idx % 2 === 1} />
        ))}
      </main>

      {/* CTA final */}
      <section className="border-t border-border/40 bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary font-medium">Pronto pra reservar?</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            Sua estadia começa aqui.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Tire dúvidas, veja disponibilidade e reserve direto pelo WhatsApp — falamos com você em minutos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 min-h-11 text-sm sm:text-base font-semibold text-primary-foreground shadow-xl shadow-black/25 transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Reservar no WhatsApp
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 min-h-11 text-sm sm:text-base font-semibold text-foreground transition hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function AmbienteBlock({ ambiente, reversed }: { ambiente: Ambiente; reversed: boolean }) {
  const { id, kicker, title, subtitle, description, cover, gallery, amenities } = ambiente;
  return (
    <section id={id} className="border-b border-border/40 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center", reversed && "lg:[&>*:first-child]:order-2")}>
          {/* Coluna imagem principal (clicável — abre galeria) */}
          <div className="lg:col-span-7">
            <GalleryLightbox
              items={gallery}
              trigger={
                <button
                  type="button"
                  className="group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-card aspect-[4/3] sm:aspect-[16/10] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow hover:shadow-2xl hover:shadow-black/25"
                  aria-label={`Abrir galeria de ${title}`}
                >
                  <img
                    src={cover}
                    alt={`${title} — ${subtitle}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                    <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md ring-1 ring-white/20 px-3 py-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.24em] text-white">
                      {kicker}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground shadow-lg transition group-hover:brightness-105">
                    Ver {gallery.length} fotos
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </div>
                </button>
              }
            />
          </div>

          {/* Coluna conteúdo */}
          <div className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-primary font-medium">{kicker}</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-[1.05]">{title}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted-foreground/90">{subtitle}</p>
            <p className="mt-5 text-base text-foreground/85 leading-relaxed">{description}</p>

            {/* Amenidades */}
            <ul className="mt-6 grid grid-cols-2 gap-2.5" aria-label={`Detalhes de ${title}`}>
              {amenities.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-foreground/90"
                >
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap gap-3">
              <GalleryLightbox
                items={gallery}
                trigger={
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 min-h-11 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition hover:brightness-110"
                  >
                    Explorar {title.toLowerCase()}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                }
              />
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 min-h-11 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Reservar
              </a>
            </div>

            {/* Miniaturas */}
            {gallery.length > 1 && (
              <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">Mais fotos</p>
                <div className="grid grid-cols-4 gap-2">
                  {gallery.slice(1, 5).map((g, i) => (
                    <GalleryLightbox
                      key={g.src + i}
                      items={gallery}
                      initialIndex={i + 1}
                      trigger={
                        <button
                          type="button"
                          aria-label={`Abrir ${g.caption}`}
                          className="group relative block w-full overflow-hidden rounded-lg bg-card aspect-square focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <img
                            src={g.src}
                            alt={g.caption}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/25 transition" />
                        </button>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
