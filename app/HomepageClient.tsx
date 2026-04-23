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

// ─── Word-split animated paragraph ───
function AnimatedIntro({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");
  const variant = prefersReducedMotion ? wordVariantReduced : wordVariant;

  return (
    <motion.p
      variants={prefersReducedMotion ? fadeUpReduced : wordStaggerContainer}
      className="font-[family-name:var(--font-fraunces)] text-[28px] sm:text-[36px] font-normal text-[var(--ink)] leading-[1.35] tracking-[-0.01em] m-0"
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

  // Before mount: render at final state (no animation) to avoid hydration flash.
  // After mount: only animate if first visit this session.
  const initialState = !mounted || !shouldAnimate ? false : "hidden";

  return (
    <div className="pt-24 pb-16">
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
        {/* ─── Intro band with word-split ─── */}
        <motion.section
          variants={prefersReducedMotion ? fadeUpReduced : wordStaggerContainer}
          className="pt-16 pb-14 max-w-[640px]"
          aria-label="Introduction"
        >
          <AnimatedIntro text="I'm Saikiran — a frontend engineer who builds product interfaces that are fast, accessible, and easy to use. I work in React and TypeScript, mostly on tools where the data is complex and the users are busy." />
        </motion.section>

        <motion.span
          variants={sectionVariant}
          className="block text-[var(--accent)] text-[16px] mb-12"
          aria-hidden="true"
        >
          ✦
        </motion.span>

        {/* ─── Currently ─── */}
        <motion.section
          variants={sectionVariant}
          className="mb-16 max-w-[640px]"
          aria-labelledby="currently-heading"
        >
          <h2
            id="currently-heading"
            className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-3 flex items-center gap-2"
          >
            <span
              className="inline-block w-2 h-2 rounded-full bg-[var(--accent)]"
              aria-hidden="true"
            />
            Currently
          </h2>
          <p className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)] leading-[1.7] m-0">
            Frontend lead on ECAP-Elevate and Cost of Care AI at Carelon &mdash;
            internal platforms for clinical analytics and care-management
            workflows. Heavy state, role-based access, complex data made
            legible.
          </p>
        </motion.section>

        {/* ─── Selected Work ─── */}
        <motion.section
          variants={sectionVariant}
          className="mb-16"
          aria-labelledby="work-heading"
        >
          <h2
            id="work-heading"
            className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-1"
          >
            Selected Work
          </h2>
          <div className="max-w-[720px]">
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
          <div className="mt-5 border-t border-[var(--rule)]">
            <Link
              href="/work"
              className="inline-block font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] hover:text-[var(--accent)] mt-4 no-underline"
            >
              All work &rarr;
            </Link>
          </div>
        </motion.section>

        <motion.span
          variants={sectionVariant}
          className="block text-[var(--accent)] text-[16px] mb-12"
          aria-hidden="true"
        >
          ✦
        </motion.span>

        {/* ─── Writing ─── */}
        <motion.section
          variants={sectionVariant}
          className="mb-16"
          aria-labelledby="writing-heading"
        >
          <h2
            id="writing-heading"
            className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-1"
          >
            Writing
          </h2>
          <div className="max-w-[720px]">
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
          <div className="mt-5 border-t border-[var(--rule)]">
            <Link
              href="/writing"
              className="inline-block font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] hover:text-[var(--accent)] mt-4 no-underline"
            >
              All writing &rarr;
            </Link>
          </div>
        </motion.section>

        {/* ─── Elsewhere ─── */}
        <motion.section
          variants={sectionVariant}
          className="max-w-[640px]"
          aria-label="Contact and links"
        >
          <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-3">
            Elsewhere
          </h2>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-muted)] m-0">
            <a
              href="https://github.com/SaikiranIvaturi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-muted)] hover:text-[var(--accent)] no-underline"
            >
              GitHub
            </a>
            &nbsp;&middot;&nbsp;
            <a
              href="https://www.linkedin.com/in/saikiran-ivaturi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-muted)] hover:text-[var(--accent)] no-underline"
            >
              LinkedIn
            </a>
            &nbsp;&middot;&nbsp;
            <a
              href="mailto:ivaturisaikiran@gmail.com"
              className="text-[var(--ink-muted)] hover:text-[var(--accent)] no-underline"
            >
              ivaturisaikiran@gmail.com
            </a>
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
}
