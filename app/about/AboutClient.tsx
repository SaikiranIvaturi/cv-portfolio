"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUp,
  fadeUpReduced,
  scaleReveal,
  staggerContainer,
} from "@/lib/motion";
import { PageHeading } from "@/components/PageHeading";

export function AboutClient() {
  const reduced = useReducedMotion();
  const item = reduced ? fadeUpReduced : fadeUp;
  const scale = reduced ? fadeUpReduced : scaleReveal;

  return (
    <div className="pt-24 pb-28 px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-[880px] mx-auto"
      >
        {/* Header — avatar + heading side by side */}
        <div className="pt-14 pb-16 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
          <motion.div variants={item} className="shrink-0">
            <Image
              src="/images/avatar.jpeg"
              alt="Saikiran Ivaturi"
              width={88}
              height={88}
              className="rounded-full ring-2 ring-[var(--rule)]"
              priority
            />
          </motion.div>
          <PageHeading>About</PageHeading>
        </div>

        {/* Intro statement */}
        <motion.p
          variants={item}
          className="font-[family-name:var(--font-fraunces)] text-[22px] text-[var(--ink)] leading-[1.55] max-w-[640px] mb-16"
        >
          Frontend engineer based in Delhi. I build internal tools — the kind
          that replace someone&rsquo;s painful spreadsheet workflow with
          something that actually feels good to use.
        </motion.p>

        {/* Experience timeline */}
        <motion.div variants={item} className="mb-16">
          <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-subtle)] mb-8">
            Experience
          </h2>
          <div className="border-t border-[var(--rule)]">
            {/* Carelon */}
            <div className="py-8 border-b border-[var(--rule)] grid sm:grid-cols-[200px_1fr] gap-4 sm:gap-10">
              <div>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--accent)] mb-1">
                  2022 – Present
                </p>
                <p className="font-[family-name:var(--font-inter-tight)] text-[14px] text-[var(--ink)]">
                  Carelon Global Solutions
                </p>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)] mt-1">
                  Software Engineer II
                </p>
              </div>
              <p className="font-[family-name:var(--font-inter-tight)] text-[16px] text-[var(--ink-muted)] leading-[1.7]">
                Software Engineer II at Carelon — two internal platforms for
                clinical analytics, cost-of-care tracking, and AI-assisted
                decision support. Heavy state design, Okta OIDC auth, and
                role-based access across analyst, admin, and executive tiers.
              </p>
            </div>
            {/* BNY Mellon */}
            <div className="py-8 border-b border-[var(--rule)] grid sm:grid-cols-[200px_1fr] gap-4 sm:gap-10">
              <div>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--accent)] mb-1">
                  2021 – 2022
                </p>
                <p className="font-[family-name:var(--font-inter-tight)] text-[14px] text-[var(--ink)]">
                  BNY Mellon
                </p>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)] mt-1">
                  Associate Software Engineer
                </p>
              </div>
              <p className="font-[family-name:var(--font-inter-tight)] text-[16px] text-[var(--ink-muted)] leading-[1.7]">
                Internal tooling for financial operations — migrated a legacy
                Java Swing data grid to a 100,000-row React implementation with
                virtual scrolling and canvas-based cell rendering. Shaped how I
                think about performance as a product problem.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stack + approach cards */}
        <motion.div
          variants={scale}
          className="mb-16 grid sm:grid-cols-2 gap-4"
        >
          <div className="p-6 bg-[var(--surface)] border border-[var(--rule)] rounded-sm">
            <h3 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-4">
              Stack
            </h3>
            <p className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)] leading-[1.7]">
              React · TypeScript · Redux Toolkit · React Query · Vite · Tailwind
              CSS · Framer Motion · Okta OIDC
            </p>
          </div>
          <div className="p-6 bg-[var(--surface)] border border-[var(--rule)] rounded-sm">
            <h3 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-4">
              What I care about
            </h3>
            <p className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)] leading-[1.7]">
              State design, auth flows, accessibility from the start, and code a
              future colleague can read without asking me.
            </p>
          </div>
        </motion.div>

        <motion.span
          variants={item}
          className="block text-[var(--accent)] text-[16px] mb-14"
          aria-hidden="true"
        >
          ✦
        </motion.span>

        {/* Contact */}
        <motion.section variants={item} aria-label="Contact">
          <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-subtle)] mb-5">
            Get in touch
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="mailto:ivaturisaikiran@gmail.com"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--accent)] no-underline hover:underline"
            >
              ivaturisaikiran@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/saikiran-ivaturi/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-muted)] no-underline hover:text-[var(--accent)] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/SaikiranIvaturi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-muted)] no-underline hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
