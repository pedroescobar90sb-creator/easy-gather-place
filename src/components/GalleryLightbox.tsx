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
  /** Slide index to open when the trigger is clicked. Defaults to 0. */
  initialIndex?: number;
  /** Controlled: current index (null = closed). Overrides internal state. */
  openIndex?: number | null;
  onOpenIndexChange?: (idx: number | null) => void;
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

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
  const [entered, setEntered] = React.useState(false);
  const [slideDir, setSlideDir] = React.useState<1 | -1>(1);
  const [slideKey, setSlideKey] = React.useState(0);
  const [transitioning, setTransitioning] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const open = openIdx !== null;
  const current = open ? items[openIdx!] : null;

  const close = React.useCallback(() => {
    setEntered(false);
    window.setTimeout(() => {
      setOpenIdx(null);
      // Restore focus to the element that opened the lightbox
      triggerRef.current?.focus?.();
    }, 200);
  }, [setOpenIdx]);

  // Premium lateral transition: fade-out current, swap, fade-in next with subtle slide.
  const navigate = React.useCallback(
    (dir: 1 | -1) => {
      if (transitioning) return;
      setOpenIdx((i) => {
        if (i === null) return i;
        const next = i + dir;
        if (next < 0) return i;
        if (next > items.length - 1) {
          setEntered(false);
          window.setTimeout(() => setOpenIdx(null), 200);
          return i;
        }
        setTransitioning(true);
        setSlideDir(dir);
        setEntered(false);
        window.setTimeout(() => {
          setOpenIdx(next);
          setSlideKey((k) => k + 1);
          window.setTimeout(() => {
            setEntered(true);
            setTransitioning(false);
          }, 40);
        }, 180);
        return i;
      });
    },
    [items.length, transitioning, setOpenIdx],
  );

  const goPrev = React.useCallback(() => navigate(-1), [navigate]);
  const goNext = React.useCallback(() => navigate(1), [navigate]);

  // Entrance animation on open
  React.useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setEntered(true), 30);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

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
          onClick={(e) => {
            triggerRef.current = e.currentTarget as HTMLElement;
            setSlideDir(1);
            setSlideKey((k) => k + 1);
            setOpenIdx(Math.max(0, Math.min(items.length - 1, initialIndex)));
          }}
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
              onClick={(e) => {
                triggerRef.current = e.currentTarget as HTMLElement;
                setSlideDir(1);
                setSlideKey((k) => k + 1);
                setOpenIdx(i);
              }}
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
            <div
              className="relative w-screen h-[100dvh] sm:h-screen overflow-hidden"
              role="region"
              aria-roledescription="carrossel"
              aria-label="Galeria de ambientes"
            >
              <div
                key={slideKey}
                className="absolute inset-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`${current.caption} — slide ${(openIdx ?? 0) + 1} de ${items.length}`}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered
                    ? "translate3d(0,0,0)"
                    : `translate3d(${slideDir * 40}px,0,0)`,
                  transition: `opacity 380ms ${EASE}, transform 520ms ${EASE}`,
                  willChange: "opacity, transform",
                }}
              >
                <img
                  src={current.src}
                  alt={current.caption}
                  className="relative z-10 w-full h-full object-contain select-none"
                  draggable={false}
                />
                <div aria-hidden className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
              </div>

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
                disabled={openIdx === 0}
                aria-label="Slide anterior"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={goNext}
                aria-label={openIdx === items.length - 1 ? "Concluir galeria" : "Próximo slide"}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-black/70 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="text-base sm:text-lg font-semibold">{current.caption}</div>
                  <p className="mt-1 text-sm text-white/90">{current.desc}</p>
                  <div className="mt-2 text-xs text-white/70 tabular-nums" aria-live="polite" aria-atomic="true">
                    Slide {(openIdx ?? 0) + 1} de {items.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
