import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import poster from "@/assets/paraiso-poster.jpg.asset.json";
import video from "@/assets/video-paraiso.mp4.asset.json";

export function ImmersiveVideoSection() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [open]);

  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary/80 font-medium">
            Experiência em vídeo
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            Um respiro entre a Bahia e o mar.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Aperte play e veja o ritmo da pousada antes mesmo de chegar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Assistir vídeo da Pousada Ilha do Meio"
          className="group relative block w-full overflow-hidden rounded-2xl ring-1 ring-border/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
            <img
              src={poster.url}
              alt="Pousada Ilha do Meio — prévia em vídeo"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/20 to-black/45" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-white/95 text-primary shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                <Play className="relative h-8 w-8 sm:h-10 sm:w-10 fill-current ml-1" />
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <p className="text-[11px] tracking-[0.3em] uppercase text-white/80 font-medium">
                Tour cinematográfico
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl text-white max-w-xl">
                Da recepção ao quiosque à beira da piscina.
              </p>
            </div>
          </div>
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Fechar vídeo"
            className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <video
            ref={videoRef}
            src={video.url}
            poster={poster.url}
            controls
            playsInline
            preload="metadata"
            onClick={(e) => e.stopPropagation()}
            onEnded={() => setOpen(false)}
            className="max-h-[92vh] max-w-[96vw] sm:max-w-[min(540px,96vw)] rounded-xl shadow-2xl bg-black"
          />
        </div>
      )}
    </section>
  );
}
