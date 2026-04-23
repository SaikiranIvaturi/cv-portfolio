"use client";
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";

export function AmbientShapes() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Three parallax depth layers
  const yFar  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0,  -80]);
  const yMid  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -160]);
  const yNear = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -260]);

  const spin = (dur: number) => ({
    duration: dur,
    repeat: Infinity as const,
    ease: "linear" as const,
  });

  const rotateFwd = reduced ? {} : { rotate: [0, 360] };
  const rotateBwd = reduced ? {} : { rotate: [0, -360] };

  return (
    <div
      aria-hidden="true"
      data-no-print
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* ── FAR LAYER (very faint, barely moves) ── */}

      {/* Top-left: dot grid */}
      <motion.div style={{ y: yFar }} className="absolute top-[12%] left-[5%]">
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 18 + (row % 2) * 9 + 5}
                cy={row * 15 + 5}
                r={1.4}
                fill="var(--accent)"
                opacity={0.08}
              />
            ))
          )}
        </svg>
      </motion.div>

      {/* Top-right: concentric arcs */}
      <motion.div style={{ y: yFar }} className="absolute top-[8%] right-[4%]">
        <svg width="130" height="130" viewBox="0 0 130 130" fill="none" stroke="var(--accent)" strokeWidth="0.8">
          {[30, 50, 70, 90, 112].map((r, i) => (
            <circle key={i} cx="65" cy="65" r={r} opacity={0.07 - i * 0.008} />
          ))}
        </svg>
      </motion.div>

      {/* Center-ish far: large faint hexagon */}
      <motion.div style={{ y: yFar }} className="absolute top-[40%] left-[50%] -translate-x-1/2">
        <svg width="320" height="280" viewBox="-160 -140 320 280" fill="none" stroke="var(--accent)" strokeWidth="0.6">
          <polygon points="0,-110  95,-55  95,55  0,110  -95,55  -95,-55" opacity="0.04" />
          <polygon points="0,-70   60,-35  60,35  0,70   -60,35  -60,-35" opacity="0.05" />
        </svg>
      </motion.div>

      {/* Bottom-left: scattered fine dots */}
      <motion.div style={{ y: yFar }} className="absolute bottom-[15%] left-[8%]">
        <svg width="100" height="110" viewBox="0 0 100 110" fill="var(--accent)">
          {([[8,8,2],[28,5,1.3],[52,14,1.8],[14,30,1.2],[40,26,2.2],[62,38,1.4],[10,54,1.6],[34,60,2],[56,70,1.5],[18,82,2.2],[44,90,1.3],[70,80,1.8]] as [number,number,number][])
            .map(([cx,cy,r],i) => <circle key={i} cx={cx} cy={cy} r={r} opacity={0.07} />)}
        </svg>
      </motion.div>

      {/* ── MID LAYER (moderate opacity, medium parallax) ── */}

      {/* Right side: slowly rotating wireframe cube */}
      <motion.div
        style={{ y: yMid }}
        animate={rotateFwd}
        transition={spin(50)}
        className="absolute top-[28%] right-[8%]"
      >
        <svg width="80" height="80" viewBox="-40 -40 80 80" fill="none" stroke="var(--accent)" strokeWidth="0.9">
          {/* front face */}
          <rect x="-20" y="-20" width="38" height="38" opacity="0.10" />
          {/* back face offset */}
          <rect x="-30" y="-30" width="38" height="38" opacity="0.07" />
          {/* connectors */}
          <line x1="-20" y1="-20" x2="-30" y2="-30" opacity="0.08" />
          <line x1=" 18" y1="-20" x2="  8" y2="-30" opacity="0.08" />
          <line x1=" 18" y1=" 18" x2="  8" y2="  8" opacity="0.08" />
          <line x1="-20" y1=" 18" x2="-30" y2="  8" opacity="0.08" />
        </svg>
      </motion.div>

      {/* Left-center: rotating diamond / octahedron */}
      <motion.div
        style={{ y: yMid }}
        animate={rotateBwd}
        transition={spin(38)}
        className="absolute top-[52%] left-[6%]"
      >
        <svg width="70" height="70" viewBox="-35 -35 70 70" fill="none" stroke="var(--accent)" strokeWidth="0.9">
          <polygon points="0,-28  24,6   0,20  -24,6" opacity="0.11" />
          <line x1="0" y1="-28" x2="0" y2="20"  opacity="0.06" />
          <line x1="-24" y1="6" x2="24" y2="6"  opacity="0.06" />
          <polygon points="0,-14  12,3   0,10  -12,3" opacity="0.09" />
        </svg>
      </motion.div>

      {/* Center-left: crosshairs spread across */}
      <motion.div style={{ y: yMid }} className="absolute top-[72%] left-[22%]">
        <svg width="200" height="60" viewBox="0 0 200 60" fill="none" stroke="var(--accent)" strokeWidth="0.9">
          {([[20, 20], [70, 35], [120, 16], [170, 42]] as [number, number][]).map(([cx, cy], i) => (
            <g key={i} opacity={0.10 - i * 0.015}>
              <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} />
              <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} />
              <circle cx={cx} cy={cy} r="2" fill="var(--accent)" stroke="none" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Right-bottom: corner bracket marks */}
      <motion.div style={{ y: yMid }} className="absolute bottom-[22%] right-[10%]">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" stroke="var(--accent)" strokeWidth="1">
          {/* top-left corner */}
          <path d="M10 28 L10 10 L28 10" opacity="0.12" />
          {/* top-right corner */}
          <path d="M62 10 L80 10 L80 28" opacity="0.10" />
          {/* bottom-left corner */}
          <path d="M10 62 L10 80 L28 80" opacity="0.10" />
          {/* bottom-right corner */}
          <path d="M62 80 L80 80 L80 62" opacity="0.12" />
          {/* center cross */}
          <line x1="45" y1="36" x2="45" y2="54" opacity="0.07" />
          <line x1="36" y1="45" x2="54" y2="45" opacity="0.07" />
        </svg>
      </motion.div>

      {/* ── NEAR LAYER (slightly stronger, most parallax) ── */}

      {/* Top-center: horizontal dashed rule with accent tick */}
      <motion.div style={{ y: yNear }} className="absolute top-[20%] left-[30%]">
        <svg width="180" height="24" viewBox="0 0 180 24" fill="none" stroke="var(--accent)" strokeWidth="0.8">
          <line x1="0" y1="12" x2="180" y2="12" strokeDasharray="4 8" opacity="0.09" />
          <line x1="90" y1="4" x2="90" y2="20" opacity="0.12" />
          <circle cx="90" cy="12" r="2.5" fill="var(--accent)" opacity="0.12" />
        </svg>
      </motion.div>

      {/* Mid-right: spinning triangle trio */}
      <motion.div
        style={{ y: yNear }}
        animate={rotateFwd}
        transition={spin(28)}
        className="absolute top-[44%] right-[14%]"
      >
        <svg width="56" height="56" viewBox="-28 -28 56 56" fill="none" stroke="var(--accent)" strokeWidth="1">
          <polygon points="0,-22  19,11   -19,11" opacity="0.12" />
          <polygon points="0,-11  9.5,5.5 -9.5,5.5" opacity="0.09" />
        </svg>
      </motion.div>

      {/* Bottom-center spread: small accent stars/ticks */}
      <motion.div style={{ y: yNear }} className="absolute bottom-[28%] left-[38%]">
        <svg width="140" height="50" viewBox="0 0 140 50" fill="none">
          {([[16, 24], [52, 10], [88, 36], [124, 18]] as [number, number][]).map(([cx, cy], i) => (
            <text key={i} x={cx - 5} y={cy + 5} fontSize="12" fill="var(--accent)" opacity={0.10 - i * 0.01} fontFamily="serif">✦</text>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

