import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { decodeImage, preloadImage, preloadNeighbors } from "@/lib/image-cache";
import lightboxBg from "@/assets/lightbox-bg.jpg";

export type GalleryItem = {
  src: string;
  caption: string;
  desc: string;
  /** Variante 480w · usada nas miniaturas do grid e no fundo desfocado da lightbox. */
  thumb?: string;
  /** Variante 960w · degrau intermediário do srcset. */
  mid?: string;
  /** Dimensões reais do original · evitam salto de layout enquanto a foto carrega. */
  width?: number;
  height?: number;
  /**
   * `object-position` da miniatura no mosaico. Só faz sentido quando o assunto não está
   * no centro da foto: o tile é bem mais largo que alto, então o corte padrão come as
   * pontas. Ex.: na piscina à noite a água ocupa só a faixa de baixo do retrato — sem
   * isto o mosaico mostrava apenas o céu e os coqueiros. Não afeta a lightbox, que usa
   * `object-contain` e mostra a foto inteira.
   */
  focus?: string;
};

/**
 * Qual arquivo mostrar na tela cheia.
 *
 * Os originais vão de 114 KB a 528 KB e têm ~1200px de largura. Num celular de 390px
 * (mesmo a 3x) a variante de 960 é praticamente indistinguível e pesa um terço — e
 * normalmente já está em cache, porque é ela que o mosaico usou. Em monitor, aí sim vale
 * o original.
 *
 * Só pode ser chamada no cliente: mede a tela. Por isso ela mora no efeito, nunca no
 * render — no servidor não existe `window`, e o HTML sairia diferente do que o navegador
 * monta depois.
 */
function escolherVariante(item: GalleryItem): string {
  if (typeof window === "undefined") return item.src;
  const alvo = window.innerWidth * (window.devicePixelRatio || 1);
  return alvo <= 1200 && item.mid ? item.mid : item.src;
}

type Props = {
  items: GalleryItem[];
  className?: string;
  gridClassName?: string;
  /** When provided, replaces the default thumbnail grid with a single custom trigger. */
  trigger?: React.ReactNode;
  /** Slide index to open when the trigger is clicked. Defaults to 0. */
  initialIndex?: number;
  /** Controlled: current index (null = closed). Overrides internal state. */
  openIndex?: number | null;
  onOpenIndexChange?: (idx: number | null) => void;
};

/** Curva de transição padrão do site pra troca de foto (dissolve lento e suave) · usada
 * tanto nos carrosséis inline (fora) quanto na lightbox em tela cheia (dentro). */
export const PHOTO_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE = PHOTO_EASE;

/** Carrossel embutido no próprio card · passa as fotos com setas, arraste (mouse/dedo) ou automaticamente, sem abrir tela cheia. */
export function InlineCarousel({
  items,
  className,
  imgClassName,
  autoPlay = false,
  autoPlayInterval = 5000,
  // Larguras reais do cartão · o padrão anterior dizia "100vw" no celular, e num aparelho
  // de densidade 3x isso faz o navegador pedir ~1170px e escolher o arquivo ORIGINAL.
  // O cartão de quarto tem ~360px em qualquer tamanho de tela: uma coluna no celular,
  // três dentro de 1152px no desktop.
  sizes = "(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw",
}: {
  items: GalleryItem[];
  className?: string;
  imgClassName?: string;
  /** Avança sozinho, em loop, quando não há interação do usuário. */
  autoPlay?: boolean;
  autoPlayInterval?: number;
  /** Largura que a foto ocupa no layout · alimenta o srcset. */
  sizes?: string;
}) {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const touchX = React.useRef<number | null>(null);
  const dragX = React.useRef<number | null>(null);
  const len = items.length;

  const move = React.useCallback(
    (dir: 1 | -1) =>
      setIdx((i) => (autoPlay ? (i + dir + len) % len : Math.max(0, Math.min(len - 1, i + dir)))),
    [autoPlay, len],
  );

  React.useEffect(() => {
    if (!autoPlay || len <= 1 || paused) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % len), autoPlayInterval);
    return () => window.clearInterval(t);
  }, [autoPlay, autoPlayInterval, len, paused]);

  // Aquece a próxima foto pra troca não esperar download · em loop, depois da última
  // vem a primeira, então a vizinha é calculada com resto.
  //
  // Aquece a variante de 960, NUNCA o original. Antes aquecia `it.src`: a <img> mostrava a
  // versão de 480 e o pré-carregamento baixava o arquivo cheio de 400 a 580 KB por trás.
  // Com troca automática a cada 4,5s e quatro cartões de quarto na home, isso passeava pelo
  // catálogo inteiro baixando originais — era a maior fatia dos 4,6 MB de imagem da página.
  React.useEffect(() => {
    if (len <= 1) return;
    const proxima = items[(idx + 1) % len];
    const anterior = items[(idx - 1 + len) % len];
    preloadImage(proxima?.mid ?? proxima?.src ?? "");
    preloadImage(anterior?.mid ?? anterior?.src ?? "");
  }, [idx, items, len]);

  if (len === 0) return null;

  const go = (dir: 1 | -1) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    move(dir);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current !== null) {
      const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
      if (Math.abs(dx) > 40) move(dx > 0 ? -1 : 1);
      touchX.current = null;
    }
    setPaused(false);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (len <= 1) return;
    dragX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    if (Math.abs(dx) > 40) move(dx > 0 ? -1 : 1);
    dragX.current = null;
  };
  const onMouseLeave = () => {
    dragX.current = null;
    setPaused(false);
  };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden touch-pan-y select-none",
        len > 1 && "cursor-grab active:cursor-grabbing",
        className,
      )}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={onMouseLeave}
    >
      {items.map((it, i) => (
        <img
          key={it.src}
          src={it.thumb ?? it.src}
          // Sem o original entre os candidatos · o cartão tem ~360px, então nem em tela de
          // densidade 3x a versão de 960 fica curta. Oferecer o arquivo cheio só dava ao
          // navegador a chance de escolher 400 KB para preencher 360 pixels. É o mesmo
          // critério que o mosaico da home já usa.
          srcSet={it.thumb && it.mid ? `${it.thumb} 480w, ${it.mid} 960w` : undefined}
          sizes={sizes}
          width={it.width}
          height={it.height}
          alt={it.caption}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          aria-hidden={i !== idx}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            i === idx ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      ))}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={go(-1)}
            disabled={!autoPlay && idx === 0}
            aria-label="Foto anterior"
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            disabled={!autoPlay && idx === items.length - 1}
            aria-label="Próxima foto"
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex items-center justify-center gap-1.5">
            {items.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
                  i === idx ? "w-5 bg-white" : "w-1.5 bg-white/60",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Centro da última miniatura pressionada na página.
 *
 * É daqui que a lightbox cresce ao abrir. Um único ouvinte no módulo, e não um por galeria:
 * a página de ambientes tem quatro galerias montadas ao mesmo tempo.
 *
 * Por que `pointerdown` e não o foco do elemento: botão clicado só recebe foco no Chrome e
 * no Firefox. No Safari — logo, em todo iPhone — ele não recebe, e a origem cairia sempre
 * no meio da tela. `pointerdown` acontece em qualquer navegador, antes do clique.
 */
let ultimoToque: { x: number; y: number } | null = null;
if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    (e) => {
      const alvo = (e.target as HTMLElement | null)?.closest?.("button, a");
      if (!alvo) return;
      const r = alvo.getBoundingClientRect();
      if (r.width > 0) ultimoToque = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    { capture: true, passive: true },
  );
}

type LayerState = {
  item: GalleryItem | null;
  /** Arquivo escolhido por `escolherVariante` · é o mesmo que foi decodificado antes. */
  foto: string;
  /** Muda a cada entrada · é o gatilho da animação. Não é key do React de propósito. */
  enterId: number;
  /**
   * `sync` só quando já existe foto na tela.
   *
   * Ao TROCAR de foto o bitmap já está decodificado, então o sync não custa nada e evita o
   * pisca. Na PRIMEIRA abertura ele cai junto com a montagem do diálogo, bem na largada da
   * animação de crescimento — e foi o que produziu um quadro de 52ms no celular.
   */
  decodificacao: "sync" | "async";
};

const EMPTY_LAYER: LayerState = { item: null, foto: "", enterId: 0, decodificacao: "async" };

/**
 * Uma das duas camadas da lightbox.
 *
 * As duas ficam montadas o tempo todo e a troca de foto só escreve na camada inativa.
 * Como a camada nunca remonta, a foto anterior continua visível por baixo enquanto a
 * nova entra — é isso que dá o crossfade de verdade, sem o quadro vazio que aparecia
 * quando cada troca destruía e recriava o slide.
 *
 * A animação é imperativa (useLayoutEffect + estilo direto) em vez de estado do React:
 * assim entra e sai sem render extra, e o duplo requestAnimationFrame garante que o
 * navegador pintou o estado inicial antes de animar.
 */
const Layer = React.memo(function Layer({
  state,
  isActive,
  z,
}: {
  state: LayerState;
  isActive: boolean;
  z: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { item, foto, enterId, decodificacao } = state;
  // Lido dentro do efeito sem entrar nas dependências: só o enterId dispara a animação.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enterId) return;

    // Dissolve puro, sem deslocar a camada. Deslocar deixava uma faixa lateral onde só
    // aparecia o fundo da foto anterior, e essa emenda escura era o "preto piscando na
    // borda". Sem deslocamento a camada cobre o container inteiro do início ao fim.
    el.style.transition = "none";
    el.style.opacity = "0";
    void el.offsetHeight; // reflow: garante que o estado inicial foi pintado

    let raf2 = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      el.style.transition = `opacity 700ms ${EASE}`;
      el.style.opacity = "1";
    };
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(run);
    });
    // Aba oculta não dispara rAF · o timeout garante que a foto apareça mesmo assim.
    const showFallback = window.setTimeout(run, 80);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(showFallback);
    };
  }, [enterId]);

  // Depois que o crossfade termina, apaga a camada que ficou atrás. Ela precisa
  // continuar visível DURANTE a transição (é sobre ela que a nova foto aparece), mas
  // deixá-la acesa pra sempre faria o navegador compor duas telas cheias à toa.
  React.useEffect(() => {
    const el = ref.current;
    if (!el || isActive || !enterId) return;
    const t = window.setTimeout(() => {
      el.style.transition = "none";
      el.style.opacity = "0";
    }, 760);
    return () => window.clearTimeout(t);
  }, [isActive, enterId]);

  if (!item) return null;

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ zIndex: z, opacity: 0, willChange: isActive ? "opacity" : "auto" }}
      role="group"
      aria-roledescription="slide"
      aria-label={item.caption}
      aria-hidden={!isActive}
    >
      {/* A caixa impede que a foto passe da resolução real do arquivo · em monitor grande,
          esticar um original de 1200px deixava tudo borrado. O que sobra ao redor é
          preenchido pelo fundo desfocado, que fica fora deste bloco. */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-2 sm:p-6">
        <img
          src={foto}
          alt={item.caption}
          decoding={decodificacao}
          width={item.width}
          height={item.height}
          style={{ maxWidth: item.width, maxHeight: item.height }}
          className="h-full w-full object-contain select-none"
          draggable={false}
        />
      </div>
    </div>
  );
});

export function GalleryLightbox({ items, className, gridClassName, trigger, initialIndex = 0, openIndex, onOpenIndexChange }: Props) {
  const controlled = openIndex !== undefined;
  const [internalIdx, setInternalIdx] = React.useState<number | null>(null);
  const openIdx = controlled ? (openIndex ?? null) : internalIdx;
  const setOpenIdx = React.useCallback(
    (v: number | null | ((prev: number | null) => number | null)) => {
      if (controlled) {
        const next = typeof v === "function" ? (v as (p: number | null) => number | null)(openIndex ?? null) : v;
        onOpenIndexChange?.(next);
      } else {
        setInternalIdx(v as never);
      }
    },
    [controlled, openIndex, onOpenIndexChange],
  );
  // Trava curta só pra absorver clique repetido · lido/escrito sincronamente, sem
  // closure velha. Antes ela durava toda a animação (700ms), e um clique dado logo
  // depois disso caía no vazio: o visitante clicava e nada acontecia. As duas camadas
  // já lidam com trocas sobrepostas, então segurar o clique por muito tempo era só
  // atrapalhar.
  const lockRef = React.useRef(false);
  const lockTimer = React.useRef(0);
  const unlockSoon = React.useCallback(() => {
    window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      lockRef.current = false;
    }, 260);
  }, []);
  React.useEffect(() => () => window.clearTimeout(lockTimer.current), []);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const open = openIdx !== null;
  const current = open ? items[openIdx!] : null;

  // Duas camadas montadas o tempo todo · trocar de foto escreve na inativa e inverte.
  const [layers, setLayers] = React.useState<[LayerState, LayerState]>([EMPTY_LAYER, EMPTY_LAYER]);
  const [active, setActive] = React.useState<0 | 1>(0);
  const activeRef = React.useRef<0 | 1>(0);
  activeRef.current = active;
  const enterSeq = React.useRef(0);
  const openIdxRef = React.useRef<number | null>(null);
  openIdxRef.current = openIdx;
  const mountedRef = React.useRef(true);
  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Coreografia de abrir e fechar.
   *
   * O centro da miniatura clicada vira a origem da ampliação: a tela cheia cresce de onde o
   * dedo tocou, em vez de nascer no meio da tela sem relação com nada. Escala uniforme de
   * propósito — mapear o retângulo da miniatura ponto a ponto distorceria a foto, porque o
   * tile é deitado e a tela cheia é em pé.
   *
   * O cromo (setas, legenda, filmstrip) entra DEPOIS da foto. Antes era o contrário: o botão
   * de fechar aparecia aos 37ms e a foto aos 47ms — quem clicou pra ver a pousada via botão
   * primeiro.
   */
  const origemRef = React.useRef<{ x: number; y: number } | null>(null);
  /** Marca a primeira foto de cada abertura · zerada no fechamento, não em efeito. */
  const primeiraRef = React.useRef(true);
  const [cromoVisivel, setCromoVisivel] = React.useState(false);
  /** Fica `true` quando a animação de entrada terminou · libera o `will-change`. */
  const [estabilizado, setEstabilizado] = React.useState(false);
  const [saindo, setSaindo] = React.useState(false);
  const timersRef = React.useRef<number[]>([]);
  const limparTimers = React.useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);
  React.useEffect(() => limparTimers, [limparTimers]);

  /** Quem pediu menos movimento recebe só um fade curto, sem crescimento. */
  const semMovimento = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const close = React.useCallback(() => {
    limparTimers();
    // Sair é mais rápido que entrar · esperar pra fechar é o que mais irrita.
    const rapido = semMovimento();
    setCromoVisivel(false);
    setEstabilizado(false);
    primeiraRef.current = true;
    setSaindo(true);
    timersRef.current.push(
      window.setTimeout(() => {
        setSaindo(false);
        // Zera pra próxima abertura medir a miniatura certa · sem isto, abrir a piscina
        // depois das suítes cresceria a partir do lugar do clique anterior.
        origemRef.current = null;
        setOpenIdx(null);
        // Restaura o foco pro elemento que abriu a lightbox (acessibilidade). Adiado de
        // propósito: o diálogo ainda está desmontando e sobrescreveria um focus() imediato.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => triggerRef.current?.focus?.());
        });
        // 300ms e não 380: o diálogo ainda faz o próprio fade de saída depois disto, e a
        // soma passava de meio segundo pra fechar — tempo demais pra uma ação de sair.
      }, rapido ? 120 : 300),
    );
  }, [setOpenIdx, limparTimers]);

  const openAt = React.useCallback(
    (i: number, el?: HTMLElement) => {
      lockRef.current = false;
      if (el) {
        triggerRef.current = el;
        const r = el.getBoundingClientRect();
        origemRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      setSaindo(false);
      setOpenIdx(Math.max(0, Math.min(items.length - 1, i)));
    },
    [items.length, setOpenIdx],
  );

  /**
   * Dispara a coreografia toda vez que a lightbox abre — em qualquer um dos dois modos.
   *
   * Precisa morar aqui, e não no `openAt`: na página de ambientes a galeria roda em modo
   * **controlado**, onde quem abre é o componente de fora e o `openAt` nunca é chamado.
   * Amarrar a animação ao clique deixava a página de ambientes sem coreografia nenhuma.
   *
   * A origem também é recuperada aqui quando não veio do clique: logo após um clique, o
   * botão que abriu ainda é o elemento com foco, então o retângulo dele é o da miniatura.
   */
  React.useEffect(() => {
    if (!open) return;
    if (!origemRef.current) origemRef.current = ultimoToque;
    limparTimers();
    setCromoVisivel(false);
    setEstabilizado(false);
    // 320ms: a foto já cresceu o suficiente pra ser o assunto da tela.
    const t = window.setTimeout(() => setCromoVisivel(true), semMovimento() ? 60 : 320);
    // 520ms: a transição de crescimento (60ms de atraso + 420ms) já acabou · aqui o
    // will-change some, porque manter uma camada de composição de tela cheia reservada
    // pra sempre é justamente o que faz celular com pouca memória descartar camadas.
    const t2 = window.setTimeout(() => setEstabilizado(true), semMovimento() ? 140 : 520);
    timersRef.current.push(t, t2);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [open, limparTimers]);

  // Vira `true` no quadro seguinte à montagem · é o que dá ao navegador um estado inicial
  // pintado (pequeno e transparente) antes de animar. Sem os dois rAF, ele pula direto pro
  // estado final e não há transição nenhuma.
  const [entrou, setEntrou] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setEntrou(false);
      return;
    }
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setEntrou(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [open]);

  const estiloPalco = React.useMemo<React.CSSProperties>(() => {
    // `will-change` é dica pontual, não atributo permanente: vale durante a animação e sai
    // quando ela acaba.
    const willChange = estabilizado && !saindo ? "auto" : "transform";
    if (semMovimento()) {
      return { opacity: saindo || !entrou ? 0 : 1, transition: "opacity 120ms linear", willChange };
    }
    // Lê o módulo direto, e não só o ref: no primeiro render o efeito ainda não rodou, e
    // uma origem que muda no meio da transição faz a foto dar um salto.
    const o = origemRef.current ?? ultimoToque;
    return {
      // A origem é o centro da miniatura tocada: a foto cresce de onde a pessoa tocou.
      transformOrigin: o ? `${o.x}px ${o.y}px` : "50% 50%",
      transform: `scale(${saindo ? 0.96 : entrou ? 1 : 0.9})`,
      opacity: saindo || !entrou ? 0 : 1,
      willChange,
      transition: saindo
        ? `transform 300ms ${EASE} 60ms, opacity 260ms ${EASE} 60ms`
        : `transform 420ms ${EASE} 60ms, opacity 300ms ${EASE} 60ms`,
    };
    // `open` entra nas dependências porque, sem ele, o estilo calculado com a galeria
    // fechada (quando ainda não havia miniatura tocada) era reaproveitado no primeiro
    // quadro da abertura — e a origem mudava no meio da transição, dando um salto.
  }, [entrou, saindo, open, estabilizado]);

  /** Classe do cromo · entra depois da foto e sai antes dela. */
  const classeCromo = cromoVisivel
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-1 pointer-events-none";

  const navigate = React.useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current) return;
      const cur = openIdxRef.current;
      if (cur === null) return;
      // Em loop: da última foto volta pra primeira. Antes as setas ficavam desabilitadas
      // nas pontas, e quem clicava não entendia por que nada acontecia.
      const next = (cur + dir + items.length) % items.length;
      if (next === cur) return;
      // Efeitos colaterais fora do updater · o setState recebe só um valor puro.
      lockRef.current = true;
      unlockSoon();
      setOpenIdx(next);
    },
    [items.length, setOpenIdx, unlockSoon],
  );

  const goPrev = React.useCallback(() => navigate(-1), [navigate]);
  const goNext = React.useCallback(() => navigate(1), [navigate]);

  // Enquanto a foto não pintou · vira spinner depois de um tempinho (ver abaixo).
  const [carregando, setCarregando] = React.useState(false);

  // Orquestra abrir e navegar: espera o bitmap ficar pronto e só então troca de camada.
  // É o que tira o download e a decodificação do frame do clique.
  React.useEffect(() => {
    if (openIdx === null) {
      // Fechou: limpa as camadas pra soltar o bitmap grande da memória e pra próxima
      // abertura não fazer crossfade a partir da foto antiga.
      setLayers([EMPTY_LAYER, EMPTY_LAYER]);
      setCarregando(false);
      lockRef.current = false;
      return;
    }
    const item = items[openIdx];
    if (!item) return;

    // A variante é escolhida aqui, no cliente, e é a MESMA que a camada vai pintar. Se o
    // JS decodificasse um arquivo e a <img> pedisse outro (via srcset), a espera teria
    // sido em vão e o crossfade voltaria a acontecer com a foto ainda baixando.
    const foto = escolherVariante(item);
    let cancelled = false;
    // O spinner só entra em cena se a foto realmente demorar · em cache quente ele nunca
    // chega a piscar, que é o comportamento certo.
    const aviso = window.setTimeout(() => {
      if (!cancelled) setCarregando(true);
    }, 250);

    void (async () => {
      await decodeImage(foto);
      if (cancelled || !mountedRef.current) return;
      window.clearTimeout(aviso);
      setCarregando(false);
      const incoming: 0 | 1 = activeRef.current === 0 ? 1 : 0;
      const id = ++enterSeq.current;
      // Primeira foto da sessão não decodifica de forma síncrona · ver LayerState.
      const ehPrimeira = primeiraRef.current;
      primeiraRef.current = false;
      setLayers((prev) => {
        const next: [LayerState, LayerState] = [prev[0], prev[1]];
        next[incoming] = { item, foto, enterId: id, decodificacao: ehPrimeira ? "async" : "sync" };
        return next;
      });
      setActive(incoming);
      // As vizinhas são aquecidas na mesma variante · aquecer o original enquanto a tela
      // mostra a de 960 seria baixar duas vezes a mesma foto.
      preloadNeighbors(items.map(escolherVariante), openIdx);
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(aviso);
    };
  }, [openIdx, items]);

  // A legenda acompanha a camada visível, então troca junto com o crossfade.
  const shownItem = layers[active].item ?? current;

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext, close]);

  // Arraste que acompanha o dedo. Antes era corte seco: passou de 50px, trocava a foto de
  // uma vez. Aqui a foto anda junto com o dedo e volta pro lugar se o gesto não completar
  // — é a diferença entre parecer um site e parecer um aplicativo. Só `transform` e
  // `opacity`, que o navegador anima na GPU sem recalcular layout.
  const palcoRef = React.useRef<HTMLDivElement>(null);
  const toqueX = React.useRef<number | null>(null);
  const toqueY = React.useRef(0);
  const arrastando = React.useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    toqueX.current = e.touches[0]?.clientX ?? null;
    toqueY.current = e.touches[0]?.clientY ?? 0;
    arrastando.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (toqueX.current === null || items.length < 2) return;
    const dx = (e.touches[0]?.clientX ?? toqueX.current) - toqueX.current;
    const dy = (e.touches[0]?.clientY ?? toqueY.current) - toqueY.current;
    // Só assume o gesto quando ficar claro que é horizontal · assim um deslize vertical
    // (fechar a barra do navegador, por exemplo) não faz a foto tremer de lado.
    if (!arrastando.current) {
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy)) return;
      arrastando.current = true;
    }
    const el = palcoRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.transform = `translate3d(${dx}px, 0, 0)`;
    el.style.opacity = String(Math.max(0.55, 1 - Math.abs(dx) / 900));
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (toqueX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? toqueX.current) - toqueX.current;
    toqueX.current = null;
    if (!arrastando.current) return;
    arrastando.current = false;

    const el = palcoRef.current;
    if (el) {
      el.style.transition = `transform 320ms ${EASE}, opacity 320ms ${EASE}`;
      el.style.transform = "translate3d(0, 0, 0)";
      el.style.opacity = "1";
    }
    // 15% da largura da tela: perto o bastante pra ser fácil, longe o bastante pra não
    // trocar de foto por acidente ao encostar o dedo.
    if (Math.abs(dx) > window.innerWidth * 0.15) (dx > 0 ? goPrev : goNext)();
  };

  return (
    <>
      {controlled && !trigger ? null : trigger ? (
        <span
          onClick={(e) => openAt(initialIndex, e.currentTarget as HTMLElement)}
          className={cn("block", className)}
        >
          {trigger}
        </span>
      ) : (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", gridClassName, className)}>
          {items.map((g, i) => (
            <button
              type="button"
              key={g.caption}
              onClick={(e) => openAt(i, e.currentTarget as HTMLElement)}
              className="group relative overflow-hidden rounded-2xl bg-card aspect-video text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Abrir imagem: ${g.caption}`}
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                decoding="async"
                style={g.focus ? { objectPosition: g.focus } : undefined}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4">
                <div className="text-white text-sm font-semibold tracking-wide">{g.caption}</div>
                <p className="mt-1 text-xs text-white/85 leading-snug">{g.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* `open || saindo` mantém o diálogo montado durante a saída · sem isso o React
          desmonta tudo no clique e a animação de fechamento nunca chega a rodar. */}
      <Dialog open={open || saindo} onOpenChange={(o) => !o && !saindo && close()}>
        <DialogContent
          // O véu padrão do diálogo fica transparente porque este conteúdo já cobre a tela
          // inteira com fundo opaco: pintar e animar um segundo preto por baixo era
          // trabalho de composição que ninguém via.
          overlayClassName="bg-transparent"
          // As variáveis de escala neutralizam o zoom-in-95 padrão do Dialog só aqui:
          // escalar um container de tela cheia na abertura é caro e dava um estalo. O
          // crescimento a partir da miniatura acontece no palco, logo abaixo.
          className="!max-w-none w-screen h-[100dvh] sm:h-screen p-0 border-0 bg-black sm:rounded-none overflow-hidden top-0 left-0 translate-x-0 translate-y-0 [&>button]:hidden z-[100] [--tw-enter-scale:1] [--tw-exit-scale:1] duration-200"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%), url(${lightboxBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <DialogTitle className="sr-only">{current?.caption ?? "Galeria"}</DialogTitle>
          <DialogDescription className="sr-only">{current?.desc ?? ""}</DialogDescription>

          {current && (
            <div
              className="relative w-screen h-[100dvh] sm:h-screen overflow-hidden"
              role="region"
              aria-roledescription="carrossel"
              aria-label="Galeria de ambientes"
            >
              {/* Fundo desfocado · preenche as bordas que o `object-contain` deixa vazias.
                  Fica FORA do palco de propósito: escalar um elemento com desfoque obriga o
                  navegador a refazer o borrão a cada quadro, e era isso que travava a
                  abertura no celular. Aqui ele é rasterizado uma vez e só. Também é o certo
                  visualmente — cenário não dá zoom junto com o assunto.
                  Usa a miniatura (480w) porque vai ser borrado de qualquer jeito. */}
              {shownItem && (
                <img
                  aria-hidden
                  alt=""
                  src={shownItem.thumb ?? shownItem.src}
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full scale-110 select-none object-cover opacity-50 blur-xl"
                />
              )}

              {/* Palco · é este bloco que anda com o dedo E que cresce a partir da
                  miniatura na abertura. As setas e a legenda ficam de fora dele de
                  propósito: controle que escorrega junto com a foto some da tela no meio
                  do gesto. */}
              <div
                ref={palcoRef}
                className="absolute inset-0"
                style={estiloPalco}
              >
                <Layer state={layers[0]} isActive={active === 0} z={active === 0 ? 2 : 1} />
                <Layer state={layers[1]} isActive={active === 1} z={active === 1 ? 2 : 1} />
              </div>

              {/* Enquanto a foto grande não pinta · aparece só se demorar mais de 250ms.
                  Antes disso a tela ficava preta e sem explicação em conexão ruim. */}
              {carregando && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  <div
                    role="status"
                    aria-label="Carregando foto"
                    className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white/90"
                  />
                </div>
              )}

              {/* Close */}
              <button
                type="button"
                onClick={close}
                aria-label="Fechar galeria"
                className={cn(
                  "absolute top-4 right-4 z-20 inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  "transition-all duration-200 ease-out",
                  classeCromo,
                )}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Setas · nunca desabilitadas, porque a navegação é em loop. Com uma foto
                  só elas nem existem, em vez de ficarem ali apagadas sem função. */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Foto anterior"
                    className={cn(
                      "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      "transition-all duration-200 ease-out",
                      cromoVisivel ? "opacity-100" : "opacity-0 pointer-events-none",
                    )}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Próxima foto"
                    className={cn(
                      "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      "transition-all duration-200 ease-out",
                      cromoVisivel ? "opacity-100" : "opacity-0 pointer-events-none",
                    )}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Legenda · bloco contido em vez da faixa preta de ponta a ponta que
                  existia antes. Somada à vinheta da camada, aquela faixa lavava a base da
                  foto de preto; aqui o escuro fica só atrás do texto, onde é necessário
                  pra leitura. */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-4 pb-5 sm:pb-6",
                  // A legenda entra um pouco antes das setas (240ms contra 200ms) e sobe
                  // 4px · é o que dá a sensação de camadas em vez de tudo de uma vez.
                  "transition-all duration-[240ms] ease-out",
                  classeCromo,
                )}
              >
                <div className="max-w-3xl rounded-2xl bg-black/45 px-5 py-2.5 text-center text-white backdrop-blur-md ring-1 ring-white/10">
                  <div className="text-base font-semibold sm:text-lg">{shownItem?.caption}</div>
                  <p className="mt-0.5 text-sm text-white/85">{shownItem?.desc}</p>
                  {items.length > 1 && (
                    <div className="mt-2.5 flex items-center justify-center gap-2">
                      {items.length <= 10 && (
                        <div className="flex items-center gap-1.5">
                          {items.map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                i === openIdx ? "w-5 bg-white" : "w-1.5 bg-white/40",
                              )}
                            />
                          ))}
                        </div>
                      )}
                      {/* Contador sempre presente · os pontinhos mostram onde ele está,
                          mas não dizem quantas faltam. */}
                      <span className="text-xs tabular-nums text-white/70">
                        {(openIdx ?? 0) + 1} / {items.length}
                      </span>
                      <span className="sr-only" aria-live="polite" aria-atomic="true">
                        Foto {(openIdx ?? 0) + 1} de {items.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tira de miniaturas · só no desktop, onde sobra altura. No celular ela
                    roubaria espaço justamente da foto, que é o que interessa. */}
                {items.length > 1 && (
                  <div className="pointer-events-auto hidden max-w-full gap-2 overflow-x-auto rounded-xl bg-black/35 p-2 backdrop-blur-md ring-1 ring-white/10 md:flex">
                    {items.map((it, i) => (
                      <button
                        key={it.caption}
                        type="button"
                        onClick={() => openAt(i)}
                        aria-label={`Ver foto ${i + 1}: ${it.caption}`}
                        aria-current={i === openIdx}
                        className={cn(
                          "relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                          i === openIdx
                            ? "ring-2 ring-white"
                            : "opacity-55 ring-1 ring-white/15 hover:opacity-100",
                        )}
                      >
                        <img
                          src={it.thumb ?? it.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          style={it.focus ? { objectPosition: it.focus } : undefined}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
