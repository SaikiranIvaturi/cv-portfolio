import { useEffect, useState } from "react";

// ─── Particle configuration ────────────────────────────────────────────────
// Each particle orbits the core at a different radius, speed, and phase.
// Adjust `orbit`, `duration`, and `delay` to tune the feel.
const PARTICLES = [
  { id: 1, orbit: 65,  duration: 3.5, delay: 0,    size: 3,   color: "#66D6D6", opacity: 0.9  },
  { id: 2, orbit: 65,  duration: 3.5, delay: 1.75, size: 2,   color: "#8FD4F8", opacity: 0.55 },
  { id: 3, orbit: 95,  duration: 5.5, delay: 0.8,  size: 2.5, color: "#44B8F3", opacity: 0.7  },
  { id: 4, orbit: 95,  duration: 5.5, delay: 3.2,  size: 1.5, color: "#66D6D6", opacity: 0.45 },
  { id: 5, orbit: 50,  duration: 2.8, delay: 0.4,  size: 2,   color: "#8FD4F8", opacity: 0.8  },
  { id: 6, orbit: 125, duration: 7,   delay: 1.5,  size: 2,   color: "#44B8F3", opacity: 0.4  },
  { id: 7, orbit: 125, duration: 7,   delay: 4.5,  size: 1.5, color: "#66D6D6", opacity: 0.3  },
  { id: 8, orbit: 125, duration: 7,   delay: 2.8,  size: 1,   color: "#8FD4F8", opacity: 0.25 },
];

export default function LoadingScreen() {
  // mounted → triggers entrance animation
  const [mounted, setMounted] = useState(false);
  // fadeOut → triggers exit transition
  const [fadeOut, setFadeOut] = useState(false);
  // progress → 0–100 for the progress bar illusion
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger entrance on the next paint
    setMounted(true);

    // Non-linear progress illusion — fast at first, decelerates near the end
    const progressInterval = setInterval(() => {
      setProgress(function(prev: number) {
        if (prev >= 90) return prev;
        const speed =
          prev < 45 ? Math.random() * 5 + 2 :
          prev < 70 ? Math.random() * 2 + 0.5 :
                      Math.random() * 0.6 + 0.1;
        return Math.min(prev + speed, 90);
      });
    }, 200);

    // Exit: snap to 100 % then fade out
    const exitTimer = setTimeout(function() {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(function() { setFadeOut(true); }, 400);
    }, 4100);

    return function() {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : mounted ? "opacity-100" : "opacity-0"
      }`}
      style={{
        // Brand: navy (#1A3673) → textDarkGray (#231E33) → mediumNavy (#2861BB)
        background: "linear-gradient(135deg, #1A3673 0%, #231E33 50%, #2861BB 100%)",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* ── Wide ambient radial glow behind everything ── */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(40,97,187,0.18) 0%, rgba(102,214,214,0.07) 45%, transparent 70%)",
          filter: "blur(40px)",
          animation: "ls-glow-pulse 5s ease-in-out infinite",
        }}
      />

      {/* ── Content stack ── */}
      <div
        className={`relative flex flex-col items-center transition-transform duration-700 ${
          mounted ? "translate-y-0" : "translate-y-3"
        }`}
        style={{ gap: 44 }}
      >

        {/* ════════════════════════════════════════════
            ORBITAL ANIMATION SYSTEM
        ════════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            width: 320,
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG layer — all space / particle effects live here */}
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            <defs>
              {/* Glow filter for particles */}
              <filter id="ls-p-glow">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Softer glow for rotating arcs */}
              <filter id="ls-r-glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradient sweeps on rotating arcs — creates a comet-tail feel */}
              <linearGradient id="ls-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="rgba(102,214,214,0)" />
                <stop offset="50%"  stopColor="rgba(102,214,214,0.4)" />
                <stop offset="100%" stopColor="rgba(102,214,214,0)" />
              </linearGradient>
              <linearGradient id="ls-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="rgba(68,184,243,0)" />
                <stop offset="50%"  stopColor="rgba(68,184,243,0.3)" />
                <stop offset="100%" stopColor="rgba(68,184,243,0)" />
              </linearGradient>
            </defs>

            {/* ── Static guide rings (barely visible) ── */}
            <circle cx="160" cy="160" r="50"  fill="none" stroke="rgba(102,214,214,0.05)"  strokeWidth="1" />
            <circle cx="160" cy="160" r="65"  fill="none" stroke="rgba(68,184,243,0.04)"   strokeWidth="1" strokeDasharray="3 9" />
            <circle cx="160" cy="160" r="95"  fill="none" stroke="rgba(143,212,248,0.035)" strokeWidth="1" strokeDasharray="2 14" />
            <circle cx="160" cy="160" r="125" fill="none" stroke="rgba(102,214,214,0.025)" strokeWidth="1" />

            {/* ── Rotating comet arcs ── */}
            {/* Arc 1 — clockwise, medium speed */}
            <g style={{ transformOrigin: "160px 160px", animation: "ls-spin 4s linear infinite" }}>
              <circle
                cx="160" cy="160" r="75"
                fill="none"
                stroke="url(#ls-grad-1)"
                strokeWidth="1.5"
                strokeDasharray="55 418"
                filter="url(#ls-r-glow)"
              />
            </g>

            {/* Arc 2 — counter-clockwise, slower */}
            <g style={{ transformOrigin: "160px 160px", animation: "ls-spin-rev 6s linear infinite" }}>
              <circle
                cx="160" cy="160" r="108"
                fill="none"
                stroke="url(#ls-grad-2)"
                strokeWidth="1"
                strokeDasharray="80 598"
                filter="url(#ls-r-glow)"
              />
            </g>

            {/* Arc 3 — clockwise, very slow outer ring */}
            <g style={{ transformOrigin: "160px 160px", animation: "ls-spin 10s linear infinite" }}>
              <circle
                cx="160" cy="160" r="138"
                fill="none"
                stroke="rgba(143,212,248,0.12)"
                strokeWidth="0.8"
                strokeDasharray="45 821"
              />
            </g>

            {/* ── Energy pulse waves — expand outward from core ── */}
            {/* Wave A */}
            <circle
              cx="160" cy="160" r="40"
              fill="none"
              stroke="rgba(102,214,214,0.18)"
              strokeWidth="16"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "ls-pulse 2.8s cubic-bezier(0.0, 0.6, 0.4, 1) infinite",
              }}
            />
            {/* Wave B — offset by half the period */}
            <circle
              cx="160" cy="160" r="40"
              fill="none"
              stroke="rgba(68,184,243,0.12)"
              strokeWidth="12"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "ls-pulse 2.8s cubic-bezier(0.0, 0.6, 0.4, 1) 1.4s infinite",
              }}
            />

            {/* ── Orbiting particle dots ── */}
            {PARTICLES.map(function(p) {
              return (
                <g
                  key={p.id}
                  style={{
                    transformOrigin: "160px 160px",
                    animation: "ls-orbit " + p.duration + "s linear " + p.delay + "s infinite",
                  }}
                >
                  {/* Soft diffuse halo behind the particle */}
                  <circle cx={160 + p.orbit} cy="160" r={p.size * 2.5} fill={p.color} opacity={p.opacity * 0.1} />
                  {/* Main particle */}
                  <circle cx={160 + p.orbit} cy="160" r={p.size} fill={p.color} opacity={p.opacity} filter="url(#ls-p-glow)" />
                </g>
              );
            })}

            {/* ── Breathing core disc — gentle inner glow ── */}
            <circle
              cx="160" cy="160" r="34"
              fill="none"
              stroke="rgba(102,214,214,0.06)"
              strokeWidth="30"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "ls-core-breathe 3.5s ease-in-out infinite",
              }}
            />
          </svg>

          {/* ── Central ECAP logotype — layered above SVG ── */}
          <div
            className={`relative z-10 flex flex-col items-center transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ animation: "ls-float 4.5s ease-in-out infinite" }}
          >
            <h1
              style={{
                fontSize: 44,
                fontWeight: 300,
                color: "#ffffff",
                letterSpacing: "0.18em",
                margin: 0,
                lineHeight: 1,
                // Layered text-shadow: cyan bloom + blue haze + drop shadow
                textShadow:
                  "0 0 20px rgba(102,214,214,0.55), 0 0 45px rgba(68,184,243,0.3), 0 2px 15px rgba(0,0,0,0.6)",
              }}
            >
              ECAP
            </h1>

            {/* Decorative rule lines */}
            <div style={{ width: 44, height: 1, margin: "7px 0 5px", background: "linear-gradient(to right, transparent, rgba(102,214,214,0.6), transparent)" }} />
            <div style={{ width: 28, height: 1, marginBottom: 6, background: "linear-gradient(to right, transparent, rgba(143,212,248,0.4), transparent)" }} />

            <p
              style={{
                fontSize: 8.5,
                fontWeight: 400,
                color: "rgba(102,214,214,0.72)",
                letterSpacing: "0.55em",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              ELEVATE
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            PROGRESS BAR + STATUS LABEL
        ════════════════════════════════════════════ */}
        <div
          className={`flex flex-col items-center transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ gap: 10, width: 260 }}
        >
          {/* Track */}
          <div
            style={{
              width: "100%",
              height: 1.5,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Fill — transitions with a smooth ease, giving a "thinking" feel */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: progress + "%",
                background: "linear-gradient(to right, #1A3673, #44B8F3, #66D6D6)",
                borderRadius: 1,
                boxShadow: "0 0 8px rgba(102,214,214,0.7)",
                transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            {/* Shimmer sweep */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)",
                animation: "ls-shimmer 2.2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Pulsing status dot + label */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#66D6D6",
                boxShadow: "0 0 6px rgba(102,214,214,0.9)",
                animation: "ls-blink 1.8s ease-in-out infinite",
              }}
            />
            <p
              style={{
                fontSize: 9.5,
                fontWeight: 300,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.3em",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "rgba(102,214,214,0.65)" }}>AI-Powered</span>
              {" "}Healthcare Analytics
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          KEYFRAMES
          All names are prefixed "ls-" to avoid
          collisions with app-level styles.
      ════════════════════════════════════════════ */}
      <style>{`
        /* Particle + arc rotation */
        @keyframes ls-orbit    { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes ls-spin     { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes ls-spin-rev { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }

        /* Energy pulse — scale + fade outward from core */
        @keyframes ls-pulse {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; }
        }

        /* Core disc breathes gently */
        @keyframes ls-core-breathe {
          0%, 100% { transform: scale(0.85); opacity: 0.5; }
          50%       { transform: scale(1.15); opacity: 1;   }
        }

        /* Logo floats softly up and down */
        @keyframes ls-float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-5px); }
        }

        /* Ambient glow expands and contracts */
        @keyframes ls-glow-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.7; }
          50%       { transform: scale(1.08); opacity: 1;   }
        }

        /* Progress bar shimmer sweep */
        @keyframes ls-shimmer {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(350%);  }
        }

        /* Status dot blink */
        @keyframes ls-blink {
          0%, 100% { opacity: 1;    }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
