import * as React from "react";

type Props = {
  end: number;
  duration?: number;
  className?: string;
  /** Format the displayed value. Defaults to integer with locale grouping. */
  format?: (v: number) => string;
};

/** Simple, dependency-free count-up. Animates once when the element enters the viewport. */
export function CountUp({ end, duration = 1400, className, format }: Props) {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
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
