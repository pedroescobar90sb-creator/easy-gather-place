import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WHATSAPP = "https://api.whatsapp.com/send/?phone=557191263096";
const CNPJ = "49.386.133/0001-37";

export function InformacoesImportantes() {
  return (
    <section className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            Informações Importantes
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-[1.05]">
            Tudo o que você precisa saber antes da sua estadia.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Perguntas frequentes, termos de uso e política de privacidade da
            Pousada Ilha do Meio.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {/* FAQ */}
          <AccordionItem
            value="faq"
            className="rounded-2xl border border-border/60 bg-background px-5 sm:px-6"
          >
            <AccordionTrigger className="py-5 text-left font-display text-lg sm:text-xl hover:no-underline">
              Perguntas Frequentes (FAQ)
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-medium text-foreground">
                    Qual o horário de check-in e check-out?
                  </p>
                  <p className="mt-1">
                    Check-in das 13h às 22h. Check-out das 9h às 12h. Para
                    chegadas fora desse horário, fale com a recepção pelo
                    WhatsApp para alinharmos sua chegada.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    A pousada aceita pets?
                  </p>
                  <p className="mt-1">
                    Não. Para preservar o conforto de todos os hóspedes, no
                    momento a pousada não permite animais de estimação.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Há estacionamento?
                  </p>
                  <p className="mt-1">
                    Sim. Disponibilizamos estacionamento privativo gratuito
                    para os hóspedes, sujeito à disponibilidade de vagas.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tem Wi-Fi?</p>
                  <p className="mt-1">
                    Sim. Wi-Fi gratuito disponível em toda a pousada.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Onde fica a pousada?</p>
                  <p className="mt-1">
                    Estamos em Itacimirim, Camaçari — Bahia, próximos à Praia
                    da Espera, entre Guarajuba e Praia do Forte.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Crianças são aceitas?</p>
                  <p className="mt-1">
                    Sim, recebemos famílias com crianças. A idade mínima para
                    realizar o check-in como responsável é de 18 anos.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Existe horário de silêncio?</p>
                  <p className="mt-1">
                    Sim. Mantemos um período de silêncio das 22h às 9h, para
                    garantir o descanso de todos os hóspedes.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Como faço uma reserva e confirmo disponibilidade?
                  </p>
                  <p className="mt-1">
                    A maneira mais rápida é falar diretamente com a recepção
                    pelo{" "}
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      WhatsApp
                    </a>
                    . Nossa equipe confirma valores, disponibilidade e formas
                    de pagamento em poucos minutos.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Como entrar em contato?
                  </p>
                  <p className="mt-1">
                    Atendemos por WhatsApp e pelas redes sociais oficiais da
                    pousada. Para solicitações mais detalhadas, escreva para a
                    recepção pelo WhatsApp informando suas datas e o número de
                    hóspedes.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* TERMOS DE USO */}
          <AccordionItem
            value="termos"
            className="rounded-2xl border border-border/60 bg-background px-5 sm:px-6"
          >
            <AccordionTrigger className="py-5 text-left font-display text-lg sm:text-xl hover:no-underline">
              Termos de Uso
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  Este site é mantido pela Pousada Ilha do Meio com a
                  finalidade de apresentar nossa estrutura, acomodações e
                  facilitar o contato para reservas. Ao navegar pelo site, o
                  usuário declara estar de acordo com os termos abaixo.
                </p>
                <div>
                  <p className="font-medium text-foreground">
                    1. Uso das informações do site
                  </p>
                  <p className="mt-1">
                    As informações publicadas, como descrições de acomodações,
                    fotos, valores e comodidades, têm caráter informativo e
                    podem ser atualizadas a qualquer momento, sem aviso prévio.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    2. Reservas e disponibilidade
                  </p>
                  <p className="mt-1">
                    Solicitações de reserva são confirmadas diretamente com a
                    recepção, sujeitas à disponibilidade real no período
                    desejado. A confirmação formal da reserva ocorre apenas
                    após retorno da equipe da pousada.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    3. Tarifas e condições
                  </p>
                  <p className="mt-1">
                    As tarifas exibidas no site são meramente indicativas e
                    podem variar conforme período, ocupação e demais condições
                    da reserva. Valores e regras finais são informados no
                    atendimento.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    4. Limitação de responsabilidade
                  </p>
                  <p className="mt-1">
                    A pousada se empenha em manter as informações do site
                    corretas e atualizadas, mas não se responsabiliza por
                    eventuais imprecisões, indisponibilidades momentâneas do
                    site ou por decisões tomadas exclusivamente com base no
                    conteúdo aqui exibido, sem confirmação direta com a
                    recepção.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    5. Atendimento e contato
                  </p>
                  <p className="mt-1">
                    O canal oficial de atendimento da pousada é o WhatsApp da
                    recepção, disponível neste site. Em caso de dúvidas sobre
                    estes Termos de Uso, entre em contato por esse canal.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* POLÍTICA DE PRIVACIDADE */}
          <AccordionItem
            value="privacidade"
            className="rounded-2xl border border-border/60 bg-background px-5 sm:px-6"
          >
            <AccordionTrigger className="py-5 text-left font-display text-lg sm:text-xl hover:no-underline">
              Política de Privacidade
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  A Pousada Ilha do Meio respeita a privacidade dos seus
                  hóspedes e visitantes do site, em conformidade com a Lei
                  Geral de Proteção de Dados Pessoais — LGPD (Lei nº
                  13.709/2018).
                </p>

                <div>
                  <p className="font-medium text-foreground">
                    1. Controladora dos dados
                  </p>
                  <p className="mt-1">
                    Pousada Ilha do Meio — CNPJ {CNPJ}, localizada em
                    Itacimirim, Camaçari — Bahia, Brasil.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    2. Dados que podemos coletar
                  </p>
                  <p className="mt-1">
                    Podemos coletar informações fornecidas voluntariamente pelo
                    usuário, como nome, telefone, e-mail e mensagens enviadas
                    por formulários ou pelo WhatsApp, além de dados técnicos
                    de navegação no site (como páginas acessadas e
                    informações do dispositivo).
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    3. Finalidade do tratamento
                  </p>
                  <p className="mt-1">
                    Utilizamos esses dados para responder solicitações,
                    confirmar reservas, prestar atendimento, melhorar a
                    experiência do site e cumprir obrigações legais e
                    regulatórias aplicáveis à atividade de hospedagem.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    4. Base legal
                  </p>
                  <p className="mt-1">
                    O tratamento dos dados ocorre com base nas hipóteses
                    previstas na LGPD, especialmente: execução de contrato e
                    procedimentos preliminares (reservas), cumprimento de
                    obrigação legal, legítimo interesse e, quando aplicável,
                    consentimento do titular.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    5. Compartilhamento de dados
                  </p>
                  <p className="mt-1">
                    Os dados podem ser compartilhados apenas com prestadores de
                    serviço essenciais à operação da pousada (como sistemas de
                    reserva, pagamento e comunicação) ou para cumprimento de
                    obrigação legal. Não comercializamos dados pessoais.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    6. Direitos do titular
                  </p>
                  <p className="mt-1">
                    O titular dos dados pode, a qualquer momento, solicitar
                    confirmação, acesso, correção, atualização, anonimização,
                    portabilidade ou eliminação dos seus dados pessoais, além
                    de informações sobre uso e compartilhamento, conforme
                    previsto na LGPD.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    7. Canal de contato sobre privacidade
                  </p>
                  <p className="mt-1">
                    Solicitações relacionadas a dados pessoais podem ser
                    enviadas para a recepção da pousada pelo{" "}
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-foreground"
                    >
                      WhatsApp oficial
                    </a>
                    , identificando o assunto como “Privacidade / LGPD”.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    8. Atualizações desta política
                  </p>
                  <p className="mt-1">
                    Esta Política de Privacidade pode ser atualizada
                    periodicamente para refletir melhorias, mudanças
                    operacionais ou exigências legais. A versão vigente é
                    sempre a publicada nesta página.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
