/**
 * Cache de imagens fora do React.
 *
 * Vive no escopo do módulo de propósito: sobrevive a remontagens de componente e é
 * compartilhado entre os vários blocos de galeria da página de ambientes, então uma
 * foto já baixada por um bloco não é baixada de novo por outro.
 *
 * O objetivo é tirar o download e a decodificação da imagem do frame do clique —
 * é isso que causava o travamento ao abrir e ao passar foto.
 */

const cache = new Map<string, HTMLImageElement>();

/** Coloca a imagem na fila do navegador sem bloquear nada. Idempotente. */
export function preloadImage(src: string): HTMLImageElement | null {
  // O módulo também é avaliado no SSR (Nitro), onde Image não existe.
  if (typeof window === "undefined" || !src) return null;
  let img = cache.get(src);
  if (!img) {
    img = new Image();
    img.decoding = "async";
    img.src = src;
    cache.set(src, img);
  }
  return img;
}

/** A imagem já está baixada e pronta pra pintar? */
export function isReady(src: string): boolean {
  const img = cache.get(src);
  return !!img && img.complete && img.naturalWidth > 0;
}

/**
 * Resolve quando o bitmap está pronto pra pintar, ou quando o tempo limite estoura.
 *
 * Nunca rejeita de propósito: decode() rejeita em 404, CORS ou se o src for trocado no
 * meio, e nesses casos é melhor mostrar a <img> normal (o navegador desenha o que
 * conseguir) do que travar a navegação da galeria pra sempre. O tempo limite é a rede
 * de segurança pra conexão ruim: a foto abre com o fundo já visível em vez de a
 * interface ficar presa esperando.
 */
export function decodeImage(src: string, timeoutMs = 400): Promise<void> {
  const img = preloadImage(src);
  if (!img) return Promise.resolve();
  // Cache quente: zero espera.
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();

  let timer = 0;
  const guard = new Promise<void>((resolve) => {
    timer = window.setTimeout(resolve, timeoutMs);
  });

  return Promise.race([
    img.decode().then(
      () => undefined,
      () => undefined,
    ),
    guard,
  ]).finally(() => window.clearTimeout(timer));
}

/** Aquece as fotos vizinhas (anterior e próxima) pra troca seguinte sair instantânea. */
export function preloadNeighbors(srcs: readonly string[], idx: number): void {
  for (const i of [idx - 1, idx + 1]) {
    const src = srcs[i];
    if (src) preloadImage(src);
  }
}
