import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const WHATSAPP = "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20na%20Pousada%20Ilha%20do%20Meio.";
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";
const CNPJ = "45.688.734/0001-43";
const ADDRESS = "Rua Sítio Novo, 7 — Loteamento Santa Maria, Lote 8";
const CITY = "Itacimirim, Camaçari — BA · CEP 42823-000";
const EMAIL = "reservas@pousadailhadomeio.com.br";
const PHONE_DISPLAY = "+55 71 9126-3096";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3 text-sm text-muted-foreground">
        {/* Marca */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Pousada</div>
              <div className="font-display text-lg text-foreground leading-none">Ilha do Meio</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed max-w-xs">
            Pousada boutique em Itacimirim, a poucos minutos do mar. Atendimento da própria casa,
            sem comissão e melhor tarifa garantida.
          </p>
        </div>

        {/* Empresa */}
        <div className="space-y-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/80">Empresa</div>
          <div className="text-foreground/85 font-medium">Pousada Ilha do Meio</div>
          <div className="text-xs">CNPJ <span className="tabular-nums font-medium text-foreground/85">{CNPJ}</span></div>
          <div className="flex gap-2 text-xs leading-relaxed">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-foreground/60" />
            <div>
              {ADDRESS}
              <br />
              {CITY}
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/80">Contato</div>
          <a href={WHATSAPP} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <WhatsAppIcon className="h-3.5 w-3.5" /> {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-foreground transition-colors break-all">
            <Mail className="h-3.5 w-3.5 shrink-0" /> {EMAIL}
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Instagram className="h-3.5 w-3.5" /> @pousadailhadomeio
          </a>
          <a href="tel:+5571912630960" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Phone className="h-3.5 w-3.5" /> Ligar para a recepção
          </a>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div className="tabular-nums">
            © {year} Pousada Ilha do Meio · CNPJ {CNPJ} · Todos os direitos reservados.
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em]">Itacimirim · Bahia · Brasil</div>
        </div>
      </div>
    </footer>
  );
}
