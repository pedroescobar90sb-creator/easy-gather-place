/**
 * Carimba a conversa do WhatsApp com o anúncio que trouxe a pessoa.
 *
 * O problema que isto resolve: todo mundo chega no WhatsApp com a mesma frase, então o dono
 * não tem como saber qual anúncio pagou a reserva — nem pra decidir onde botar o orçamento.
 * Os anúncios carregam os parâmetros UTM na URL de destino (configurados no campo
 * "Parâmetros de URL" da Meta, com as macros {{ad.name}}, {{placement}} etc.); aqui a gente
 * lê esses parâmetros e devolve um código curto que vai no fim da mensagem.
 *
 * A origem fica guardada por 30 dias porque o caminho real raramente é direto: a pessoa
 * clica no anúncio, navega, sai, volta pelo Google dois dias depois e só então chama no
 * WhatsApp. Sem a memória, essa reserva apareceria como se tivesse vindo do nada.
 */

const CHAVE = "pim_origem_anuncio";
const VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;

type OrigemGuardada = { codigo: string; ts: number };

/** Reduz um texto livre a um pedaço curto e seguro pra URL: "Novo Anúncio de Engajamento" → "novo-anuncio". */
function encurtar(valor: string, maxPalavras: number, maxChars: number): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, maxPalavras)
    .join("-")
    .slice(0, maxChars)
    .replace(/-$/, "");
}

/**
 * O posicionamento vem da Meta em formatos longos e variados ("Instagram_Reels",
 * "Facebook_Mobile_Feed"). Aqui vira sigla, porque quem vai ler isso é o dono na tela do
 * celular, no meio de uma conversa — "ig-reels" se entende de relance, o resto não.
 */
function siglaPosicionamento(bruto: string): string {
  const p = bruto.toLowerCase();
  const rede = p.includes("instagram") ? "ig" : p.includes("facebook") ? "fb" : p.includes("messenger") ? "msg" : "";
  const local = p.includes("reels")
    ? "reels"
    : p.includes("story") || p.includes("stories")
      ? "stories"
      : p.includes("feed")
        ? "feed"
        : p.includes("explore")
          ? "explore"
          : "";
  return [rede, local].filter(Boolean).join("-") || encurtar(bruto, 2, 14);
}

/** Monta o código a partir do que veio na URL. Devolve null quando a visita não veio de anúncio. */
function lerDaUrl(): string | null {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search);

  const criativo = q.get("utm_content"); // {{ad.name}} — o que mais importa: qual peça converteu
  const posicao = q.get("plc"); // {{placement}}
  const publico = q.get("utm_term"); // {{adset.name}}
  const fonte = q.get("utm_source");

  // fbclid sozinho já prova que veio de anúncio da Meta, mesmo sem UTM configurada —
  // é a rede de segurança pro caso de um anúncio antigo ficar sem os parâmetros.
  const veioDeAnuncio = Boolean(criativo || posicao || publico || fonte || q.get("fbclid"));
  if (!veioDeAnuncio) return null;

  const partes = [
    posicao ? siglaPosicionamento(posicao) : "",
    criativo ? encurtar(criativo, 3, 22) : "",
    !criativo && publico ? encurtar(publico, 3, 22) : "",
  ].filter(Boolean);

  if (partes.length === 0) return encurtar(fonte ?? "meta", 1, 10);
  return partes.join("-").slice(0, 40).replace(/-$/, "");
}

/** Chame uma vez quando a página abrir. Guarda a origem se esta visita veio de anúncio. */
export function capturarOrigem(): void {
  try {
    const codigo = lerDaUrl();
    if (!codigo) return;
    // Sempre sobrescreve: se a pessoa clicou num anúncio novo, é esse o crédito da vez.
    const dado: OrigemGuardada = { codigo, ts: Date.now() };
    localStorage.setItem(CHAVE, JSON.stringify(dado));
  } catch {
    // localStorage bloqueado (aba anônima, cookies negados) · o site segue igual, sem carimbo.
  }
}

/** O código da última origem conhecida, ou null se não houver / já tiver expirado. */
export function codigoOrigem(): string | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dado = JSON.parse(bruto) as OrigemGuardada;
    if (!dado?.codigo || Date.now() - dado.ts > VALIDADE_MS) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    return dado.codigo;
  } catch {
    return null;
  }
}

/**
 * Acrescenta o carimbo ao texto de um link de WhatsApp já montado.
 * Devolve a própria URL, sem tocar, quando não há origem ou o carimbo já está lá.
 */
export function carimbarLinkWhatsApp(href: string): string {
  const codigo = codigoOrigem();
  if (!codigo) return href;
  try {
    const url = new URL(href, window.location.origin);
    const texto = url.searchParams.get("text");
    if (!texto || texto.includes(`[${codigo}]`)) return href;
    url.searchParams.set("text", `${texto} [${codigo}]`);
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * Liga o carimbo em todo link de WhatsApp da página — inclusive os que ainda não existem.
 *
 * É um ouvinte único no documento em vez de mexer nos sete arquivos que montam esses links:
 * lá as URLs são constantes de módulo, criadas na importação, quando a origem ainda não foi
 * lida. Reescrever no clique também garante que qualquer link novo entre no esquema sozinho.
 */
export function ligarCarimboNosLinks(): () => void {
  const aoClicar = (e: MouseEvent) => {
    const alvo = (e.target as HTMLElement | null)?.closest?.("a");
    if (!alvo) return;
    const href = alvo.getAttribute("href");
    if (!href || !/(?:api\.whatsapp\.com|wa\.me)/.test(href)) return;
    const carimbado = carimbarLinkWhatsApp(href);
    if (carimbado !== href) alvo.setAttribute("href", carimbado);
  };
  // Fase de captura: o href precisa estar trocado antes de qualquer outro handler abrir a aba.
  document.addEventListener("click", aoClicar, true);
  return () => document.removeEventListener("click", aoClicar, true);
}
