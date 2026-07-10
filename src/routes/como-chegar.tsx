import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Plane, Car, Navigation } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const PAGE_URL = "https://pousadailhadomeio.com.br/como-chegar";
const GOOGLE_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Pousada+Ilha+do+Meio+Itacimirim";
const WAZE = "https://waze.com/ul?q=Pousada%20Ilha%20do%20Meio%20Itacimirim";
const WHATSAPP =
  "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Preciso%20de%20orienta%C3%A7%C3%B5es%20para%20chegar%20na%20Pousada%20Ilha%20do%20Meio.";

export const Route = createFileRoute("/como-chegar")({
  head: () => ({
    meta: [
      { title: "Como chegar — Pousada Ilha do Meio · Itacimirim, Bahia" },
      {
        name: "description",
        content:
          "Como chegar à Pousada Ilha do Meio em Itacimirim, Bahia. A 50 min do Aeroporto de Salvador, entre Guarajuba e Praia do Forte. Rotas por Google Maps e Waze.",
      },
      { property: "og:title", content: "Como chegar — Pousada Ilha do Meio" },
      {
        property: "og:description",
        content:
          "Rotas, distâncias e pontos de referência para chegar em Itacimirim.",
      },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
              item: "https://pousadailhadomeio.com.br/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Como chegar",
              item: PAGE_URL,
            },
          ],
        }),
      },
    ],
  }),
  component: ComoChegarPage,
});

function ComoChegarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <span className="font-display text-base font-semibold tracking-tight">
              Pousada Ilha do Meio
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium mb-4">
            Localização
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Como chegar à pousada.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A Pousada Ilha do Meio fica em <strong className="text-foreground">Itacimirim, Camaçari — Bahia</strong>,
            entre Guarajuba e Praia do Forte, a poucos minutos a pé da Praia da Espera.
          </p>

          {/* CTAs de navegação */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={GOOGLE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              <Navigation className="h-4 w-4" />
              Abrir no Google Maps
            </a>
            <a
              href={WAZE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold hover:border-primary/40 transition"
            >
              <MapPin className="h-4 w-4" />
              Abrir no Waze
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold hover:border-primary/40 transition"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Orientação pelo WhatsApp
            </a>
          </div>

          {/* Mapa embed */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card">
            <iframe
              title="Mapa da Pousada Ilha do Meio em Itacimirim"
              src="https://www.google.com/maps?q=Pousada+Ilha+do+Meio+Itacimirim&output=embed"
              className="w-full h-[380px] sm:h-[460px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Distâncias */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Plane, title: "Aeroporto de Salvador (SSA)", val: "~ 50 min de carro", sub: "60 km via Estrada do Coco" },
              { icon: Car, title: "Praia do Forte", val: "~ 15 min de carro", sub: "18 km ao norte" },
              { icon: Car, title: "Guarajuba", val: "~ 10 min de carro", sub: "8 km ao sul" },
            ].map((d) => (
              <div key={d.title} className="rounded-2xl border border-border/60 bg-card p-5">
                <d.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">{d.title}</h3>
                <div className="mt-1 text-sm font-medium text-foreground">{d.val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{d.sub}</div>
              </div>
            ))}
          </div>

          {/* Passo a passo */}
          <div className="mt-14 max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Vindo de Salvador ou do aeroporto
            </h2>
            <ol className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">1.</strong> Do Aeroporto de Salvador, pegue a{" "}
                <strong className="text-foreground">BA-099 (Estrada do Coco / Linha Verde)</strong> sentido norte.
              </li>
              <li>
                <strong className="text-foreground">2.</strong> Siga por aproximadamente 45 minutos até a saída de{" "}
                <strong className="text-foreground">Itacimirim</strong>.
              </li>
              <li>
                <strong className="text-foreground">3.</strong> Entre no acesso à vila e siga as placas para o centro / Praia da Espera.
              </li>
              <li>
                <strong className="text-foreground">4.</strong> A pousada fica em rua tranquila, com estacionamento privativo.{" "}
                <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                  Ver rota exata no Google Maps →
                </a>
              </li>
            </ol>
          </div>

          {/* Aviso */}
          <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold tracking-tight">
              Precisa de transfer ou tem dúvida na chegada?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A recepção ajuda com orientação em tempo real e pode indicar motoristas de confiança da região.
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Falar com a recepção
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
