import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds. */
  delay?: number;
  /** How far to lift/translate on entry (px). */
  y?: number;
  /** Fraction of the element that must be visible before animating (0-1). */
  amount?: number;
  /** Animate every time it enters, not just the first. */
  repeat?: boolean;
  as?: "div" | "section" | "article" | "header" | "footer" | "aside" | "ul" | "li" | "p" | "span";
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.2,
  repeat = false,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : delay },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
