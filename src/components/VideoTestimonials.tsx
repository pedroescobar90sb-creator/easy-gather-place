import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
// Mesmo fundo da seção que existia aqui antes · mantém a costura visual da página.
import palmBg1 from "@/assets/thumbs/palm-bg-1@960.webp";

type Clipe = {
  id: string;
  src: string;
  poster: string;
  titulo: string;
  /** @usuário do Instagram · ausente quando o clipe é imagem da própria pousada. */
  autor?: string;
  /** Nem todo clipe veio com som · sem isso, o botão de áudio apareceria sem função. */
  temAudio: boolean;
};

// Os três primeiros são stories de hóspedes que marcaram a pousada. Os arquivos vieram com
// o story encaixado no meio de um fundo desfocado, ocupando só 71% da largura — foram
// recortados no enquadramento do story (504x896, 9:16 exato). O recorte preserva de
// propósito o cabeçalho com o @usuário e a legenda escrita pelo hóspede: são eles que
// provam que o depoimento é de gente real, e não material da casa.
const CLIPES: Clipe[] = [
  {
    id: "jiselly",
    src: "/depoimentos/jiselly.mp4",
    poster: "/depoimentos/jiselly.webp",
    titulo: "Contando como foi a estadia",
    autor: "@jiselly_silvaa",
    temAudio: true,
  },
  {
    id: "alice",
    src: "/depoimentos/alice.mp4",
    poster: "/depoimentos/alice.webp",
    titulo: "“Ganhou meu coração!”",
    autor: "@alicemoraesoficial",
    temAudio: true,
  },
  {
    id: "milena",
    src: "/depoimentos/milena.mp4",
    poster: "/depoimentos/milena.webp",
    titulo: "“Olha que delícia a noite”",
    autor: "@milenaolei",
    temAudio: true,
  },
  {
    id: "piscina",
    src: "/depoimentos/piscina.mp4",
    poster: "/depoimentos/piscina.webp",
    titulo: "A piscina e o deck",
    temAudio: true,
  },
];

const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function VideoTestimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [selecionado, setSelecionado] = React.useState(0);
  const [podePrev, setPodePrev] = React.useState(false);
  const [podeNext, setPodeNext] = React.useState(false);

  const secaoRef = React.useRef<HTMLElement>(null);
  /** Só libera o download dos vídeos quando a seção chega perto da tela. */
  const [perto, setPerto] = React.useState(false);
  /** Qual clipe está tocando · null quando nenhum está. Guarda o id, não o índice. */
  const [tocando, setTocando] = React.useState<string | null>(null);
  const [semSom, setSemSom] = React.useState(true);

  const videosRef = React.useRef(new Map<string, HTMLVideoElement>());

  React.useEffect(() => {
    if (!embla) return;
    const sincronizar = () => {
      setSelecionado(embla.selectedScrollSnap());
      setPodePrev(embla.canScrollPrev());
      setPodeNext(embla.canScrollNext());
    };
    embla.on("select", sincronizar);
    embla.on("reInit", sincronizar);
    sincronizar();
    return () => {
      embla.off("select", sincronizar);
      embla.off("reInit", sincronizar);
    };
  }, [embla]);

  // Nada de vídeo é baixado até a seção estar quase à vista. 300px de folga dá tempo de
  // ler os metadados antes da pessoa chegar, sem custar nada a quem nunca desce até aqui.
  React.useEffect(() => {
    const el = secaoRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setPerto(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setPerto(true); io.disconnect(); } },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /** Um de cada vez: ao dar play num, todos os outros param. */
  const aoTocar = React.useCallback((id: string) => {
    videosRef.current.forEach((v, outroId) => {
      if (outroId !== id && !v.paused) v.pause();
    });
    setTocando(id);
  }, []);

  const alternar = React.useCallback((id: string) => {
    const v = videosRef.current.get(id);
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  }, []);

  const alternarSom = React.useCallback(() => {
    setSemSom((atual) => {
      const proximo = !atual;
      videosRef.current.forEach((v) => { v.muted = proximo; });
      return proximo;
    });
  }, []);

  // Um clipe que saiu da tela não pode continuar rodando: gasta bateria e o som
  // continuaria tocando sem nada visível na tela.
  //
  // threshold 0, e não 0.5: o retorno do observador só dispara quando a proporção
  // *cruza* o limite. Com 0.5, um cartão que já começava meio pra fora — o que é o caso
  // do segundo no celular, onde só 1,2 cartão cabe na tela — nunca cruzava nada ao rolar
  // a página, e o vídeo continuava tocando fora da tela. Com 0, qualquer saída completa
  // dispara, inclusive quando o cartão sai pro lado dentro do próprio carrossel.
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) (e.target as HTMLVideoElement).pause();
        }
      },
      { threshold: 0 },
    );
    videosRef.current.forEach((v) => io.observe(v));
    const aoEsconder = () => {
      if (document.hidden) videosRef.current.forEach((v) => v.pause());
    };
    document.addEventListener("visibilitychange", aoEsconder);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", aoEsconder);
    };
  }, [perto]);

  return (
    <section
      ref={secaoRef}
      id="depoimentos"
      aria-label="Depoimentos de hóspedes em vídeo"
      className="relative border-y border-border/60 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${palmBg1})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/38 to-black/62" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.06]"
        style={{ backgroundImage: GRAIN_BG }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.22em] text-sand font-medium">Depoimentos</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05] text-white">
            Quem se hospedou contou no Instagram.
          </h2>
          <p className="mt-4 text-white/80">
            Três stories publicados por hóspedes, do jeito que eles postaram — o @ de cada um
            está no vídeo. O último clipe é nosso: a piscina. Toque para assistir.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            {/* -mx-2 compensa o padding lateral dos cartões, pra primeira borda alinhar. */}
            <div className="flex -mx-2 touch-pan-y">
              {CLIPES.map((c) => {
                const estaTocando = tocando === c.id;
                // Quem usa leitor de tela precisa saber de quem é o depoimento · sem o @,
                // "Ganhou meu coração!" sozinho não diz que veio de uma hóspede.
                const rotulo = c.autor ? `${c.titulo}, de ${c.autor}` : c.titulo;
                return (
                  <div
                    key={c.id}
                    // 87% deixa o próximo cartão espiando na borda · é o que sinaliza,
                    // sem seta nem texto, que dá pra arrastar pro lado.
                    className="min-w-0 shrink-0 grow-0 basis-[87%] sm:basis-[46%] lg:basis-1/4 px-2"
                  >
                    {/* aspect-[9/16] reserva a altura antes do vídeo existir · sem pulo de layout. */}
                    <div className="group relative aspect-[9/16] overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
                      {/* O elemento existe desde sempre, mas com preload="none" ele não
                          baixa um byte — o que aparece é o poster. Só quando a seção
                          chega perto da tela é que liberamos a leitura dos metadados.
                          Trocar <img> por <video> na hora causaria um piscar. */}
                      <video
                        ref={(el) => {
                          if (el) videosRef.current.set(c.id, el);
                          else videosRef.current.delete(c.id);
                        }}
                        src={c.src}
                        poster={c.poster}
                        preload={perto ? "metadata" : "none"}
                        muted={semSom}
                        playsInline
                        loop
                        aria-label={`Vídeo: ${rotulo}`}
                        onPlay={() => aoTocar(c.id)}
                        onPause={() => setTocando((t) => (t === c.id ? null : t))}
                        className="h-full w-full object-cover"
                      />

                      {/* Degradê só no pé do cartão · dá contraste pro rótulo sem escurecer a
                          imagem toda. Nos stories não entra: eles já trazem a legenda do
                          hóspede escrita ali embaixo, e escurecer só atrapalharia a leitura. */}
                      {!c.autor && (
                        <div
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent transition-opacity duration-300",
                            estaTocando ? "opacity-0" : "opacity-100",
                          )}
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => alternar(c.id)}
                        aria-label={estaTocando ? `Pausar ${rotulo}` : `Assistir ${rotulo}`}
                        className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                      >
                        <span
                          className={cn(
                            "inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md ring-1 ring-white/40 transition-all duration-300",
                            estaTocando
                              ? "scale-90 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                              : "opacity-100",
                          )}
                        >
                          {estaTocando ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
                        </span>
                      </button>

                      {c.temAudio && (
                        <button
                          type="button"
                          onClick={alternarSom}
                          aria-label={semSom ? "Ativar som" : "Desativar som"}
                          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md ring-1 ring-white/25 transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          {semSom ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                      )}

                      {/* Só o clipe da casa ganha rótulo escrito. Nos stories, o @usuário já
                          está no topo da imagem e a frase do hóspede embaixo — repetir por
                          cima cobriria justamente as palavras dele. */}
                      {!c.autor && (
                        <p
                          className={cn(
                            "pointer-events-none absolute inset-x-4 bottom-4 text-sm font-medium text-white transition-opacity duration-300",
                            estaTocando ? "opacity-0" : "opacity-100",
                          )}
                        >
                          {c.titulo}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              disabled={!podePrev}
              aria-label="Vídeo anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/80 transition hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Selecionar vídeo">
              {CLIPES.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-label={`Ir para ${c.autor ?? c.titulo}`}
                  aria-selected={selecionado === i}
                  onClick={() => embla?.scrollTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    selecionado === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-foreground/30",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              disabled={!podeNext}
              aria-label="Próximo vídeo"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/80 transition hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
