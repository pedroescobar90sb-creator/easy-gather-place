import * as React from "react";

/**
 * Vídeo em loop atrás do hero.
 *
 * Regras que fazem isso rodar em celular:
 *  - `muted` + `playsInline` + `autoPlay`: sem os três, o iOS recusa tocar sozinho ou
 *    abre o vídeo em tela cheia por cima do site. O arquivo nem tem faixa de áudio.
 *  - O vídeo é *bônus*, nunca a base. O `<section>` que envolve isso já tem a foto como
 *    background-image, então quem não puder tocar o vídeo (iPhone em Modo de Baixo
 *    Consumo, Android com economia de dados, autoplay recusado) continua vendo a foto.
 *    Por isso também não uso `poster`: seria baixar a mesma imagem duas vezes.
 *  - Começa sem `src`. Só depois que a página está pronta é que o download começa —
 *    assim o vídeo não disputa banda com o texto e as fotos da primeira tela.
 */

type Props = {
  src: string;
  /**
   * Versão leve pro celular (640x360, 886 KB contra 3,1 MB). No 4G o arquivo grande demora
   * tanto que a pessoa rola a página antes de ele aparecer — e aí nunca vê o sobrevoo, só
   * a foto. Em 390px de largura, 640 de resolução já sobra.
   */
  srcMobile?: string;
  className?: string;
};

/** A partir daqui vale a pena o arquivo grande. */
const LARGURA_DESKTOP = 768;

/** Conexões onde baixar 2,3 MB de enfeite seria abuso. */
function deveEvitarVideo() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return true;
  return false;
}

export function HeroVideoBackground({ src, srcMobile, className }: Props) {
  const ref = React.useRef<HTMLVideoElement>(null);
  // Qual arquivo tocar só se decide depois que a página monta · medir a largura da tela no
  // render faria o servidor e o navegador renderizarem coisas diferentes.
  const [fonte, setFonte] = React.useState<string | null>(null);
  const [tocando, setTocando] = React.useState(false);
  const [noCelular, setNoCelular] = React.useState(false);

  // Adia o download pro fim da fila. `requestIdleCallback` espera o navegador ficar
  // ocioso; o setTimeout é o plano B pro Safari, que não tem essa API. Os prazos são
  // curtos porque no celular o arquivo agora é três vezes menor — esperar 2,5s pra
  // começar significava perder quem rola a página rápido.
  React.useEffect(() => {
    if (deveEvitarVideo()) return;
    const celular = window.innerWidth < LARGURA_DESKTOP;
    setNoCelular(celular);
    const escolhido = celular && srcMobile ? srcMobile : src;

    let cancelado = false;
    const ligar = () => { if (!cancelado) setFonte(escolhido); };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(ligar, { timeout: 1200 });
      return () => { cancelado = true; w.cancelIdleCallback?.(id); };
    }
    const t = window.setTimeout(ligar, 800);
    return () => { cancelado = true; window.clearTimeout(t); };
  }, [src, srcMobile]);

  // Pausa quando o hero sai da tela ou a aba vai pro fundo. Decodificar vídeo que
  // ninguém está vendo só gasta bateria — e em celular isso aquece o aparelho.
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !fonte) return;

    let visivelNaTela = true;
    const sincronizar = () => {
      if (visivelNaTela && !document.hidden) void el.play().catch(() => {});
      else el.pause();
    };

    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          ([e]) => { visivelNaTela = e.isIntersecting; sincronizar(); },
          { threshold: 0.01 },
        )
      : null;
    io?.observe(el);
    document.addEventListener("visibilitychange", sincronizar);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", sincronizar);
    };
  }, [fonte]);

  if (!fonte) return null;

  return (
    <video
      ref={ref}
      // aria-hidden + sem legenda: é decoração, não conteúdo. Quem usa leitor de tela
      // não ganha nada sendo avisado de um vídeo mudo de fundo.
      aria-hidden
      src={fonte}
      autoPlay
      muted
      loop
      playsInline
      // "metadata" no celular: com "auto" o navegador puxa o arquivo inteiro de uma vez,
      // que é o pior comportamento possível numa conexão móvel.
      preload={noCelular ? "metadata" : "auto"}
      disablePictureInPicture
      // Só aparece depois que está de fato rodando. Se o autoplay for recusado, isso
      // nunca vira 1 e a foto de fundo permanece — sem tela preta, sem tranco.
      onPlaying={() => setTocando(true)}
      className={[
        "absolute inset-0 h-full w-full object-cover",
        "transition-opacity duration-1000 ease-out",
        tocando ? "opacity-100" : "opacity-0",
        className ?? "",
      ].join(" ")}
    />
  );
}
