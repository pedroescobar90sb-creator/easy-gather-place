import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

import poster from "@/assets/paraiso-poster-clean-cover.jpg.asset.json";
import video from "@/assets/video-paraiso-portrait-hd.mp4.asset.json";

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
    <section className="relative isolate overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Assistir vídeo da Pousada Ilha do Meio"
          className="group relative block w-full overflow-hidden rounded-[28px] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {/* Poster fills the whole professional block — cinematic 4:5 on mobile, wide 21:9 on desktop */}
          <div
            className="relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${poster.url})` }}
          >
            <img
              src={poster.url}
              alt="Pousada Ilha do Meio — prévia em vídeo"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
            />

            {/* Cinematic legibility gradients */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

            {/* Elegant inner frame */}
            <div aria-hidden className="pointer-events-none absolute inset-3 sm:inset-5 rounded-[20px] ring-1 ring-white/25" />

            {/* Top-left eyebrow */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-10 flex items-center gap-3 text-white/90">
              <span className="h-px w-8 bg-white/70" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase font-medium">
                Experiência em vídeo
              </span>
            </div>

            {/* Center play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/95 text-primary shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                <Play className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 fill-current ml-0.5" />
              </span>
            </div>

            {/* Headline block — bottom-left, editorial */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  Um respiro entre a<br className="hidden sm:block" />
                  <span className="italic"> Bahia e o mar.</span>
                </h2>
                <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base text-white/85 leading-relaxed">
                  Aperte play e veja o ritmo da pousada — da recepção à beira da piscina, em menos de um minuto.
                </p>
              </div>

              {/* Bottom-right corner label */}
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-white/70">
                  Da recepção à piscina
                </p>
                <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-[0.28em] ring-1 ring-white/30">
                  Assistir
                </span>
              </div>
            </div>

            {/* Right-side vertical brand label — desktop only */}
            <div className="hidden md:flex absolute top-8 right-10 items-center gap-3 text-white/90">
              <span className="text-[10px] tracking-[0.32em] uppercase font-medium">
                Ilha do Meio · Pousada
              </span>
              <span className="h-px w-8 bg-white/70" />
            </div>
          </div>
        </button>
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
