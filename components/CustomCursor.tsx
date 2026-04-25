"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "hidden" | "default" | "link" | "work";

const SPRING = { stiffness: 520, damping: 42, mass: 0.28 };
const RING_SPRING = { stiffness: 260, damping: 28, mass: 0.5 };

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("hidden");
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  // Ring uses a slower spring for a trailing feel
  const ringX = useSpring(x, RING_SPRING);
  const ringY = useSpring(y, RING_SPRING);
  const modeRef = useRef<CursorMode>("hidden");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="work"]')) {
        setMode("work");
      } else if (target.closest('a, button, [role="button"], label, [data-cursor="link"]')) {
        setMode("link");
      } else {
        setMode("default");
      }
    };

    const onLeave = () => setMode("hidden");
    const onEnter = () => setMode((m) => (m === "hidden" ? "default" : m));

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, [x, y]);

  if (!enabled) return null;

  const dotSize   = mode === "work" ? 8 : 5;
  const dotOpacity = mode === "hidden" ? 0 : 1;

  const ringSize    = mode === "work" ? 38 : mode === "link" ? 30 : 0;
  const ringOpacity = mode === "work" || mode === "link" ? 1 : 0;
  const ringFill    = mode === "work";

  return (
    <>
      {/* Dot — fast spring, stays exactly on cursor */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[var(--accent)]"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: dotSize, height: dotSize, opacity: dotOpacity }}
        transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
      />

      {/* Ring — slower spring, lags slightly behind for depth */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-[var(--accent)]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: ringFill ? "var(--accent-soft)" : "transparent",
        }}
        animate={{ width: ringSize, height: ringSize, opacity: ringOpacity }}
        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      />
    </>
  );
}
