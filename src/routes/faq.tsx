import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

const PAGE_URL = "https://pousadailhadomeio.com.br/faq";

/**
 * Fonte única para o FAQ. Renderizado na página E também transformado
 * em JSON-LD FAQPage no head · Google mostra as perguntas direto no
 * resultado da busca (rich result), aumentando muito o CTR orgânico.
 */
const FAQ: { q: string; a: string }[] = [
  {
    q: "Como faço uma reserva?",
    a: "A forma mais rápida é pelo WhatsApp oficial da recepção. Confirmamos disponibilidade, valores e condições em minutos. Também é possível reservar pelo Booking, mas a tarifa direta com a casa costuma ser melhor.",
  },
  {
    q: "Quais são os horários de check-in e check-out?",
    a: "Check-in das 13h às 22h. Check-out das 9h às 12h. Para chegadas fora do horário, basta avisar a recepção com antecedência.",
  },
  {
    q: "O café da manhã está incluso?",
    a: "Sim, o café da manhã é incluído em todas as diárias e servido diariamente com frutas, pães, frios, sucos naturais, bolos e itens regionais.",
  },
  {
    q: "A pousada aceita pets?",
    a: "No momento não recebemos animais de estimação para preservar o conforto de todos os hóspedes.",
  },
  {
    q: "Tem estacionamento?",
    a: "Sim, estacionamento privativo gratuito para os hóspedes, sujeito à disponibilidade de vagas.",
  },
  {
    q: "Qual a distância até a praia?",
    a: "A Praia da Espera fica a 450 metros da pousada, por caminho asfaltado. É uma das praias mais tranquilas do litoral norte da Bahia.",
  },
  {
    q: "Qual a distância do Aeroporto de Salvador?",
    a: "Aproximadamente 50 minutos de carro (60 km) pela BA-099 / Estrada do Coco. A recepção pode indicar motoristas de confiança para transfer.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos PIX, cartão de crédito, cartão de débito e dinheiro. Condições e políticas de sinal são informadas pela recepção no momento da reserva.",
  },
  {
    q: "Qual a política de cancelamento?",
    a: "A política varia conforme período e antecedência da reserva. A recepção informa as condições exatas no momento da confirmação · sempre buscamos flexibilidade sempre que possível.",
  },
  {
    q: "Os quartos têm ar-condicionado?",
    a: "Sim. Todos os quartos possuem ar-condicionado, TV, frigobar e banheiro privativo.",
  },
  {
    q: "Tem piscina?",
    a: "Sim, piscina ao ar livre em área tranquila com deck, além de salão de jogos, área de descanso e Wi-Fi gratuito em toda a pousada.",
  },
  {
    q: "Crianças podem se hospedar?",
    a: "Sim, crianças são bem-vindas. Fale com a recepção sobre política de idade e capacidade dos quartos para adequar a melhor acomodação para sua família.",
  },
  {
    q: "Qual a diferença entre reservar direto ou pelo Booking?",
    a: "Reservando direto com a pousada você paga a melhor tarifa (sem comissão de plataforma) e fala direto com quem cuida da casa · o que resolve dúvidas e pedidos com mais agilidade.",
  },
  {
    q: "Recebem grupos ou eventos?",
    a: "Sim. Temos quartos duplos, triplos e quádruplos, totalizando 17 acomodações. Para grupos maiores ou eventos, fale com a recepção para condições especiais.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes · Pousada Ilha do Meio · Itacimirim" },
      {
        name: "description",
        content:
          "Dúvidas sobre reservas, check-in, café da manhã, estacionamento, pets, pagamento e localização da Pousada Ilha do Meio em Itacimirim, Bahia.",
      },
      { property: "og:title", content: "Perguntas Frequentes · Pousada Ilha do Meio" },
      {
        property: "og:description",
        content: "Tudo o que você precisa saber antes da sua hospedagem em Itacimirim.",
      },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <LegalPageLayout
      eyebrow="Atendimento"
      title="Perguntas frequentes"
      intro="Respostas rápidas para as dúvidas mais comuns dos nossos hóspedes. Se precisar de algo além, fale com a recepção pelo WhatsApp."
    >
      <LegalSection title="Todas as perguntas">
        <div className="space-y-6">
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="text-foreground font-semibold">{f.q}</p>
              <p className="mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </LegalSection>
    </LegalPageLayout>
  );
}
