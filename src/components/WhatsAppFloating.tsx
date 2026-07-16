import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { trackWhatsAppLead } from "@/lib/whatsapp-lead";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Pousada%20Ilha%20do%20Meio%20e%20quero%20ver%20disponibilidade.";

/**
 * Sticky WhatsApp CTA em todas as páginas.
 * Pulse discreto + tooltip no desktop para reforçar convite.
 */
export function WhatsAppFloating() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] group">
      {/* Tooltip desktop */}
      <span
        aria-hidden
        className="hidden sm:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap items-center rounded-full bg-foreground/95 text-background px-3.5 py-1.5 text-xs font-medium shadow-lg opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none"
      >
        Fale com a recepção
      </span>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com a Pousada Ilha do Meio"
        className="relative inline-flex items-center justify-center rounded-full bg-[#128C7E] text-white h-12 w-12 sm:h-14 sm:w-14 shadow-2xl shadow-black/30 hover:scale-105 hover:bg-[#0f7a6e] active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        onClick={() => trackWhatsAppLead("Botão flutuante")}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#128C7E] motion-safe:animate-ping opacity-40"
          style={{ animationDuration: "2.4s" }}
        />
        <WhatsAppIcon className="relative h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </div>
  );
}
