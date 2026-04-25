"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const accentRef = useRef<string>("#8B2E2A");

  useEffect(() => {
    // Skip on touch/reduced-motion devices
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Re-read accent color on each frame so it respects theme changes
    const readAccent = () => {
      accentRef.current = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
    };
    readAccent();

    const onMove = (e: MouseEvent) => {
      particles.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        maxAge: 22,
      });
      // Cap trail length
      if (particles.current.length > 28) {
        particles.current = particles.current.slice(-28);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let frameCount = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Re-read accent every 60 frames to pick up theme changes
      frameCount++;
      if (frameCount % 60 === 0) readAccent();

      particles.current = particles.current
        .map((p) => ({ ...p, age: p.age + 1 }))
        .filter((p) => p.age < p.maxAge);

      particles.current.forEach((p) => {
        const progress = p.age / p.maxAge;
        const opacity = (1 - progress) * 0.28;
        const radius = (1 - progress) * 3.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(radius, 0), 0, Math.PI * 2);
        ctx.fillStyle = accentRef.current;
        ctx.globalAlpha = opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9997]"
    />
  );
}
