import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela um elemento com fade + subida quando ele entra na tela.
 *
 * Fica em transform/opacity de propósito: são as duas propriedades que o navegador
 * anima na GPU sem recalcular layout, então o scroll continua liso mesmo em celular
 * mais fraco.
 *
 * Também expõe `shown` pra quem precisa escalonar filhos (stagger) com transition-delay.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Sem IntersectionObserver, ou usuário pediu menos movimento: mostra na hora.
    // O atalho aqui é necessário porque a regra global de reduced-motion em styles.css
    // zera a duração mas não impede o elemento de nascer invisível.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    // Se o elemento já está na tela quando monta, mostra na hora: fazer fade em algo que
    // o visitante já está olhando só atrasa a leitura. Também serve de rede de segurança
    // — se o observer não disparasse, o conteúdo ficaria invisível pra sempre.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return {
    ref,
    shown,
    revealClass: cn(
      "transition-[opacity,transform] duration-700 ease-out",
      shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      // will-change só enquanto falta animar: deixar dezenas de camadas de GPU
      // permanentes é justamente o que faz celular fraco engasgar no scroll.
      !shown && "will-change-[opacity,transform]",
    ),
  };
}
