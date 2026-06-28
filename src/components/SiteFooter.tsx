import { Instagram, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const WHATSAPP =
  "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20na%20Pousada%20Ilha%20do%20Meio.";
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";
const PHONE_DISPLAY = "+55 (71) 9126-3096";
const CNPJ = "49.386.133/0001-37";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 grid gap-12 md:grid-cols-4 md:gap-10">
        {/* Marca */}
        <div className="space-y-4 md:col-span-1">
          <Logo className="h-16 w-16" />
          <p className="text-[13px] leading-relaxed text-muted-foreground max-w-[240px]">
            Pousada Ilha do Meio · Itacimirim, Bahia. Hospedagem com atendimento próximo e estrutura completa.
          </p>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h4 className="font-display text-base font-semibold text-foreground tracking-tight">
            Contato
          </h4>
          <ul className="space-y-3 text-[13px]">
            <li>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="font-medium">WhatsApp da recepção</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+557191263096"
                className="flex items-start gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="tabular-nums font-medium">{PHONE_DISPLAY}</span>
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="font-medium">@pousadailhadomeio</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Pousada */}
        <div className="space-y-4">
          <h4 className="font-display text-base font-semibold text-foreground tracking-tight">
            Pousada
          </h4>
          <div className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <div className="leading-relaxed">
              <div className="font-medium text-foreground">Itacimirim</div>
              <div>Camaçari — Bahia, Brasil</div>
            </div>
          </div>
          <div className="text-[13px] leading-relaxed text-muted-foreground space-y-1">
            <div><span className="font-medium text-foreground">Check-in:</span> 13h às 22h</div>
            <div><span className="font-medium text-foreground">Check-out:</span> 9h às 12h</div>
          </div>
        </div>

        {/* Informações */}
        <div className="space-y-4">
          <h4 className="font-display text-base font-semibold text-foreground tracking-tight">
            Informações
          </h4>
          <ul className="space-y-3 text-[13px]">
            <li>
              <Link
                to="/faq"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Perguntas frequentes
              </Link>
            </li>
            <li>
              <Link
                to="/termos"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link
                to="/privacidade"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Política de Privacidade
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div className="tabular-nums tracking-wide">
            © {year} Pousada Ilha do Meio
          </div>
          <div className="tabular-nums tracking-wide">
            CNPJ {CNPJ}
          </div>
        </div>
      </div>
    </footer>
  );
}
