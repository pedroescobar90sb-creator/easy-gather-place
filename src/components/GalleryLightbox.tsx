import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryItem = { src: string; caption: string; desc: string };

type Props = {
  items: GalleryItem[];
  className?: string;
  gridClassName?: string;
  /** When provided, replaces the default thumbnail grid with a single custom trigger. */
  trigger?: React.ReactNode;
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Carrossel embutido no próprio card — passa as fotos com setas, sem abrir tela cheia. */
export function InlineCarousel({
  items,
  className,
  imgClassName,
}: {
  items: GalleryItem[];
  className?: string;
  imgClassName?: string;
}) {
  const [idx, setIdx] = React.useState(0);
  if (items.length === 0) return null;

  const go = (dir: 1 | -1) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => Math.max(0, Math.min(items.length - 1, i + dir)));
  };

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <img
        src={items[idx].src}
        alt={items[idx].caption}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={go(-1)}
            disabled={idx === 0}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/70 transition disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            disabled={idx === items.length - 1}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/70 transition disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1">
            {items.map((_, i) => (
              <span
                key={i}
                className={cn("h-1 rounded-full transition-all duration-300", i === idx ? "w-4 bg-white" : "w-1 bg-white/50")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Um slide da lightbox. Remonta a cada troca de foto (key=index) — o duplo rAF
 * garante que o navegador pinte o estado "não entrado" antes de animar pro estado final,
 * então a transição sempre dispara de verdade, sem depender de timeout adivinhado. */
function Slide({
  item,
  dir,
  onSettled,
}: {
  item: GalleryItem;
  dir: 1 | -1;
  onSettled: () => void;
}) {
  const [shown, setShown] = React.useState(false);
  const settledRef = React.useRef(false);
  const fireSettled = React.useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    onSettled();
  }, [onSettled]);

  React.useEffect(() => {
    let raf2 = 0;
    let shownFlag = false;
    const show = () => {
      if (shownFlag) return;
      shownFlag = true;
      setShown(true);
    };
    // Caminho normal: 2 frames de animação garantem que o navegador pintou o estado
    // inicial antes de animar. Rede de segurança: se a aba estiver oculta/sem foco
    // (rAF não dispara nesse caso), o timeout garante que a foto apareça mesmo assim.
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(show);
    });
    const showFallback = window.setTimeout(show, 80);
    // Rede de segurança pra travar a navegação: se transitionend nunca disparar
    // (mesmo cenário de aba oculta), libera de qualquer jeito depois do tempo da animação.
    const settleFallback = window.setTimeout(fireSettled, 700);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(showFallback);
      window.clearTimeout(settleFallback);
    };
  }, [fireSettled]);

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateX(0) scale(1)" : `translateX(${dir * 56}px) scale(1.02)`,
        filter: shown ? "blur(0px)" : "blur(4px)",
        transition: `opacity 480ms ${EASE}, transform 480ms ${EASE}, filter 480ms ${EASE}`,
        willChange: "opacity, transform",
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === "transform") fireSettled();
      }}
    >
      {/* Fundo desfocado: preenche a tela sem depender de nitidez, cobre as bordas do object-contain */}
      <img
        aria-hidden
        src={item.src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50 select-none"
        draggable={false}
      />
      {/* Foto principal: nunca estica além da resolução real (sem perda de nitidez) */}
      <img src={item.src} alt={item.caption} className="relative z-10 w-full h-full object-contain select-none" draggable={false} />
      {/* subtle vignette so controls/caption stay legible */}
      <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}

export function GalleryLightbox({ items, className, gridClassName, trigger }: Props) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const [slideDir, setSlideDir] = React.useState<1 | -1>(1);
  // Ref (não state) pra travar navegação — lido/escrito sincronamente, sem closure velha.
  const lockRef = React.useRef(false);
  const open = openIdx !== null;
  const current = open ? items[openIdx!] : null;
  const isFirst = openIdx === 0;
  const isLast = openIdx === items.length - 1;

  const close = React.useCallback(() => setOpenIdx(null), []);

  const openAt = React.useCallback((i: number) => {
    lockRef.current = false;
    setSlideDir(1);
    setOpenIdx(i);
  }, []);

  const navigate = React.useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current) return;
      setOpenIdx((i) => {
        if (i === null) return i;
        const next = i + dir;
        if (next < 0 || next > items.length - 1) return i;
        lockRef.current = true;
        setSlideDir(dir);
        return next;
      });
    },
    [items.length],
  );

  const goPrev = React.useCallback(() => navigate(-1), [navigate]);
  const goNext = React.useCallback(() => navigate(1), [navigate]);

  // Libera a trava só quando a animação de fato termina (transitionend real, não timeout adivinhado).
  const handleSlideSettled = React.useCallback(() => {
    lockRef.current = false;
  }, []);

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
      {trigger ? (
        <span onClick={() => openAt(0)} className={cn("block", className)}>
          {trigger}
        </span>
      ) : (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", gridClassName, className)}>
          {items.map((g, i) => (
            <button
              type="button"
              key={g.caption}
              onClick={() => openAt(i)}
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
          className="!max-w-none w-screen h-[100dvh] sm:h-screen p-0 border-0 bg-black sm:rounded-none overflow-hidden top-0 left-0 translate-x-0 translate-y-0 [&>button]:hidden z-[100]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <DialogTitle className="sr-only">{current?.caption ?? "Galeria"}</DialogTitle>
          <DialogDescription className="sr-only">{current?.desc ?? ""}</DialogDescription>

          {current && (
            <div className="relative w-screen h-[100dvh] sm:h-screen overflow-hidden">
              <Slide key={openIdx} item={current} dir={slideDir} onSettled={handleSlideSettled} />

              {/* Close */}
              <button
                type="button"
                onClick={close}
                aria-label="Fechar imagem"
                className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Prev */}
              <button
                type="button"
                onClick={goPrev}
                disabled={isFirst}
                aria-label="Imagem anterior"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={goNext}
                disabled={isLast}
                aria-label="Próxima imagem"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="text-base sm:text-lg font-semibold">{current.caption}</div>
                  <p className="mt-1 text-sm text-white/80">{current.desc}</p>
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
