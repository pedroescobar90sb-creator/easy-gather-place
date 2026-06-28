import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type Testimonial = {
  name: string;
  location: string;
  rating: number;
  quote: string;
  initials: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mariana Souza",
    location: "São Paulo · SP",
    rating: 5,
    initials: "MS",
    quote:
      "Lugar maravilhoso, café da manhã delicioso e funcionários super atenciosos. A localização é perfeita, pertinho da praia e em um ambiente tranquilo. Voltaremos com certeza!",
  },
  {
    name: "Rafael Andrade",
    location: "Belo Horizonte · MG",
    rating: 5,
    initials: "RA",
    quote:
      "Pousada aconchegante, com uma área verde linda e piscina ótima. O atendimento foi simplesmente impecável. Recomendo demais para famílias e casais.",
  },
  {
    name: "Camila Ferreira",
    location: "Rio de Janeiro · RJ",
    rating: 5,
    initials: "CF",
    quote:
      "Estrutura excelente e quartos muito confortáveis. O café da manhã tem variedade e qualidade, e o salão de jogos foi um diferencial pras crianças. Vale cada centavo.",
  },
  {
    name: "João Pedro Lima",
    location: "Salvador · BA",
    rating: 5,
    initials: "JL",
    quote:
      "Atendimento humano e acolhedor, do check-in ao check-out. Itacimirim é um sossego, e a pousada combina perfeitamente com essa vibe. Pretendo voltar em breve.",
  },
  {
    name: "Beatriz Almeida",
    location: "Brasília · DF",
    rating: 5,
    initials: "BA",
    quote:
      "Limpeza impecável, funcionários simpáticos e localização privilegiada. Foi exatamente o descanso que precisávamos. Indicação certa para quem busca paz.",
  },
];

const AVATAR_BG = ["bg-primary/10", "bg-amber-100", "bg-emerald-100", "bg-rose-100", "bg-sky-100"];

export function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center", containScroll: "trimSnaps" });
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!embla) return;
    const onSel = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSel);
    onSel();
    return () => {
      embla.off("select", onSel);
    };
  }, [embla]);

  return (
    <section id="depoimentos" className="bg-card border-y border-border/60">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Depoimentos</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
            Quem viveu a experiência Pousada Ilha do Meio recomenda.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Relatos reais de hóspedes que escolheram a pousada e compartilharam suas impressões.
            Uma forma honesta de conhecer a experiência antes de reservar a sua estadia.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className="min-w-0 shrink-0 grow-0 basis-full px-2 sm:px-6">
                  <article className="relative mx-auto max-w-2xl rounded-3xl border border-border/60 bg-background p-7 sm:p-10 shadow-sm">
                    <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/15" aria-hidden />
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-semibold text-foreground/80",
                          AVATAR_BG[i % AVATAR_BG.length],
                        )}
                        aria-hidden
                      >
                        {t.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium leading-tight">{t.name}</div>
                        <div className="text-sm text-muted-foreground">{t.location}</div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-1" aria-label={`${t.rating} de 5 estrelas`}>
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mt-5 text-base sm:text-lg leading-relaxed text-foreground/90">
                      “{t.quote}”
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              aria-label="Avaliação anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/80 hover:bg-accent hover:text-foreground transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Selecionar avaliação">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir para avaliação ${i + 1}`}
                  aria-selected={selected === i}
                  onClick={() => embla?.scrollTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    selected === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-foreground/30",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              aria-label="Próxima avaliação"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/80 hover:bg-accent hover:text-foreground transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
