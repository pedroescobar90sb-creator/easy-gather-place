import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { trackWhatsAppLead } from "@/lib/whatsapp-lead";

import heroPousada from "@/assets/pousada-0.jpg";
import logoHd from "@/assets/logo-oficial-branca-hd.png";

const WHATSAPP = `https://api.whatsapp.com/send/?phone=557191263096&text=${encodeURIComponent(
  "Olá! Vim pelo Instagram da Pousada Ilha do Meio e quero ver a disponibilidade e os valores.",
)}`;

/** Textura de grão sutil pro hero full-bleed — mesmo padrão usado em index.tsx, evita o visual "gradiente flat genérico". */
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

export const Route = createFileRoute("/direcionamento")({
  head: () => ({
    meta: [
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { name: "description", content: "Pousada em Itacimirim (BA), perto do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { property: "og:description", content: "Pousada em Itacimirim (BA), perto do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida." },
      { property: "og:image", content: heroPousada },
      { name: "twitter:image", content: heroPousada },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://pousadailhadomeio.com.br/direcionamento" },
    ],
    links: [{ rel: "canonical", href: "https://pousadailhadomeio.com.br/direcionamento" }],
  }),
  component: DirecionamentoPage,
});

function DirecionamentoPage() {
  return (
    <div
      className="relative h-[100dvh] overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${heroPousada})` }}
    >
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
      <GrainOverlay />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-6 text-center text-white overflow-hidden">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.32em] opacity-90 font-medium">
          <MapPin className="h-3.5 w-3.5" />
          Itacimirim · Bahia
        </div>

        <img
          src={logoHd}
          alt="Pousada Ilha do Meio · Itacimirim"
          className="mt-4 h-24 sm:h-32 w-auto object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
        />

        <p className="mt-4 max-w-sm text-sm sm:text-base text-white/85 leading-snug">
          Cabines de madeira entre coqueiros, piscina iluminada até tarde e recepção
          dedicada — a 5 minutos do mar.
        </p>

        <div className="mt-5 flex w-full max-w-xs flex-col gap-2.5">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            onClick={() => trackWhatsAppLead("Direcionamento - Reservar pelo WhatsApp")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 px-7 py-3.5 text-base font-semibold shadow-2xl shadow-black/30 transition"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Reservar pelo WhatsApp
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
          >
            Conheça a Pousada
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href="https://www.google.com/maps?q=Pousada+Ilha+do+Meio+Itacimirim"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-7 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Veja nossa localização no Google Maps
          </a>
        </div>

        <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-white/70">
          Reserva direta · Melhor tarifa garantida
        </p>
      </div>
    </div>
  );
}
