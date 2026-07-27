import * as React from "react";

/**
 * Mensagem pré-preenchida do WhatsApp, com uma variação para quem chega pelo anúncio de
 * meio de semana (`?oferta=semana`).
 *
 * Por que isso existe: a pousada enche no fim de semana e sobra de domingo a quinta. O
 * anúncio desses dias oferece diária mais barata, mas **o preço do site não muda** — quem
 * aplica o desconto é quem atende, na conversa. Para isso, quem atende precisa saber que
 * aquela pessoa veio por essa oferta, e a única coisa que chega junto com a pessoa no
 * WhatsApp é o texto que ela envia.
 *
 * A mensagem **não cita desconto** de propósito. Ela diz apenas quais noites a pessoa quer.
 * Assim o valor público continua sendo um só, e o desconto segue como argumento de
 * fechamento em vez de virar vitrine.
 */

const TELEFONE = "557191263096";

/** Mensagem de quem veio pelo anúncio de domingo a quinta. */
const MSG_MEIO_DE_SEMANA =
  "Olá! Vim pelo site da Pousada Ilha do Meio e quero as diárias de domingo a quinta.";

/**
 * Guardado na sessão porque a pessoa pode navegar (home → ambientes → home) antes de
 * clicar, e o parâmetro só existe na primeira URL. Sessão e não localStorage: a oferta
 * vale para esta visita, não para sempre.
 */
const CHAVE = "pim_oferta_semana";

/** Só pode rodar no cliente · lê a URL e a sessão. */
function ofertaSemanaAtiva(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("oferta") === "semana") {
      sessionStorage.setItem(CHAVE, "1");
      return true;
    }
    return sessionStorage.getItem(CHAVE) === "1";
  } catch {
    // Navegador com armazenamento bloqueado · a oferta simplesmente não se aplica.
    return false;
  }
}

/** Monta o link do WhatsApp já com a mensagem certa. */
export function linkWhatsApp(msg: string, ofertaSemana = false): string {
  const texto = ofertaSemana ? MSG_MEIO_DE_SEMANA : msg;
  return `https://api.whatsapp.com/send/?phone=${TELEFONE}&text=${encodeURIComponent(texto)}`;
}

/**
 * Retorna `false` na primeira renderização e o valor real depois que a página monta.
 *
 * É de propósito: o servidor não tem como saber o parâmetro da URL do visitante, então
 * começar por `false` nos dois lados é o que evita o HTML do servidor divergir do que o
 * navegador monta. O clique só acontece bem depois disso.
 */
export function useOfertaSemana(): boolean {
  const [ativa, setAtiva] = React.useState(false);
  React.useEffect(() => {
    setAtiva(ofertaSemanaAtiva());
  }, []);
  return ativa;
}
