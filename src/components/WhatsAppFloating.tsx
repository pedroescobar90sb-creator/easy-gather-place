import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { trackWhatsAppLead } from "@/lib/whatsapp-lead";
import { linkWhatsApp, useOfertaSemana } from "@/lib/whatsapp-link";

const MSG_PADRAO = "Olá! Vim pelo site da Pousada Ilha do Meio e quero ver disponibilidade.";

/**
 * Sticky WhatsApp CTA em todas as páginas.
 * Pulse discreto + tooltip no desktop para reforçar convite.
 */
export function WhatsAppFloating() {
  // Este botão segue o visitante o site inteiro · se ele veio pelo anúncio de meio de
  // semana, a mensagem tem que ser a mesma dos CTAs da home.
  const WHATSAPP_URL = linkWhatsApp(MSG_PADRAO, useOfertaSemana());
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
        /* `hover:scale-105` só vale onde existe mouse · em celular o navegador simula hover
           no toque e o botão ficava crescido depois do clique. `active` é o estado que o
           dedo realmente produz. */
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-2xl shadow-black/30 transition-transform duration-200 motion-safe:active:scale-95 hover:bg-[#0f7a6e] sm:h-14 sm:w-14 sm:hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
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
