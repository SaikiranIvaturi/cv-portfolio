"use client";
import { motion, useReducedMotion } from "framer-motion";
import { easings } from "@/lib/motion";

export function Reveal({ children, once = true }: { children: React.ReactNode; once?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: easings.reveal }}
    >
      {children}
    </motion.div>
  );
}
