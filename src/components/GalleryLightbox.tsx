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
};

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
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
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
  React.useEffect(() => {
    if (len <= 1) return;
    preloadImage(items[(idx + 1) % len]?.src ?? "");
    preloadImage(items[(idx - 1 + len) % len]?.src ?? "");
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
          srcSet={it.thumb && it.mid ? `${it.thumb} 480w, ${it.mid} 960w, ${it.src} 1600w` : undefined}
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

type LayerState = {
  item: GalleryItem | null;
  /** Muda a cada entrada · é o gatilho da animação. Não é key do React de propósito. */
  enterId: number;
};

const EMPTY_LAYER: LayerState = { item: null, enterId: 0 };

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
  const { item, enterId } = state;
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
  // O fundo é desfocado de qualquer forma, então usa a miniatura: economiza baixar e
  // decodificar a foto inteira só pra borrar, que era caro em celular mais fraco.
  const bgSrc = item.thumb ?? item.src;

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
      {/* Fundo desfocado: preenche a tela sem depender de nitidez, cobre as bordas do object-contain */}
      <img
        aria-hidden
        src={bgSrc}
        alt=""
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50 select-none"
        draggable={false}
      />
      {/* Foto principal: nunca estica além da resolução real (sem perda de nitidez).
          decoding="sync" porque o bitmap já foi decodificado antes da troca — isso evita
          o navegador adiar a pintura pro frame seguinte, que é onde nascia o pisca. */}
      <img
        src={item.src}
        alt={item.caption}
        decoding="sync"
        width={item.width}
        height={item.height}
        className="relative z-10 w-full h-full object-contain select-none"
        draggable={false}
      />
      {/* subtle vignette so controls/caption stay legible */}
      <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
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
  const isFirst = openIdx === 0;
  const isLast = openIdx === items.length - 1;

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

  const close = React.useCallback(() => {
    setOpenIdx(null);
    // Restaura o foco pro elemento que abriu a lightbox (acessibilidade). Adiado de
    // propósito: o diálogo ainda está desmontando e sobrescreveria um focus() imediato.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => triggerRef.current?.focus?.());
    });
  }, [setOpenIdx]);

  const openAt = React.useCallback(
    (i: number, el?: HTMLElement) => {
      lockRef.current = false;
      if (el) triggerRef.current = el;
      setOpenIdx(Math.max(0, Math.min(items.length - 1, i)));
    },
    [items.length, setOpenIdx],
  );

  const navigate = React.useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current) return;
      const cur = openIdxRef.current;
      if (cur === null) return;
      const next = cur + dir;
      if (next < 0 || next > items.length - 1) return;
      // Efeitos colaterais fora do updater · o setState recebe só um valor puro.
      lockRef.current = true;
      unlockSoon();
      setOpenIdx(next);
    },
    [items.length, setOpenIdx, unlockSoon],
  );

  const goPrev = React.useCallback(() => navigate(-1), [navigate]);
  const goNext = React.useCallback(() => navigate(1), [navigate]);

  const srcs = React.useMemo(() => items.map((i) => i.src), [items]);

  // Orquestra abrir e navegar: espera o bitmap ficar pronto e só então troca de camada.
  // É o que tira o download e a decodificação do frame do clique.
  React.useEffect(() => {
    if (openIdx === null) {
      // Fechou: limpa as camadas pra soltar o bitmap grande da memória e pra próxima
      // abertura não fazer crossfade a partir da foto antiga.
      setLayers([EMPTY_LAYER, EMPTY_LAYER]);
      lockRef.current = false;
      return;
    }
    const item = items[openIdx];
    if (!item) return;

    let cancelled = false;
    void (async () => {
      await decodeImage(item.src);
      if (cancelled || !mountedRef.current) return;
      const incoming: 0 | 1 = activeRef.current === 0 ? 1 : 0;
      const id = ++enterSeq.current;
      setLayers((prev) => {
        const next: [LayerState, LayerState] = [prev[0], prev[1]];
        next[incoming] = { item, enterId: id };
        return next;
      });
      setActive(incoming);
      preloadNeighbors(srcs, openIdx);
    })();

    return () => {
      cancelled = true;
    };
  }, [openIdx, items, srcs]);

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

  // Swipe
  const touchX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (Math.abs(dx) > 50) (dx > 0 ? goPrev : goNext)();
    touchX.current = null;
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

      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent
          // As variáveis de escala neutralizam o zoom-in-95 padrão do Dialog só aqui:
          // escalar um container de tela cheia na abertura é caro e dava um estalo.
          // Fica só o fade, que roda na GPU.
          className="!max-w-none w-screen h-[100dvh] sm:h-screen p-0 border-0 bg-black sm:rounded-none overflow-hidden top-0 left-0 translate-x-0 translate-y-0 [&>button]:hidden z-[100] [--tw-enter-scale:1] [--tw-exit-scale:1] duration-300"
          onTouchStart={onTouchStart}
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
              <Layer state={layers[0]} isActive={active === 0} z={active === 0 ? 2 : 1} />
              <Layer state={layers[1]} isActive={active === 1} z={active === 1 ? 2 : 1} />

              {/* Close */}
              <button
                type="button"
                onClick={close}
                aria-label="Fechar galeria"
                className="absolute top-4 right-4 z-20 inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Prev */}
              <button
                type="button"
                onClick={goPrev}
                disabled={isFirst}
                aria-label="Slide anterior"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={goNext}
                disabled={isLast}
                aria-label="Próximo slide"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="text-base sm:text-lg font-semibold">{shownItem?.caption}</div>
                  <p className="mt-1 text-sm text-white/90">{shownItem?.desc}</p>
                  {items.length > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                      {items.length <= 10 ? (
                        items.map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-300",
                              i === openIdx ? "w-5 bg-white" : "w-1.5 bg-white/40",
                            )}
                          />
                        ))
                      ) : (
                        <span className="text-xs text-white/60 tabular-nums">
                          {(openIdx ?? 0) + 1} / {items.length}
                        </span>
                      )}
                      <span className="sr-only" aria-live="polite" aria-atomic="true">
                        Slide {(openIdx ?? 0) + 1} de {items.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
