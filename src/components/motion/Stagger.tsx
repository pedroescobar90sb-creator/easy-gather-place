import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type StaggerGroupProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay between children (seconds). */
  gap?: number;
  /** Initial delay before the first child (seconds). */
  delay?: number;
  amount?: number;
  as?: "div" | "section" | "ul" | "ol" | "dl" | "header" | "article";
};

export function StaggerGroup({
  children,
  className,
  gap = 0.08,
  delay = 0,
  amount = 0.2,
  as = "div",
}: StaggerGroupProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : gap,
        delayChildren: reduce ? 0 : delay,
      },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article" | "span" | "p" | "h1" | "h2" | "h3" | "dt" | "dd";
};

export function StaggerItem({ children, className, y = 20, as = "div" }: StaggerItemProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.65, ease: EASE },
    },
  };

  return (
    <MotionTag className={cn(className)} variants={variants}>
      {children}
    </MotionTag>
  );
}
