"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { INTRO_SESSION_KEY } from "@/lib/motion";

interface Props {
  onComplete: () => void;
  /** y-coordinate where the line rests, matching the nav's bottom border top edge. */
  lineY?: number;
}

export function IntroCurtain({ onComplete, lineY = 54 }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "drawing" | "holding" | "fading" | "done">("idle");
  const [shouldPlay, setShouldPlay] = useState<boolean | null>(null);

  const markPlayed = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {}
  }, []);

  // Decide whether to play
  useEffect(() => {
    try {
      const played = sessionStorage.getItem(INTRO_SESSION_KEY);
      if (played) {
        setShouldPlay(false);
        onComplete();
        return;
      }
    } catch {
      // sessionStorage unavailable — fall through to play
    }
    setShouldPlay(true);
  }, [onComplete]);

  // Respect reduced motion — skip entirely
  useEffect(() => {
    if (shouldPlay && prefersReducedMotion) {
      markPlayed();
      setShouldPlay(false);
      onComplete();
    }
  }, [shouldPlay, prefersReducedMotion, onComplete, markPlayed]);

  // Orchestrate the sequence via explicit timeouts (easier to tune than chained promises)
  useEffect(() => {
    if (!shouldPlay) return;

    // 300ms pause for asterisk to fade in before line begins drawing
    const t1 = setTimeout(() => setPhase("drawing"), 300);
    // Draw takes 1000ms
    const t2 = setTimeout(() => setPhase("holding"), 300 + 1000);
    // Hold 150ms, then fade curtain + asterisk simultaneously
    const t3 = setTimeout(() => setPhase("fading"), 300 + 1000 + 150);
    // Fade takes 400ms, then done
    const t4 = setTimeout(() => {
      setPhase("done");
      markPlayed();
      document.documentElement.classList.add("intro-complete");
      onComplete();
    }, 300 + 1000 + 150 + 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [shouldPlay, onComplete, markPlayed]);

  if (shouldPlay === null || !shouldPlay || phase === "done") return null;

  const isDrawing = phase === "drawing" || phase === "holding" || phase === "fading";
  const isFading = phase === "fading";

  return (
    <AnimatePresence>
      <motion.div
        key="intro-curtain"
        aria-hidden="true"
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Curtain background — fades out during the fading phase */}
        <motion.div
          className="absolute inset-0 bg-[var(--canvas)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: isFading ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* The line — draws from center outward, color shifts from --ink to --rule during fade */}
        <motion.div
          className="absolute left-0 right-0 h-px origin-center"
          style={{ top: `${lineY}px` }}
          initial={{ scaleX: 0, backgroundColor: "var(--ink)" }}
          animate={{
            scaleX: isDrawing ? 1 : 0,
            backgroundColor: isFading ? "var(--rule)" : "var(--ink)",
          }}
          transition={{
            scaleX: { duration: 1.0, ease: [0.65, 0, 0.35, 1] },
            backgroundColor: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
        />

        {/* Asterisk — fades in at t=0, holds through the draw, fades out with the curtain */}
        <motion.span
          aria-hidden="true"
          className="absolute left-1/2 text-[28px] leading-none text-[var(--accent)] pointer-events-none select-none"
          style={{
            top: `${lineY}px`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "fading" ? 0 : 1 }}
          transition={{ duration: phase === "fading" ? 0.4 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          ✦
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
