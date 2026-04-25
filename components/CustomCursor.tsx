"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorMode = "hidden" | "default" | "link" | "work";

const SPRING = { stiffness: 420, damping: 38, mass: 0.25 };

const LABELS: Partial<Record<CursorMode, string>> = {
  work: "VIEW ↗",
  link: "→",
};

const SIZE: Record<CursorMode, number> = {
  hidden:  28,
  default: 28,
  link:    44,
  work:    64,
};

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode]       = useState<CursorMode>("hidden");

  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      if      (t.closest('[data-cursor="work"]'))                           setMode("work");
      else if (t.closest('a, button, [role="button"], label, [data-cursor="link"]')) setMode("link");
      else                                                                   setMode("default");
    };
    const onLeave  = () => setMode("hidden");
    const onEnter  = () => setMode(m => m === "hidden" ? "default" : m);

    window.addEventListener("mousemove",    onMove,   { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove",    onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size    = SIZE[mode];
  const visible = mode !== "hidden";
  const label   = LABELS[mode];

  return (
    <>
      {/* ── Subtle Simple Dot Cursor ── */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] subtle-dot-cursor"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 0.7 : 0 }}
        transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
      />

      {/* ── Context label ── */}
      <AnimatePresence>
        {label && (
          <motion.div
            key={label}
            aria-hidden="true"
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, x: sx, y: sy }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <span
              className="absolute meta-label text-[var(--accent)] whitespace-nowrap"
              style={{ left: size / 2 + 10, top: -(size / 4) }}
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
