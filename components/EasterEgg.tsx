"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

const LINES = [
  "$ whoami",
  "> saikiran — frontend engineer, delhi",
  "$ cat achievement.txt",
  "> unlocked: you know the code ↑↑↓↓←→←→BA",
  "$ echo 'nice one'",
  "> nice one",
  "$ _",
];

export function EasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const sequence = useRef<string[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      sequence.current = [...sequence.current, e.key].slice(-KONAMI.length);
      if (sequence.current.join(",") === KONAMI.join(",")) {
        sequence.current = [];
        setTriggered(true);
        setVisibleLines(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Typewriter-style line reveal
  useEffect(() => {
    if (!triggered) return;
    if (visibleLines >= LINES.length) return;
    const t = setTimeout(() => setVisibleLines((n) => n + 1), visibleLines === 0 ? 0 : 280);
    return () => clearTimeout(t);
  }, [triggered, visibleLines]);

  // Auto-dismiss
  useEffect(() => {
    if (!triggered) return;
    const t = setTimeout(() => {
      setTriggered(false);
      setVisibleLines(0);
    }, 6000);
    return () => clearTimeout(t);
  }, [triggered]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[calc(100vw-2rem)] max-w-[460px]"
          role="status"
          aria-live="polite"
        >
          <div className="bg-[var(--canvas)] border border-[var(--accent)] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.18)] overflow-hidden">
            {/* Terminal titlebar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--rule)] bg-[var(--surface)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)]">
                bash — saikiran@portfolio
              </span>
            </div>
            {/* Terminal body */}
            <div className="p-4 space-y-1">
              {LINES.slice(0, visibleLines).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className={[
                    "font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-[1.6]",
                    line.startsWith("$")
                      ? "text-[var(--accent)]"
                      : "text-[var(--ink-muted)]",
                  ].join(" ")}
                >
                  {line}
                </motion.p>
              ))}
              {/* Blinking cursor on last line */}
              {visibleLines > 0 && visibleLines < LINES.length && (
                <span className="inline-block w-[7px] h-[13px] bg-[var(--accent)] animate-pulse" />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
