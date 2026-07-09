import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { metaTrack } from "@/lib/meta-pixel";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Pousada%20Ilha%20do%20Meio%20e%20quero%20ver%20disponibilidade.";

/**
 * Sticky WhatsApp CTA que aparece em todas as páginas.
 * Fica flutuando no canto inferior direito — visível o tempo todo,
 * especialmente crítico no mobile onde o header some ao rolar.
 */
export function WhatsAppFloating() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp com a Pousada Ilha do Meio"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] inline-flex items-center justify-center rounded-full bg-[#128C7E] text-white h-12 w-12 sm:h-14 sm:w-14 shadow-2xl shadow-black/30 hover:scale-105 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      onClick={() => metaTrack("Contact")}
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
}

