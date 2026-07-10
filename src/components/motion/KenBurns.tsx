import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Loop duration in seconds. */
  duration?: number;
  /** Set to true for the LCP image (skip lazy). */
  eager?: boolean;
  /** Image sizes attribute. */
  sizes?: string;
};

/**
 * Slow scale-in loop for hero/cover imagery. Very subtle — 1 → 1.08.
 * Disabled entirely when the user prefers reduced motion.
 */
export function KenBurns({ src, alt, className, duration = 22, eager = false, sizes }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      sizes={sizes}
      className={cn("h-full w-full object-cover will-change-transform", className)}
      initial={{ scale: 1 }}
      animate={reduce ? { scale: 1 } : { scale: 1.08 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration, ease: "linear", repeat: Infinity, repeatType: "reverse" }
      }
    />
  );
}
