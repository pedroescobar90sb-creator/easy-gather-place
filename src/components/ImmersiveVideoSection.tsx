import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import poster from "@/assets/paraiso-poster.jpg.asset.json";
import video from "@/assets/video-paraiso.mp4.asset.json";

export function ImmersiveVideoSection() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!open) {
      setRevealed(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    // Premium cinematic delay before the video reveals
    const t = window.setTimeout(() => {
      setRevealed(true);
      videoRef.current?.play().catch(() => {});
    }, 450);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open]);

  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl">
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

        <div className="grid gap-10 md:grid-cols-[auto,1fr] md:items-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Assistir vídeo da Pousada Ilha do Meio"
            className="group relative block mx-auto md:mx-0 w-full max-w-[300px] sm:max-w-[340px] overflow-hidden rounded-2xl ring-1 ring-border/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="relative aspect-[9/16] w-full bg-black">
              <img
                src={poster.url}
                alt="Pousada Ilha do Meio — prévia em vídeo"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-white/95 text-primary shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                  <Play className="relative h-8 w-8 sm:h-10 sm:w-10 fill-current ml-1" />
                </span>
              </div>
            </div>
          </button>

          <div className="text-center md:text-left md:pl-4">
            <p className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
              Da recepção à beira da piscina
            </p>
            <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto md:mx-0">
              Um passeio cinematográfico pelos ambientes da pousada — em menos de um minuto.
            </p>
          </div>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-500"
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
            preload="auto"
            onClick={(e) => e.stopPropagation()}
            onEnded={() => setOpen(false)}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "scale(1)" : "scale(0.97)",
              transition: "opacity 700ms ease-out, transform 700ms ease-out",
            }}
            className="max-h-[92vh] max-w-[96vw] sm:max-w-[min(480px,96vw)] rounded-xl shadow-2xl bg-black object-contain"
          />
        </div>
      )}
    </section>
  );
}
