import * as React from "react";

type Props = {
  end: number;
  duration?: number;
  className?: string;
  /** Format the displayed value. Defaults to integer with locale grouping. */
  format?: (v: number) => string;
};

/**
 * Simple, dependency-free count-up. Animates once when the element enters the viewport.
 *
 * O valor inicial é sempre `end` (o número real), nunca 0 · assim o HTML renderizado no
 * servidor (o que o Google indexa) já mostra o valor correto mesmo se o JS não rodar, o
 * rolamento não disparar o IntersectionObserver, ou o crawler não esperar animação nenhuma.
 * A animação (reset pra 0 e conta até `end`) só acontece depois da hidratação, como efeito
 * puramente visual · nunca como a única fonte do valor exibido.
 */
export function CountUp({ end, duration = 1400, className, format }: Props) {
  const [value, setValue] = React.useState(end);
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            setValue(0);
            const start = performance.now();
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(end * eased));
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  const formatted = format ? format(value) : value.toLocaleString("pt-BR");
  return (
    <span ref={ref} className={className}>
      {formatted}
    </span>
  );
}
