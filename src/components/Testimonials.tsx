import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import avatarLaura from "@/assets/avatar-laura.png";
import avatarCintia from "@/assets/avatar-cintia.png";
import avatarFatima from "@/assets/avatar-fatima.png";
import avatarDavid from "@/assets/avatar-david.png";
import avatarJuliana from "@/assets/avatar-juliana.png";
import palmBg1 from "@/assets/palm-bg-1.webp";

type Testimonial = {
  name: string;
  location: string;
  rating: number;
  quote: string;
  photo: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Laura Araújo",
    location: "Google · Férias em família",
    rating: 5,
    photo: avatarLaura,
    quote:
      "O ambiente incrivelmente agradável e super acolhedor, igualmente ao atendimento excelente que tivemos. Todos foram muito cuidadosos, deram o maior suporte para nossa família e principalmente para o nosso avô. Até prepararam refeições deliciosas e mais apropriadas para ele. A experiência foi incrível.",
  },
  {
    name: "Juliana Amaro",
    location: "Google · Família",
    rating: 5,
    photo: avatarJuliana,
    quote:
      "A pousada é muito linda, com área verde, uma vista incrível e uma piscina maravilhosa. Quartos amplos tanto para casal como para família com filhos, e o café maravilhoso que não perde para nenhum resort. As funcionárias são carismáticas, cuidadosas e atenciosas demais. Ambiente familiar e acolhedor, pretendo me hospedar mais vezes.",
  },
  {
    name: "David Moisés",
    location: "Google · Férias em família",
    rating: 5,
    photo: avatarDavid,
    quote:
      "A estadia com a família foi ótima! A pousada tem um ambiente muito tranquilo e familiar, além de ser charmosa, bonita e bem cuidada. Marcelo e toda a equipe são muito atenciosos! O café da manhã é uma delícia, e o acesso à praia é perto e pode ser feito a pé.",
  },
  {
    name: "Cintia Oliveira",
    location: "Google · Férias em família",
    rating: 5,
    photo: avatarCintia,
    quote:
      "Ambiente tranquilo, ideal para descansar com a família. Quartos, serviço e localização nota máxima, voltaríamos com certeza.",
  },
  {
    name: "Fátima Barbosa",
    location: "Google · Avaliação recente",
    rating: 5,
    photo: avatarFatima,
    quote:
      "Ambiente muito agradável, tudo bem conservado. Cama super confortável, banheiro espaçoso e toalhas bem cheirosas. Recomendo demais.",
  },
];

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
    <section id="depoimentos" className="relative border-y border-border/60 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${palmBg1})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/38 to-black/62" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.22em] text-sand font-medium">Depoimentos</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05] text-white">
            Quem viveu a experiência Pousada Ilha do Meio recomenda.
          </h2>
          <p className="mt-4 text-white/80">
            Relatos reais de hóspedes que escolheram a pousada e compartilharam suas impressões.
            Uma forma honesta de conhecer a experiência antes de reservar a sua estadia.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="min-w-0 shrink-0 grow-0 basis-full px-2 sm:px-6">
                  <article className="relative mx-auto max-w-2xl rounded-3xl border border-border/60 bg-background p-7 sm:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
                    <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/15" aria-hidden />
                    <div className="flex items-center gap-4">
                      <img
                        src={t.photo}
                        alt={`Foto de ${t.name}`}
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-border/60"
                      />
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
