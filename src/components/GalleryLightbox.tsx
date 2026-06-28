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

export function GalleryLightbox({ items, className, gridClassName }: Props) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const open = openIdx !== null;
  const current = open ? items[openIdx!] : null;

  const close = React.useCallback(() => setOpenIdx(null), []);
  const prev = React.useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = React.useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  // Swipe handling
  const touchX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
    touchX.current = null;
  };

  return (
    <>
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", gridClassName, className)}>
        {items.map((g, i) => (
          <button
            type="button"
            key={g.caption}
            onClick={() => setOpenIdx(i)}
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
          className="max-w-[100vw] sm:max-w-6xl w-full p-0 border-0 bg-black/95 sm:rounded-2xl overflow-hidden [&>button]:hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <DialogTitle className="sr-only">{current?.caption ?? "Galeria"}</DialogTitle>
          <DialogDescription className="sr-only">{current?.desc ?? ""}</DialogDescription>

          {current && (
            <div className="relative flex flex-col items-center justify-center w-full h-[100dvh] sm:h-[85vh]">
              <img
                src={current.src}
                alt={current.caption}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />

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
                onClick={prev}
                aria-label="Imagem anterior"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={next}
                aria-label="Próxima imagem"
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
