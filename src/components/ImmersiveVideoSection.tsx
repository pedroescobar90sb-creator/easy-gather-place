import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

import poster from "@/assets/paraiso-poster-v2.jpg.asset.json";
import video from "@/assets/video-paraiso-v2.mp4.asset.json";
import bgDesktop from "@/assets/piscina-bg-desktop.jpg.asset.json";
import bgMobile from "@/assets/piscina-bg-mobile.jpg.asset.json";


export function ImmersiveVideoSection() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
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
    const onFsChange = () => {
      if (!document.fullscreenElement) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    document.addEventListener("fullscreenchange", onFsChange);
    document.body.style.overflow = "hidden";
    window.history.pushState({ videoOpen: true }, "");

    // Request real browser fullscreen so o vídeo ocupa 100% da tela
    overlayRef.current?.requestFullscreen?.().catch(() => {});

    const t = window.setTimeout(() => {
      setRevealed(true);
      videoRef.current?.play().catch(() => {});
    }, 350);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.body.style.overflow = "";
      window.clearTimeout(t);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (window.history.state?.videoOpen) window.history.back();
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
      {/* Legibility layers — fundo discreto para destacar o player */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-background/80 md:bg-background/75" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/30 to-background/60" />

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
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black animate-in fade-in duration-300"
          onClick={() => {
            videoRef.current?.pause();
            setOpen(false);
          }}
        >
          {/* Fundo ambiente: o próprio poster desfocado preenche a tela toda — sem faixas pretas */}
          <div
            aria-hidden
            className="absolute inset-0 bg-center bg-cover scale-110 blur-2xl opacity-70"
            style={{ backgroundImage: `url(${poster.url})` }}
          />
          <div aria-hidden className="absolute inset-0 bg-black/40" />

          {/* Vídeo principal: contém o frame inteiro, centralizado, sem distorção */}
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
              transition: "opacity 500ms ease-out",
            }}
            className="relative h-full w-full object-contain"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              videoRef.current?.pause();
              setOpen(false);
            }}
            aria-label="Fechar vídeo"
            className="absolute top-5 right-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-black hover:bg-white transition shadow-xl ring-1 ring-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      )}
    </section>
  );
}
