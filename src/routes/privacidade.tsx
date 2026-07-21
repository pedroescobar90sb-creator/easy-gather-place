import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

const CNPJ = "27.850.100/0001-63";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade · Pousada Ilha do Meio" },
      { name: "description", content: "Como a Pousada Ilha do Meio coleta, usa e protege seus dados pessoais, em conformidade com a LGPD." },
      { property: "og:title", content: "Política de Privacidade · Pousada Ilha do Meio" },
      { property: "og:description", content: "Privacidade e proteção de dados na Pousada Ilha do Meio." },
      { property: "og:url", content: "https://pousadailhadomeio.com.br/privacidade" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://pousadailhadomeio.com.br/privacidade" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacidade"
      title="Política de Privacidade"
      intro="A Pousada Ilha do Meio respeita a privacidade dos seus hóspedes e visitantes, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei nº 13.709/2018)."
    >
      <LegalSection title="1. Controladora dos dados">
        <p>
          <strong className="text-foreground">Pousada Ilha do Meio</strong>, CNPJ <span className="tabular-nums">{CNPJ}</span>, localizada em Itacimirim, Camaçari, Bahia, Brasil.
        </p>
      </LegalSection>

      <LegalSection title="2. Dados que podemos coletar">
        <p>
          Informações fornecidas voluntariamente pelo titular, como <strong className="text-foreground">nome, telefone, e-mail e mensagens</strong> enviadas por formulários ou WhatsApp, além de dados técnicos de navegação no site (como cookies essenciais e métricas básicas de acesso).
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidade do tratamento">
        <p>
          Os dados são utilizados para responder solicitações, confirmar reservas, prestar atendimento, melhorar a experiência do site e cumprir obrigações legais aplicáveis à atividade de hospedagem.
        </p>
      </LegalSection>

      <LegalSection title="4. Base legal">
        <p>
          Execução de contrato e procedimentos preliminares, cumprimento de obrigação legal, legítimo interesse e, quando aplicável, consentimento do titular.
        </p>
      </LegalSection>

      <LegalSection title="5. Compartilhamento de dados">
        <p>
          Dados podem ser compartilhados apenas com prestadores essenciais à operação (reserva, pagamento, comunicação) ou para cumprimento de obrigação legal. <strong className="text-foreground">Não comercializamos dados pessoais.</strong>
        </p>
      </LegalSection>

      <LegalSection title="6. Proteção de dados">
        <p>
          Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados pessoais contra acessos não autorizados, perda, alteração ou destruição indevida.
        </p>
      </LegalSection>

      <LegalSection title="7. Direitos do titular">
        <p>
          O titular pode solicitar confirmação, acesso, correção, atualização, anonimização, portabilidade ou eliminação dos dados, conforme previsto na LGPD.
        </p>
      </LegalSection>

      <LegalSection title="8. Canal de contato sobre privacidade">
        <p>
          Solicitações podem ser enviadas pelo <strong className="text-foreground">WhatsApp oficial da recepção</strong>, identificando o assunto como <em>"Privacidade / LGPD"</em>.
        </p>
      </LegalSection>

      <LegalSection title="9. Atualizações desta política">
        <p>
          Esta Política pode ser atualizada periodicamente. A versão vigente é sempre a publicada nesta página.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
