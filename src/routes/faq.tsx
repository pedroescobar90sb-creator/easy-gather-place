import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes — Pousada Ilha do Meio" },
      { name: "description", content: "Dúvidas comuns sobre reservas, check-in, localização, café da manhã e políticas da Pousada Ilha do Meio em Itacimirim, Bahia." },
      { property: "og:title", content: "Perguntas Frequentes — Pousada Ilha do Meio" },
      { property: "og:description", content: "Tudo o que você precisa saber antes da sua hospedagem em Itacimirim." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <LegalPageLayout
      eyebrow="Atendimento"
      title="Perguntas frequentes"
      intro="Reunimos as dúvidas mais comuns dos nossos hóspedes para facilitar o seu planejamento. Se precisar de algo além disso, fale com a recepção pelo WhatsApp."
    >
      <LegalSection title="Reservas">
        <p>
          <strong className="text-foreground">Como faço uma reserva?</strong><br />
          A forma mais rápida é falar diretamente com a recepção pelo WhatsApp oficial, que confirma valores, disponibilidade e condições em poucos minutos.
        </p>
        <p>
          <strong className="text-foreground">A reserva é confirmada na hora?</strong><br />
          A confirmação formal é feita após o retorno da nossa equipe. Em horário comercial, normalmente respondemos em minutos.
        </p>
        <p>
          <strong className="text-foreground">Posso reservar para um grupo?</strong><br />
          Sim. Temos quartos duplos, triplos e quádruplos. Para grupos maiores ou eventos, fale com a recepção para condições especiais.
        </p>
      </LegalSection>

      <LegalSection title="Check-in e check-out">
        <p><strong className="text-foreground">Check-in:</strong> das 13h às 22h.</p>
        <p><strong className="text-foreground">Check-out:</strong> das 9h às 12h.</p>
        <p>
          Para chegadas fora do horário, basta avisar a recepção com antecedência pelo WhatsApp e organizamos seu recebimento.
        </p>
      </LegalSection>

      <LegalSection title="Localização">
        <p>
          A pousada fica em <strong className="text-foreground">Itacimirim, Camaçari — Bahia</strong>, próxima à Praia da Espera, entre Guarajuba e Praia do Forte. A praia está a poucos minutos a pé.
        </p>
        <p>
          O Aeroporto de Salvador (SSA) está a aproximadamente 50 minutos de carro.
        </p>
      </LegalSection>

      <LegalSection title="Café da manhã">
        <p>
          O café da manhã está incluído na hospedagem e é servido diariamente em ambiente agradável, com opções de frutas, pães, frios, sucos naturais e itens regionais.
        </p>
      </LegalSection>

      <LegalSection title="Estrutura e comodidades">
        <p>Piscina ao ar livre, Wi-Fi gratuito em toda a pousada, estacionamento privativo gratuito (sujeito à disponibilidade), salão de jogos e área de descanso.</p>
        <p>Todos os quartos possuem ar-condicionado, TV e frigobar.</p>
      </LegalSection>

      <LegalSection title="Políticas básicas de hospedagem">
        <p><strong className="text-foreground">Pets:</strong> não permitimos animais de estimação no momento.</p>
        <p><strong className="text-foreground">Idade mínima:</strong> 18 anos para realizar o check-in como responsável.</p>
        <p><strong className="text-foreground">Horário de silêncio:</strong> das 22h às 9h, para garantir o descanso de todos os hóspedes.</p>
      </LegalSection>

      <LegalSection title="Formas de contato">
        <p>
          Atendimento oficial pelo <strong className="text-foreground">WhatsApp da recepção</strong>, telefone <strong className="text-foreground tabular-nums">+55 (71) 9126-3096</strong> e Instagram <strong className="text-foreground">@pousadailhadomeio</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
