import { useEffect, useRef, useState } from "react";
import { Play, ChevronLeft } from "lucide-react";

import poster from "@/assets/paraiso-poster.jpg.asset.json";
import video from "@/assets/video-paraiso.mp4.asset.json";
import bgDesktop from "@/assets/piscina-bg-desktop.jpg.asset.json";
import bgMobile from "@/assets/piscina-bg-mobile.jpg.asset.json";


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
    const onPop = () => setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    document.body.style.overflow = "hidden";
    // Push a history entry so the browser back button closes the video
    window.history.pushState({ videoOpen: true }, "");

    // Premium cinematic delay before the video reveals
    const t = window.setTimeout(() => {
      setRevealed(true);
      videoRef.current?.play().catch(() => {});
    }, 450);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      document.body.style.overflow = "";
      window.clearTimeout(t);
      // Clean up the synthetic history entry if still present
      if (window.history.state?.videoOpen) window.history.back();
    };

    };
  }, [open]);

  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28">
      {/* Background image — responsive (mobile vs desktop) with focal point preserved */}
      <picture aria-hidden className="absolute inset-0 -z-20">
        <source media="(min-width: 768px)" srcSet={bgDesktop.url} />
        <img
          src={bgMobile.url}
          alt=""
          className="h-full w-full object-cover object-[center_60%] md:object-center"
          loading="lazy"
          decoding="async"
        />
      </picture>
      {/* Legibility layers — subtle scrim + soft vignette */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/55 to-background/85 md:from-background/80 md:via-background/40 md:to-background/85" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.18)_100%)]" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary font-medium">
            Experiência em vídeo
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            Um respiro entre a Bahia e o mar.
          </h2>
          <p className="mt-4 text-base text-foreground/75 leading-relaxed">
            Aperte play e veja o ritmo da pousada antes mesmo de chegar.
          </p>
        </div>


        <div className="grid gap-10 md:grid-cols-[auto,1fr] md:items-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Assistir vídeo da Pousada Ilha do Meio"
            className="group relative block mx-auto md:mx-0 w-full max-w-[200px] sm:max-w-[220px] overflow-hidden rounded-2xl ring-1 ring-border/60 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] focus:outline-none focus:ring-2 focus:ring-primary"
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
                <span className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                  <Play className="relative h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
                </span>
              </div>
            </div>
          </button>

          <div className="text-center md:text-left md:pl-4">
            <p className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
              Da recepção à beira da piscina
            </p>
            <p className="mt-4 text-sm text-foreground/75 max-w-md mx-auto md:mx-0">
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
            aria-label="Voltar e fechar vídeo"
            className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/20 hover:ring-white/40 transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
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
              transform: revealed ? "scale(1)" : "scale(1.02)",
              transition: "opacity 700ms ease-out, transform 900ms ease-out",
            }}
            className="absolute inset-0 h-full w-full object-cover bg-black"
          />
        </div>
      )}
    </section>
  );
}
