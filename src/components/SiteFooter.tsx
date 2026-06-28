import { Instagram, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from "react";

const WHATSAPP =
  "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20na%20Pousada%20Ilha%20do%20Meio.";
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";
const PHONE_DISPLAY = "+55 (71) 9126-3096";
const CNPJ = "49.386.133/0001-37";

function LegalDialog({
  trigger,
  title,
  children,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] px-6 pb-6 pt-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function LinkButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="text-left hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-4 text-sm text-muted-foreground">
        {/* Marca */}
        <div className="space-y-3 md:col-span-1">
          <Logo className="h-16 w-16" />
          <p className="text-xs leading-relaxed max-w-xs">
            Pousada autoral em Itacimirim, entre Guarajuba e Praia do Forte.
          </p>
        </div>

        {/* Contato */}
        <div className="space-y-3">
          <h4 className="text-foreground font-medium text-xs uppercase tracking-[0.18em]">
            Contato
          </h4>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-foreground transition-colors"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>WhatsApp da recepção</span>
          </a>
          <a
            href={`tel:+557191263096`}
            className="flex items-start gap-2 hover:text-foreground transition-colors"
          >
            <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span className="tabular-nums">{PHONE_DISPLAY}</span>
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-foreground transition-colors"
          >
            <Instagram className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>@pousadailhadomeio</span>
          </a>
        </div>

        {/* Endereço */}
        <div className="space-y-3">
          <h4 className="text-foreground font-medium text-xs uppercase tracking-[0.18em]">
            Pousada
          </h4>
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <div className="leading-relaxed">
              Itacimirim<br />
              Camaçari — Bahia, Brasil
            </div>
          </div>
          <div className="text-xs leading-relaxed">
            <div>Check-in: 13h às 22h</div>
            <div>Check-out: 9h às 12h</div>
          </div>
        </div>

        {/* Informações */}
        <div className="space-y-3">
          <h4 className="text-foreground font-medium text-xs uppercase tracking-[0.18em]">
            Informações
          </h4>

          <LegalDialog trigger={<LinkButton>Perguntas frequentes</LinkButton>} title="Perguntas Frequentes">
            <FAQContent />
          </LegalDialog>

          <div>
            <LegalDialog trigger={<LinkButton>Termos de Uso</LinkButton>} title="Termos de Uso">
              <TermsContent />
            </LegalDialog>
          </div>

          <div>
            <LegalDialog trigger={<LinkButton>Política de Privacidade</LinkButton>} title="Política de Privacidade">
              <PrivacyContent />
            </LegalDialog>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-muted-foreground">
          <div className="tabular-nums">
            © {year} Pousada Ilha do Meio · CNPJ {CNPJ}
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em]">
            Itacimirim · Bahia · Brasil
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Conteúdos institucionais ---------------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function FAQContent() {
  return (
    <>
      <Section title="Qual o horário de check-in e check-out?">
        Check-in das 13h às 22h. Check-out das 9h às 12h. Para chegadas fora
        desse horário, fale com a recepção pelo WhatsApp.
      </Section>
      <Section title="A pousada aceita pets?">
        Não. No momento a pousada não permite animais de estimação.
      </Section>
      <Section title="Há estacionamento?">
        Sim. Estacionamento privativo gratuito, sujeito à disponibilidade.
      </Section>
      <Section title="Tem Wi-Fi?">Sim, Wi-Fi gratuito em toda a pousada.</Section>
      <Section title="Onde fica a pousada?">
        Itacimirim, Camaçari — Bahia, próximo à Praia da Espera, entre Guarajuba
        e Praia do Forte.
      </Section>
      <Section title="Crianças são aceitas?">
        Sim. A idade mínima para realizar o check-in como responsável é 18 anos.
      </Section>
      <Section title="Horário de silêncio">
        Das 22h às 9h, para garantir o descanso de todos os hóspedes.
      </Section>
      <Section title="Como faço uma reserva?">
        A forma mais rápida é falar diretamente com a recepção pelo WhatsApp
        oficial, que confirma valores e disponibilidade em minutos.
      </Section>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <p>
        Este site é mantido pela Pousada Ilha do Meio com a finalidade de
        apresentar nossa estrutura e facilitar o contato para reservas. Ao
        navegar pelo site, o usuário declara estar de acordo com os termos
        abaixo.
      </p>
      <Section title="1. Uso das informações do site">
        Descrições, fotos, valores e comodidades têm caráter informativo e podem
        ser atualizados a qualquer momento, sem aviso prévio.
      </Section>
      <Section title="2. Reservas e disponibilidade">
        Solicitações de reserva são confirmadas diretamente com a recepção,
        sujeitas à disponibilidade real. A confirmação formal ocorre após o
        retorno da equipe da pousada.
      </Section>
      <Section title="3. Tarifas e condições">
        As tarifas exibidas são indicativas e podem variar conforme período,
        ocupação e demais condições. Valores e regras finais são informados no
        atendimento.
      </Section>
      <Section title="4. Limitação de responsabilidade">
        A pousada não se responsabiliza por eventuais imprecisões,
        indisponibilidades momentâneas do site ou por decisões tomadas
        exclusivamente com base no conteúdo aqui exibido sem confirmação direta
        com a recepção.
      </Section>
      <Section title="5. Atendimento e contato">
        O canal oficial de atendimento é o WhatsApp da recepção, disponível
        neste site. Dúvidas sobre estes Termos podem ser enviadas por esse
        canal.
      </Section>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <p>
        A Pousada Ilha do Meio respeita a privacidade dos seus hóspedes e
        visitantes, em conformidade com a Lei Geral de Proteção de Dados
        Pessoais — LGPD (Lei nº 13.709/2018).
      </p>
      <Section title="1. Controladora dos dados">
        Pousada Ilha do Meio — CNPJ {CNPJ}, localizada em Itacimirim, Camaçari
        — Bahia, Brasil.
      </Section>
      <Section title="2. Dados que podemos coletar">
        Informações fornecidas voluntariamente como nome, telefone, e-mail e
        mensagens enviadas por formulários ou WhatsApp, além de dados técnicos
        de navegação no site.
      </Section>
      <Section title="3. Finalidade do tratamento">
        Responder solicitações, confirmar reservas, prestar atendimento,
        melhorar a experiência do site e cumprir obrigações legais aplicáveis à
        atividade de hospedagem.
      </Section>
      <Section title="4. Base legal">
        Execução de contrato e procedimentos preliminares, cumprimento de
        obrigação legal, legítimo interesse e, quando aplicável, consentimento
        do titular.
      </Section>
      <Section title="5. Compartilhamento de dados">
        Dados podem ser compartilhados apenas com prestadores essenciais à
        operação (reserva, pagamento, comunicação) ou para cumprimento de
        obrigação legal. Não comercializamos dados pessoais.
      </Section>
      <Section title="6. Direitos do titular">
        O titular pode solicitar confirmação, acesso, correção, atualização,
        anonimização, portabilidade ou eliminação dos dados, conforme previsto
        na LGPD.
      </Section>
      <Section title="7. Canal de contato sobre privacidade">
        Solicitações podem ser enviadas pelo WhatsApp oficial da recepção,
        identificando o assunto como "Privacidade / LGPD".
      </Section>
      <Section title="8. Atualizações desta política">
        Esta Política pode ser atualizada periodicamente. A versão vigente é
        sempre a publicada nesta página.
      </Section>
    </>
  );
}
