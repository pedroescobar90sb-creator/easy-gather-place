import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

import poster from "@/assets/paraiso-poster-clean-cover.jpg.asset.json";
import video from "@/assets/video-paraiso-fullhd-clean.mp4.asset.json";


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



    const t = window.setTimeout(() => {
      setRevealed(true);
      videoRef.current?.play().catch(() => {});
    }, 120);

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
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="max-w-xl">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary font-medium">
              Experiência em vídeo
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
              Um respiro entre a Bahia e o mar.
            </h2>
            <p className="mt-4 text-base text-foreground/75 leading-relaxed">
              Aperte play e veja o ritmo da pousada antes mesmo de chegar — da recepção à beira da piscina, em menos de um minuto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Assistir vídeo da Pousada Ilha do Meio"
            className="group relative block mx-auto w-full max-w-[520px] md:mx-0 md:w-[520px] overflow-hidden rounded-3xl shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div
              className="relative aspect-[16/10] w-full overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${poster.url})` }}
            >
              <img
                src={poster.url}
                alt="Pousada Ilha do Meio — prévia em vídeo"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/95 text-primary shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                  <Play className="relative h-6 w-6 sm:h-8 sm:w-8 fill-current ml-0.5" />
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 text-white">
                <p className="font-display text-base sm:text-lg leading-tight drop-shadow">
                  Da recepção à piscina
                </p>
                <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ring-1 ring-white/30">
                  Assistir
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] overflow-hidden animate-in fade-in duration-300"
          style={{
            zIndex: 999999,
            backgroundImage: `url(${poster.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Tela cheia real: vídeo limpo em 16:9 preenche 100% da viewport, sem faixas pretas. */}
          <video
            ref={videoRef}
            poster={poster.url}
            playsInline
            preload="auto"
            onEnded={() => setOpen(false)}
            onClick={(e) => {
              const v = e.currentTarget;
              if (v.paused) v.play().catch(() => {});
              else v.pause();
            }}
            style={{
              opacity: revealed ? 1 : 0,
              transition: "opacity 500ms ease-out",
            }}
            className="absolute inset-0 h-[100svh] w-[100vw] object-cover object-center cursor-pointer [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden"
          >
            <source src={video.url} type="video/mp4" />
          </video>



          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              videoRef.current?.pause();
              setOpen(false);
            }}
            aria-label="Fechar vídeo"
            className="fixed top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-black hover:bg-white transition shadow-xl ring-1 ring-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ zIndex: 1000000 }}
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>,
        document.body,
      )}
    </section>
  );
}
