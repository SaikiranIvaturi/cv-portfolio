"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { WorkPost, WritingPost } from "@/lib/content";
import { ProjectRow } from "@/components/ProjectRow";
import { IntroCurtain } from "@/components/IntroCurtain";
import {
  fadeUp,
  fadeUpReduced,
  staggerContainer,
  wordStaggerContainer,
  wordVariant,
  wordVariantReduced,
  SESSION_KEY,
} from "@/lib/motion";

interface Props {
  work: WorkPost[];
  writing: WritingPost[];
}

const STACK = [
  "React 19",
  "TypeScript",
  "Redux Toolkit",
  "React Query",
  "Framer Motion",
  "Vite",
  "Tailwind CSS",
  "Okta OIDC",
  "Recharts",
  "Chart.js",
  "MUI",
  "Vitest",
  "Playwright",
  "Python FastAPI",
  "Next.js",
];

function StackMarquee() {
  const items = [...STACK, ...STACK]; // doubled for seamless loop
  return (
    <div
      aria-hidden="true"
      className="marquee-track overflow-hidden -mx-6 px-0 select-none"
    >
      <div className="animate-marquee flex gap-0 whitespace-nowrap">
        {items.map((tech, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-subtle)] px-5"
          >
            {tech}
            <span className="text-[var(--accent)] text-[8px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Word-split animated paragraph ───
function AnimatedIntro({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");
  const variant = prefersReducedMotion ? wordVariantReduced : wordVariant;

  return (
    <motion.p
      variants={prefersReducedMotion ? fadeUpReduced : wordStaggerContainer}
      className="font-[family-name:var(--font-fraunces)] font-normal text-[var(--ink)] leading-[1.3] tracking-[-0.02em] m-0"
      style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={variant}
          className="inline-block"
          style={{
            marginRight: "0.28em",
            willChange: "transform, opacity, filter",
          }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function HomepageClient({ work, writing }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    try {
      const seen = !!sessionStorage.getItem(SESSION_KEY);
      setShouldAnimate(!seen);
      if (!seen) sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      setShouldAnimate(true);
    }
    setMounted(true);
  }, []);

  const sectionVariant: Variants = prefersReducedMotion
    ? fadeUpReduced
    : fadeUp;

  const initialState = !mounted || !shouldAnimate ? false : "hidden";

  return (
    <div className="pt-24 pb-24">
      {shouldAnimate && (
        <IntroCurtain onComplete={() => setIntroDone(true)} lineY={54} />
      )}
      <motion.div
        variants={staggerContainer}
        initial={initialState}
        animate={
          mounted && (!shouldAnimate || introDone) ? "visible" : "hidden"
        }
        className="max-w-[880px] mx-auto px-6"
      >
        {/* ── Intro ── */}
        <motion.section
          variants={prefersReducedMotion ? fadeUpReduced : wordStaggerContainer}
          className="pt-20 pb-20 max-w-[720px] relative"
          aria-label="Introduction"
        >
          {/* Ambient glow behind hero text */}
          <div
            aria-hidden="true"
            className="absolute -top-10 -left-10 w-[420px] h-[260px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, var(--accent-soft) 0%, transparent 70%)",
              filter: "blur(40px)",
              opacity: 0.6,
            }}
          />
          <AnimatedIntro text="I'm Saikiran — a frontend engineer who builds product interfaces that are fast, accessible, and easy to use. I work in React and TypeScript, mostly on tools where the data is complex and the users are busy." />
        </motion.section>

        {/* ── Tech stack marquee ── */}
        <motion.div
          variants={sectionVariant}
          className="mb-24 py-4 border-y border-[var(--rule)]"
        >
          <StackMarquee />
        </motion.div>

        {/* ── Currently ── */}
        <motion.section
          variants={sectionVariant}
          className="mb-24 pl-5 border-l-2 border-[var(--accent)] max-w-[580px]"
          aria-labelledby="currently-heading"
        >
          <h2
            id="currently-heading"
            className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--accent)] mb-3 flex items-center gap-2"
          >
            {/* Pulsing live dot */}
            <span className="relative flex h-[7px] w-[7px] shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[var(--accent)]" />
            </span>
            Currently
          </h2>
          <p className="font-[family-name:var(--font-inter-tight)] text-[16px] text-[var(--ink)] leading-[1.7] m-0">
            Software Engineer II at Carelon &mdash; building internal platforms
            for clinical analytics and care-management workflows. Heavy state,
            role-based access, complex data made legible.
          </p>
        </motion.section>

        {/* ── Selected Work ── */}
        <motion.section
          variants={sectionVariant}
          className="mb-24"
          aria-labelledby="work-heading"
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              id="work-heading"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-subtle)]"
            >
              Selected Work
            </h2>
            <Link
              href="/work"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] hover:text-[var(--accent)] no-underline transition-colors"
            >
              All work &rarr;
            </Link>
          </div>
          <div className="border-t border-[var(--rule)]">
            {work.map((item) => (
              <ProjectRow
                key={item.slug}
                year={item.frontmatter.year}
                title={item.frontmatter.title}
                description={item.frontmatter.description}
                href={`/work/${item.slug}`}
              />
            ))}
          </div>
        </motion.section>

        {/* ── Writing ── */}
        <motion.section
          variants={sectionVariant}
          className="mb-24"
          aria-labelledby="writing-heading"
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              id="writing-heading"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-subtle)]"
            >
              Writing
            </h2>
            <Link
              href="/writing"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] hover:text-[var(--accent)] no-underline transition-colors"
            >
              All writing &rarr;
            </Link>
          </div>
          <div className="border-t border-[var(--rule)]">
            {writing.map((item) => (
              <ProjectRow
                key={item.slug}
                year={new Date(item.frontmatter.date).getFullYear()}
                title={item.frontmatter.title}
                description={item.frontmatter.description}
                href={`/writing/${item.slug}`}
                tag={item.readingTime}
              />
            ))}
          </div>
        </motion.section>

        {/* ── Elsewhere ── */}
        <motion.section
          variants={sectionVariant}
          className="max-w-[480px]"
          aria-label="Contact and links"
        >
          <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-subtle)] mb-4">
            Elsewhere
          </h2>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-muted)] m-0">
            <a
              href="https://github.com/SaikiranIvaturi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-muted)] hover:text-[var(--accent)] no-underline transition-colors"
            >
              GitHub
            </a>
            &nbsp;&middot;&nbsp;
            <a
              href="https://www.linkedin.com/in/saikiran-ivaturi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-muted)] hover:text-[var(--accent)] no-underline transition-colors"
            >
              LinkedIn
            </a>
            &nbsp;&middot;&nbsp;
            <a
              href="mailto:ivaturisaikiran@gmail.com"
              className="text-[var(--ink-muted)] hover:text-[var(--accent)] no-underline transition-colors"
            >
              ivaturisaikiran@gmail.com
            </a>
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
}
