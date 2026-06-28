import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryItem = { src: string; caption: string; desc: string };

type Props = {
  items: GalleryItem[];
  className?: string;
  gridClassName?: string;
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function GalleryLightbox({ items, className, gridClassName }: Props) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const [entered, setEntered] = React.useState(false);
  const [slideDir, setSlideDir] = React.useState<1 | -1>(1);
  const [slideKey, setSlideKey] = React.useState(0);
  const open = openIdx !== null;
  const current = open ? items[openIdx!] : null;

  const close = React.useCallback(() => {
    setEntered(false);
    // brief delay for fade-out feel before unmount
    window.setTimeout(() => setOpenIdx(null), 200);
  }, []);

  const goPrev = React.useCallback(() => {
    setOpenIdx((i) => {
      if (i === null) return i;
      if (i === 0) return i; // do nothing at first
      setSlideDir(-1);
      setSlideKey((k) => k + 1);
      return i - 1;
    });
  }, []);

  const goNext = React.useCallback(() => {
    setOpenIdx((i) => {
      if (i === null) return i;
      if (i >= items.length - 1) {
        // auto-close after last
        setEntered(false);
        window.setTimeout(() => setOpenIdx(null), 250);
        return i;
      }
      setSlideDir(1);
      setSlideKey((k) => k + 1);
      return i + 1;
    });
  }, [items.length]);

  // Entrance animation
  React.useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setEntered(true), 20);
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
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", gridClassName, className)}>
        {items.map((g, i) => (
          <button
            type="button"
            key={g.caption}
            onClick={() => {
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

      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent
          className="max-w-[100vw] sm:max-w-6xl w-full p-0 border-0 bg-transparent shadow-none sm:rounded-2xl overflow-hidden [&>button]:hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <DialogTitle className="sr-only">{current?.caption ?? "Galeria"}</DialogTitle>
          <DialogDescription className="sr-only">{current?.desc ?? ""}</DialogDescription>

          {/* Backdrop with fade */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black"
            style={{
              opacity: entered ? 0.96 : 0,
              transition: `opacity 300ms ${EASE}`,
            }}
          />

          {current && (
            <div className="relative flex flex-col items-center justify-center w-full h-[100dvh] sm:h-[85vh]">
              <div
                key={slideKey}
                className="relative flex items-center justify-center w-full h-full"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateX(0) scale(1)" : `translateX(${slideDir * 24}px) scale(0.96)`,
                  transition: `opacity 400ms ${EASE} 150ms, transform 400ms ${EASE} 150ms`,
                  willChange: "opacity, transform",
                }}
              >
                <img
                  src={current.src}
                  alt={current.caption}
                  className="max-h-full max-w-full object-contain select-none"
                  draggable={false}
                />
              </div>

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
                disabled={openIdx === 0}
                aria-label="Imagem anterior"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={goNext}
                aria-label={openIdx === items.length - 1 ? "Concluir galeria" : "Próxima imagem"}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="text-base sm:text-lg font-semibold">{current.caption}</div>
                  <p className="mt-1 text-sm text-white/80">{current.desc}</p>
                  <div className="mt-2 text-xs text-white/60 tabular-nums">
                    {(openIdx ?? 0) + 1} / {items.length}
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
