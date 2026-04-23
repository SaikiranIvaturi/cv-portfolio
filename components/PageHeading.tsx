"use client";
import { motion, useReducedMotion } from "framer-motion";
import {
  headingReveal,
  headingRevealReduced,
  lineReveal,
  lineRevealReduced,
} from "@/lib/motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const passthrough = { hidden: {}, visible: {} };

export function PageHeading({ children, className = "" }: Props) {
  const reduced = useReducedMotion();
  return (
    <div className={className}>
      <motion.div variants={passthrough} className="overflow-hidden pb-1">
        <motion.h1
          variants={reduced ? headingRevealReduced : headingReveal}
          className="font-[family-name:var(--font-fraunces)] font-normal tracking-[-0.03em] text-[var(--ink)] leading-[1.05]"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
        >
          {children}
        </motion.h1>
      </motion.div>
      <motion.span
        variants={reduced ? lineRevealReduced : lineReveal}
        className="block h-[2px] bg-[var(--accent)] mt-5"
        style={{ transformOrigin: "left center" }}
        aria-hidden="true"
      />
    </div>
  );
}
