import { Instagram, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const WHATSAPP = "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20na%20Pousada%20Ilha%20do%20Meio.";
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";
const CNPJ = "45.688.734/0001-43";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2 text-sm text-muted-foreground">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Pousada</div>
              <div className="font-display text-lg text-foreground leading-none">Ilha do Meio</div>
            </div>
          </div>
          <div className="flex gap-2 text-xs leading-relaxed max-w-xs">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-foreground/60" />
            <div>Itacimirim, Camaçari — BA</div>
          </div>
        </div>

        <div className="space-y-2.5 md:text-right">
          <a href={WHATSAPP} target="_blank" rel="noopener" className="inline-flex md:justify-end items-center gap-2 hover:text-foreground transition-colors">
            <WhatsAppIcon className="h-3.5 w-3.5" /> Falar no WhatsApp
          </a>
          <div className="block">
            <a href={INSTAGRAM} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
              <Instagram className="h-3.5 w-3.5" /> @pousadailhadomeio
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-muted-foreground">
          <div className="tabular-nums">© {year} Pousada Ilha do Meio · CNPJ {CNPJ}</div>
          <div className="text-[10px] uppercase tracking-[0.18em]">Itacimirim · Bahia · Brasil</div>
        </div>
      </div>
    </footer>
  );
}
