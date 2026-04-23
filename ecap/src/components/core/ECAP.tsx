import {
  DollarSign,
  FileText,
  GitBranch,
  Lightbulb,
  LucideIcon,
  TrendingDown,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Capability {
  title: string;
  label: string;
  icon: LucideIcon;
}

interface Stat {
  value: string;
  label: string;
}

interface Position {
  top: string;
  left: string;
}
const capabilities: Capability[] = [
  {
    title: "Cost Analytics",
    label: "Real-time expense tracking across all lines of business",
    icon: DollarSign,
  },
  {
    title: "AI-Driven Insights",
    label: "Auto-detected anomalies and predictive trend analysis",
    icon: Lightbulb,
  },
  {
    title: "Savings Optimization",
    label: "Track and forecast cost-of-care reduction initiatives",
    icon: TrendingDown,
  },
  {
    title: "Executive Intelligence",
    label: "Leadership notes, decisions, and strategic updates",
    icon: FileText,
  },
  {
    title: "Decision Support",
    label: "Guided clinical and financial decision pathways",
    icon: GitBranch,
  },
];

const stats: Stat[] = [
  { value: "$5.1B", label: "Target CoC Savings" },
  { value: "4.55M", label: "Member Months" },
  { value: "82.8%", label: "Medical Loss Ratio" },
  { value: "68%", label: "Savings on Track" },
];

const statPositions: Position[] = [
  { top: "6%", left: "60%" },
  { top: "60%", left: "25%" },
  { top: "66%", left: "62%" },
  { top: "14%", left: "25%" },
];

export default function ECAPElevateHomepage(): JSX.Element {
  const [active, setActive] = useState<number>(0);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % capabilities.length),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#1A3673",
        // minHeight: "100vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "white",
        overflow: "hidden",
        position: "relative",
        borderRadius: 40,
      }}
    >
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Sora:wght@700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }

          .cap-row {
            display: flex; align-items: center; gap: 8px;
            padding: 10px 16px; border-radius: 28px;
            border: 1.5px solid #1A56CC;
            background: #fff;
            color: #06102E;
            cursor: pointer;
            transition: background 0.25s, transform 0.2s, border-color 0.2s;
          }
          .cap-row.active {
            background: #EAF2FF;
            border-color: #4A90E2;
            color: #1A56CC;
            transform: translateX(4px);
          }
          .cap-row:hover:not(.active) { background: #F5F8FF; border-color: #4A90E2; }
          .cap-icon {
            width: 36px; height: 36px; border-radius: 18px;
            background: linear-gradient(135deg, #1A56CC, #4A90E2);
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; color: #fff;
            box-shadow: 0 2px 8px rgba(26,86,204,0.15);
          }
          .cta-btn {
            padding: 12px 32px;
            background: linear-gradient(135deg, #1A56CC, #4A90E2);
            border: none; border-radius: 32px;
            color: #fff; font-size: 16px; font-weight: 700;
            cursor: pointer; letter-spacing: 0.3px;
            box-shadow: 0 4px 24px rgba(26,86,204,0.25);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(26,86,204,0.35); }
          .outline-btn {
            padding: 12px 28px; background: transparent;
            border: 1.5px solid #1A56CC; border-radius: 32px;
            color: #1A56CC; font-size: 16px; font-weight: 700; cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
          }
          .outline-btn:hover { border-color: #4A90E2; background: #EAF2FF; }
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .f1 { animation: fadeSlide 0.6s 0s ease both; }
          .f2 { animation: fadeSlide 0.6s 0.15s ease both; }
          .f3 { animation: fadeSlide 0.6s 0.3s ease both; }
          .f4 { animation: fadeSlide 0.6s 0.45s ease both; }
          @keyframes spin-slow { to { transform: rotate(360deg); } }
          @keyframes spin-rev { to { transform: rotate(-360deg); } }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes pulse-ring {
            0%, 100% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.06); opacity: 1; }
          }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .f1 { animation: fadeSlide 0.6s 0s ease both; }
        .f2 { animation: fadeSlide 0.6s 0.15s ease both; }
        .f3 { animation: fadeSlide 0.6s 0.3s ease both; }
        .f4 { animation: fadeSlide 0.6s 0.45s ease both; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes spin-rev { to { transform: rotate(-360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .ring1 { animation: spin-slow 18s linear infinite; }
        .ring2 { animation: spin-rev 12s linear infinite; }
        .ring3 { animation: spin-slow 8s linear infinite; }
        .orb-float { animation: float 4s ease-in-out infinite; }
        .pulse { animation: pulse-ring 2.5s ease-in-out infinite; }
      `}</style>

      {/* BG Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(ellipse at 15% 50%, rgba(19,64,168,0.35) 0%, transparent 55%),
                       radial-gradient(ellipse at 85% 20%, rgba(74,144,226,0.2) 0%, transparent 45%),
                       radial-gradient(ellipse at 60% 90%, rgba(10,30,90,0.5) 0%, transparent 50%)`,
        }}
      />

      {/* BG Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(74,144,226,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(74,144,226,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          flex: 1,
          padding: "24px 48px",
          gap: 60,
          width: "90%",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Left */}
        <div style={{ flex: 1, maxWidth: 520 }}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 mt-6 leading-tight">
            Enterprise Cost of Care Analytics
          </h1>

          <p className="text-l text-white/90 leading-relaxed max-w-xl mb-4">
            A unified intelligence platform that brings together cost-of-care
            analytics, AI-driven insights, and executive decision support —
            empowering Elevance Health to optimize outcomes at scale.
          </p>

          {/* Capabilities Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90">
              Capabilities
            </h2>
            <div className="space-y-4">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <capability.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-white/70 text-xs">{capability.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Animated Visual */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: 480,
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(74,144,226,0.14) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Ring 1 */}
          <div
            className="ring1"
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: "50%",
              border: "1px dashed rgba(74,144,226,0.22)",
            }}
          />

          {/* Ring 2 */}
          <div
            className="ring2"
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: "1.5px solid rgba(74,144,226,0.16)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#4a90e2",
                boxShadow: "0 0 14px #4a90e2",
              }}
            />
          </div>

          {/* Ring 3 */}
          <div
            className="ring3"
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "1px solid rgba(125,184,247,0.13)",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#7db8f7",
                boxShadow: "0 0 10px #7db8f7",
              }}
            />
          </div>

          {/* Center Orb */}
          <div
            className="orb-float"
            style={{
              position: "relative",
              zIndex: 2,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2) 0%, rgba(74,144,226,0.4) 35%, rgba(10,30,90,0.85) 100%)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              boxShadow:
                "0 0 60px rgba(74,144,226,0.5), 0 0 120px rgba(74,144,226,0.2), inset 0 0 30px rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
            }}
          >
            📊
            <div
              className="pulse"
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: "2px solid rgba(74,144,226,0.4)",
              }}
            />
          </div>

          {/* Floating Stat Cards */}
          {stats.map((s: Stat, i: number) => (
            <div
              key={s.label}
              style={{
                position: "absolute",
                ...statPositions[i],
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "10px 16px",
                textAlign: "center",
                animation: `float ${3.5 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`,
                minWidth: 110,
              }}
            >
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#7db8f7",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 3,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}

          {/* Orbiting Particles */}
          {Array.from({ length: 8 }).map((_: unknown, i: number) => {
            const angle: number = (i / 8) * 2 * Math.PI + tick * 0.008;
            const r: number = 170 + Math.sin(tick * 0.015 + i) * 14;
            const x: number = Math.cos(angle) * r;
            const y: number = Math.sin(angle) * r;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  width: i % 3 === 0 ? 5 : 3,
                  height: i % 3 === 0 ? 5 : 3,
                  borderRadius: "50%",
                  background: i % 2 === 0 ? "#4a90e2" : "#7db8f7",
                  boxShadow: `0 0 ${i % 3 === 0 ? 8 : 5}px currentColor`,
                  opacity: 0.5 + Math.sin(tick * 0.02 + i) * 0.35,
                  transform: "translate(-50%, -50%)",
                  transition: "left 0.05s linear, top 0.05s linear",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "12px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          © 2026 Elevance Health. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms of Use", "Support"].map((l: string) => (
            <span
              key={l}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.35)",
                cursor: "pointer",
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
