import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Thin scroll-progress bar fixed at the very top of the viewport.
 * Uses the sand accent for editorial feel. Respects reduced-motion.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.3,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="pointer-events-none fixed left-0 right-0 top-0 z-[200] h-[2px] bg-sand"
    />
  );
}
