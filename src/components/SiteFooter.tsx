import { Instagram, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ReactNode } from "react";

const WHATSAPP =
  "https://api.whatsapp.com/send/?phone=557191263096&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva%20na%20Pousada%20Ilha%20do%20Meio.";
const INSTAGRAM = "https://www.instagram.com/pousadailhadomeio/";
const PHONE_DISPLAY = "+55 (71) 9126-3096";
const CNPJ = "49.386.133/0001-37";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const [openItem, setOpenItem] = useState<string>("");

  function open(value: string) {
    setOpenItem(value);
    setTimeout(() => {
      document
        .getElementById("footer-informacoes")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

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
            href="tel:+557191263096"
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
          <button
            type="button"
            onClick={() => open("faq")}
            className="block text-left hover:text-foreground transition-colors"
          >
            Perguntas frequentes
          </button>
          <button
            type="button"
            onClick={() => open("termos")}
            className="block text-left hover:text-foreground transition-colors"
          >
            Termos de Uso
          </button>
          <button
            type="button"
            onClick={() => open("privacidade")}
            className="block text-left hover:text-foreground transition-colors"
          >
            Política de Privacidade
          </button>
        </div>
      </div>

      {/* Conteúdo institucional expansível */}
      <div id="footer-informacoes" className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="space-y-3"
          >
            <AccordionItem
              value="faq"
              className="rounded-2xl border border-border/60 bg-background px-5 sm:px-6"
            >
              <AccordionTrigger className="py-4 text-left font-display text-base sm:text-lg hover:no-underline">
                Perguntas Frequentes
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <FAQContent />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="termos"
              className="rounded-2xl border border-border/60 bg-background px-5 sm:px-6"
            >
              <AccordionTrigger className="py-4 text-left font-display text-base sm:text-lg hover:no-underline">
                Termos de Uso
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <TermsContent />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="privacidade"
              className="rounded-2xl border border-border/60 bg-background px-5 sm:px-6"
            >
              <AccordionTrigger className="py-4 text-left font-display text-base sm:text-lg hover:no-underline">
                Política de Privacidade
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <PrivacyContent />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
        neste site.
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
        Informações fornecidas voluntariamente como nome, telefone e mensagens
        enviadas por WhatsApp, além de dados técnicos de navegação no site.
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
