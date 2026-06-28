import { useState } from "react";
import { Building2, Leaf, Play, Video } from "lucide-react";

import tourAtmosphere from "@/assets/tour-1.mp4.asset.json";
import tourStructure from "@/assets/tour-2.mp4.asset.json";
import tourAtmospherePoster from "@/assets/tour-1-poster.jpg.asset.json";
import tourStructurePoster from "@/assets/tour-2-poster.jpg.asset.json";

const TOURS = [
  {
    id: "atmosfera",
    eyebrow: "Tour de atmosfera",
    title: "A experiência antes da chegada",
    description:
      "Um olhar mais sensorial da pousada: áreas externas, clima de descanso e a sensação de estar em Itacimirim.",
    duration: "1min10s",
    src: tourAtmosphere.url,
    poster: tourAtmospherePoster.url,
    icon: Leaf,
  },
  {
    id: "ambientes",
    eyebrow: "Tour dos ambientes",
    title: "Estrutura para conhecer com calma",
    description:
      "Um passeio direto pelos espaços que ajudam o hóspede a entender melhor a pousada antes de reservar.",
    duration: "35s",
    src: tourStructure.url,
    poster: tourStructurePoster.url,
    icon: Building2,
  },
];

export function VideoTourSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="border-b border-border/60 bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            <Video className="h-3.5 w-3.5" />
            Tour em vídeo
          </div>
          <h2 className="mt-5 font-display text-3xl leading-[1.05] sm:text-5xl">
            Veja nossa tour pela pousada.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Os vídeos mostram a pousada com mais verdade: ambiente, estrutura e detalhes que ajudam você a decidir com segurança antes de falar com a recepção.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-foreground/80">
            Implementados com capa própria, carregamento sob interação e formato vertical preservado para manter nitidez no desktop e no mobile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {TOURS.map((tour) => {
            const Icon = tour.icon;
            const isActive = activeVideo === tour.id;

            return (
              <article
                key={tour.id}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/10"
              >
                <div className="relative mx-auto aspect-[9/16] max-h-[680px] overflow-hidden bg-muted">
                  {isActive ? (
                    <video
                      className="h-full w-full object-cover"
                      src={tour.src}
                      poster={tour.poster}
                      controls
                      playsInline
                      autoPlay
                      preload="metadata"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveVideo(tour.id)}
                      className="relative block h-full w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={`Reproduzir ${tour.eyebrow}`}
                    >
                      <img
                        src={tour.poster}
                        alt={`${tour.eyebrow} da Pousada Ilha do Meio`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="grid h-16 w-16 place-items-center rounded-full border border-primary-foreground/35 bg-primary-foreground/92 text-foreground shadow-2xl shadow-foreground/25 transition duration-300 group-hover:scale-105">
                          <Play className="ml-1 h-6 w-6 fill-current" />
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                        <div className="inline-flex items-center gap-2 rounded-full bg-background/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-md">
                          <Icon className="h-3.5 w-3.5" />
                          {tour.eyebrow}
                        </div>
                        <h3 className="mt-3 font-display text-2xl leading-tight">
                          {tour.title}
                        </h3>
                      </div>
                    </button>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                    <span>{tour.eyebrow}</span>
                    <span className="tabular-nums text-muted-foreground">{tour.duration}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tour.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}