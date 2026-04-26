"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorMode = "hidden" | "default" | "link" | "work";

// Fast spring for the small dot — feels immediate
const DOT_SPRING   = { stiffness: 600, damping: 40, mass: 0.1 };
// Slower spring for the ring — trails behind, creates depth
const RING_SPRING  = { stiffness: 180, damping: 28, mass: 0.5 };

const RING_SIZE: Record<CursorMode, number> = {
  hidden:  28,
  default: 28,
  link:    40,
  work:    56,
};

const LABELS: Partial<Record<CursorMode, string>> = {
  work: "VIEW ↗",
  link: "OPEN →",
};

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode]       = useState<CursorMode>("hidden");

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);

  // Dot follows cursor tightly
  const dx = useSpring(mx, DOT_SPRING);
  const dy = useSpring(my, DOT_SPRING);

  // Ring lags behind for a parallax depth feel
  const rx = useSpring(mx, RING_SPRING);
  const ry = useSpring(my, RING_SPRING);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      const t = e.target as HTMLElement;
      if      (t.closest('[data-cursor="work"]'))                                    setMode("work");
      else if (t.closest('a, button, [role="button"], label, [data-cursor="link"]')) setMode("link");
      else                                                                            setMode("default");
    };
    const onLeave = () => setMode("hidden");
    const onEnter = () => setMode(m => m === "hidden" ? "default" : m);

    window.addEventListener("mousemove",    onMove,  { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove",    onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, [mx, my]);

  if (!enabled) return null;

  const visible   = mode !== "hidden";
  const ringSize  = RING_SIZE[mode];
  const showRing  = mode === "link" || mode === "work";
  const label     = LABELS[mode];

  return (
    <>
      {/* ── Dot — small, sharp, precise ── */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] cursor-dot"
        style={{ x: dx, y: dy, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: mode === "work" ? 1.6 : 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* ── Ring — appears on interactive elements, slower spring ── */}
      <AnimatePresence>
        {showRing && (
          <motion.div
            key="ring"
            aria-hidden="true"
            className="fixed top-0 left-0 pointer-events-none z-[9998] cursor-ring"
            style={{
              x: rx,
              y: ry,
              translateX: "-50%",
              translateY: "-50%",
              width:  ringSize,
              height: ringSize,
              opacity: 0.45,
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1,   opacity: 0.45 }}
            exit={{ scale: 0.4,    opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── Label — "VIEW ↗" or "OPEN →" ── */}
      <AnimatePresence>
        {label && (
          <motion.div
            key={label}
            aria-hidden="true"
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: rx, y: ry }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span
              className="absolute meta-label text-[var(--accent)] whitespace-nowrap"
              style={{ left: ringSize / 2 + 8, top: -(ringSize / 4) }}
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
