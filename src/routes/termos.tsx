import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso · Pousada Ilha do Meio" },
      { name: "description", content: "Termos de uso do site oficial da Pousada Ilha do Meio em Itacimirim, Bahia." },
      { property: "og:title", content: "Termos de Uso · Pousada Ilha do Meio" },
      { property: "og:description", content: "Condições de uso do site oficial da Pousada Ilha do Meio." },
      { property: "og:url", content: "https://pousadailhadomeio.com.br/termos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://pousadailhadomeio.com.br/termos" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Institucional"
      title="Termos de Uso"
      intro="Este site é mantido pela Pousada Ilha do Meio com a finalidade de apresentar nossa estrutura e facilitar o contato para reservas. Ao navegar pelo site, o usuário declara estar de acordo com os termos abaixo."
    >
      <LegalSection title="1. Uso das informações do site">
        <p>
          Descrições, fotos, valores e comodidades têm caráter informativo e podem ser atualizados a qualquer momento, sem aviso prévio. As imagens são ilustrativas e podem apresentar pequenas variações em relação aos ambientes reais.
        </p>
      </LegalSection>

      <LegalSection title="2. Reservas e disponibilidade">
        <p>
          Solicitações de reserva são confirmadas diretamente com a recepção, sujeitas à disponibilidade real no momento do atendimento. A confirmação formal ocorre após retorno da equipe da pousada pelos canais oficiais.
        </p>
      </LegalSection>

      <LegalSection title="3. Tarifas e condições comerciais">
        <p>
          As tarifas exibidas são indicativas e podem variar conforme período, ocupação, sazonalidade e demais condições aplicáveis. Valores, formas de pagamento e regras finais são informados pela recepção durante o atendimento.
        </p>
      </LegalSection>

      <LegalSection title="4. Responsabilidade sobre informações">
        <p>
          A pousada não se responsabiliza por eventuais imprecisões, indisponibilidades momentâneas do site ou por decisões tomadas exclusivamente com base no conteúdo aqui exibido sem confirmação direta com a recepção.
        </p>
      </LegalSection>

      <LegalSection title="5. Atualização de informações">
        <p>
          O conteúdo deste site pode ser atualizado a qualquer momento para refletir mudanças em serviços, estrutura, políticas ou condições comerciais. A versão vigente é sempre a publicada nesta página.
        </p>
      </LegalSection>

      <LegalSection title="6. Direitos da marca e do conteúdo">
        <p>
          A marca <strong className="text-foreground">Pousada Ilha do Meio</strong>, logotipo, fotografias, textos e elementos visuais deste site são protegidos por direitos autorais e de propriedade intelectual. É vedada a reprodução, total ou parcial, sem autorização prévia e expressa.
        </p>
      </LegalSection>

      <LegalSection title="7. Atendimento e contato">
        <p>
          O canal oficial de atendimento é o WhatsApp da recepção, disponível neste site. Dúvidas sobre estes Termos podem ser enviadas por esse canal.
        </p>
      </LegalSection>

      <LegalSection title="8. Foro">
        <p>
          Fica eleito o foro da Comarca de Camaçari · Bahia para dirimir quaisquer questões oriundas destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
