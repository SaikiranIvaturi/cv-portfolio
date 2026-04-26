"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

function LiveDot() {
  return (
    <span className="relative flex h-[6px] w-[6px] shrink-0" aria-hidden="true">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
      <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[var(--accent)]" />
    </span>
  );
}

const EXPERIENCE = [
  {
    period:  "Feb 2023 – Present",
    company: "Carelon Global Solutions",
    role:    "Software Engineer II",
    body:    "Two internal platforms for clinical analytics, cost-of-care tracking, and AI-assisted decision support. Heavy state design, Okta OIDC auth, and role-based access across analyst, admin, and executive tiers.",
  },
  {
    period:  "2021 – 2022",
    company: "BNY Mellon",
    role:    "Associate Software Engineer",
    body:    "Internal tooling for financial operations — migrated a legacy Java Swing data grid to a 100,000-row React implementation with virtual scrolling and canvas-based cell rendering. Shaped how I think about performance as a product problem.",
  },
];

export function AboutClient() {
  const reduced = useReducedMotion();

  return (
    <div className="pt-20">
      {/* ── HERO ─────────────────────────────────────────── */}
      <motion.header
        initial={reduced ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="px-6 md:px-8 pt-12 md:pt-16 pb-10 md:pb-12 border-b-[0.5px] border-[var(--rule)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
      >
        <h1
          className="font-[family-name:var(--font-fraunces)] font-normal uppercase tracking-[-0.04em] leading-[0.88] text-[var(--ink)]"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
        >
          ABOUT
        </h1>
        <div className="flex items-end gap-5 pb-1">
          <Image
            src="/images/avatar.jpeg"
            alt="Saikiran Ivaturi"
            width={72}
            height={72}
            className="rounded-none ring-[0.5px] ring-[var(--rule)] grayscale"
            priority
          />
          <div>
            <p className="meta-label text-[var(--accent)] mb-1">SAIKIRAN IVATURI</p>
            <p className="meta-label">FRONTEND ENGINEER — DELHI</p>
          </div>
        </div>
      </motion.header>

      {/* ── MANIFESTO + DATA ────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
        className="grid md:grid-cols-12 border-b-[0.5px] border-[var(--rule)]"
      >
        {/* Data panel */}
        <div className="md:col-span-4 p-8 lg:p-16 flex flex-col justify-between border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--rule)] bg-[var(--surface)]">
          <div className="flex items-center gap-3 meta-label text-[var(--accent)]">
            <LiveDot />
            STATUS: AVAILABLE
          </div>
          <div className="flex flex-col gap-5 mt-10">
            {[
              ["LOCATION", "DELHI, IN"],
              ["ROLE",     "ENG. II"],
              ["STACK",    "REACT / TS"],
              ["EXP.",     "5 YRS"],
              ["OPEN TO",  "REMOTE"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-baseline border-b-[0.5px] border-[var(--rule)] pb-3"
              >
                <span className="meta-label">{label}</span>
                <span className="font-[family-name:var(--font-fraunces)] text-[17px] text-[var(--accent)] italic">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Intro text */}
        <div className="md:col-span-8 p-8 lg:p-20 bg-[var(--canvas)]">
          <p
            className="font-[family-name:var(--font-fraunces)] font-normal text-[var(--ink)] leading-[1.2] tracking-[-0.02em] mb-10"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
          >
            Frontend engineer based in Delhi. I build internal tools — the kind
            that replace someone&rsquo;s painful spreadsheet workflow with
            something that actually feels good to use.
          </p>
          <div className="editorial-columns font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] leading-relaxed font-light">
            <p className="mb-6">
              I care about the gap between &ldquo;technically works&rdquo; and
              &ldquo;actually good.&rdquo; Most of my career has been spent making
              complex data legible — clinical dashboards, financial grids,
              role-based access systems where getting the rules wrong matters.
            </p>
            <p>
              I work in React and TypeScript. I&rsquo;m obsessive about state
              design, auth flows, accessibility, and code a future colleague can
              read without asking me to explain it.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── EXPERIENCE ──────────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: EASE }}
        aria-labelledby="exp-heading"
      >
        <div className="px-8 py-6 border-b-[0.5px] border-[var(--rule)]">
          <span id="exp-heading" className="meta-label">EXPERIENCE</span>
        </div>
        {EXPERIENCE.map((job, i) => (
          <motion.div
            key={job.company}
            initial={reduced ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: EASE, delay: i * 0.12 }}
            className="grid md:grid-cols-12 border-b-[0.5px] border-[var(--rule)]"
          >
            <div className="md:col-span-4 p-6 md:p-8 lg:p-12 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--rule)] bg-[var(--surface)]">
              <p className="meta-label text-[var(--accent)] mb-3">{job.period}</p>
              <p className="font-[family-name:var(--font-fraunces)] text-[20px] font-normal text-[var(--ink)] mb-1">
                {job.company}
              </p>
              <p className="meta-label">{job.role}</p>
            </div>
            <div className="md:col-span-8 p-6 md:p-8 lg:p-12">
              <p className="font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] leading-relaxed font-light">
                {job.body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── STACK ────────────────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="border-b-[0.5px] border-[var(--rule)]"
        aria-labelledby="stack-heading"
      >
        <div className="px-8 py-6 border-b-[0.5px] border-[var(--rule)]">
          <span id="stack-heading" className="meta-label">STACK</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "LANGUAGES",  items: ["TypeScript", "JavaScript", "HTML5", "CSS3"] },
            { label: "FRAMEWORKS", items: ["React 18/19", "Next.js", "Redux Toolkit", "React Query"] },
            { label: "TOOLING",    items: ["Vite", "Vitest", "Playwright", "Framer Motion"] },
            { label: "PRACTICES",  items: ["OIDC / OAuth2", "WCAG Accessibility", "Perf. optimisation", "CI / CD"] },
          ].map((group, i) => (
            <motion.div
              key={group.label}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
              className={[
                "p-8 border-b-[0.5px] border-[var(--rule)]",
                i < 3 ? "md:border-r-[0.5px]" : "",
              ].join(" ")}
            >
              <p className="meta-label text-[var(--accent)] mb-5">{group.label}</p>
              <ul className="list-none m-0 p-0 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)]">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="px-8 py-16 lg:px-16 lg:py-24"
        aria-labelledby="contact-heading"
      >
        <span className="meta-label text-[var(--accent)] block mb-6">GET IN TOUCH</span>
        <h2
          id="contact-heading"
          className="font-[family-name:var(--font-fraunces)] font-normal leading-[0.88] tracking-[-0.04em] uppercase text-[var(--ink)] mb-10"
          style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
        >
          LET&rsquo;S
          <br />
          <span className="italic text-[var(--accent)]">TALK.</span>
        </h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:ivaturisaikiran@gmail.com"
            className="meta-label bg-[var(--accent)] text-[var(--canvas)] px-8 py-4 no-underline hover:brightness-110 transition-all duration-300"
          >
            SEND EMAIL ↗
          </a>
          <a
            href="https://www.linkedin.com/in/saikiran-ivaturi/"
            target="_blank"
            rel="noopener noreferrer"
            className="meta-label border-[0.5px] border-[var(--rule)] px-8 py-4 no-underline hover:bg-[var(--surface)] transition-all duration-300"
          >
            LINKEDIN ↗
          </a>
          <a
            href="https://github.com/SaikiranIvaturi"
            target="_blank"
            rel="noopener noreferrer"
            className="meta-label border-[0.5px] border-[var(--rule)] px-8 py-4 no-underline hover:bg-[var(--surface)] transition-all duration-300"
          >
            GITHUB ↗
          </a>
        </div>
      </motion.section>
    </div>
  );
}
