"use client";
import { motion, useReducedMotion } from "framer-motion";
import { headingReveal, headingRevealReduced } from "@/lib/motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

// Passthrough wrapper — receives stagger trigger from parent, clips the h1 reveal
const passthrough = { hidden: {}, visible: {} };

export function PageHeading({ children, className = "" }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div variants={passthrough} className="overflow-hidden">
      <motion.h1
        variants={reduced ? headingRevealReduced : headingReveal}
        className={`font-[family-name:var(--font-fraunces)] font-normal tracking-[-0.03em] text-[var(--ink)] leading-[1.1] ${className}`}
        style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
      >
        {children}
      </motion.h1>
    </motion.div>
  );
}
