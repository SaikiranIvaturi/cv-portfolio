"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { WorkPost, WritingPost } from "@/lib/content";
import { IntroCurtain } from "@/components/IntroCurtain";
import { SESSION_KEY } from "@/lib/motion";

interface Props {
  work: WorkPost[];
  writing: WritingPost[];
}

const CATEGORY_MAP: Record<string, string> = {
  "ecap-elevate":    "HEALTHCARE",
  "cost-of-care-ai": "HEALTHCARE · AI",
  "jsoncraft":       "SIDE PROJECT",
};

const EASE = [0.16, 1, 0.3, 1] as const;

const BELIEFS = [
  { num: "01", text: "Performance is a product decision, not an engineering footnote." },
  { num: "02", text: "Design state before you write a single component." },
  { num: "03", text: "The best auth flow is the one users never notice." },
  { num: "04", text: "I'll refactor it now or someone else will suffer for it later." },
];

function LiveDot() {
  return (
    <span className="relative flex h-[6px] w-[6px] shrink-0" aria-hidden="true">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
      <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[var(--accent)]" />
    </span>
  );
}

export function HomepageClient({ work, writing }: Props) {
  const reduced = useReducedMotion();
  const [mounted, setMounted]           = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [introDone, setIntroDone]       = useState(false);

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

  const show = mounted && (!shouldAnimate || introDone);

  return (
    <div>
      {shouldAnimate && (
        <IntroCurtain onComplete={() => setIntroDone(true)} lineY={54} />
      )}

      {/* ── HERO ─────────────────────────────────────────── */}
      <motion.header
        initial={reduced || !shouldAnimate ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-[50svh] md:min-h-[70svh] pt-20 px-6 md:px-8 flex flex-col justify-end pb-10 md:pb-12 border-b-[0.5px] border-[var(--rule)] overflow-hidden"
        aria-label="Introduction"
      >
        {/* Background watermark — drops down on load */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-8 right-6 font-[family-name:var(--font-fraunces)] font-bold leading-none pointer-events-none select-none"
          style={{ fontSize: "clamp(3.5rem, 11vw, 12rem)", color: "var(--ink)" }}
          initial={reduced ? false : { opacity: 0, y: -500 }}
          animate={mounted ? { opacity: 0.03, y: 0 } : { opacity: 0, y: -500 }}
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          FE
        </motion.span>

        {/* Status badge */}
        <div className="absolute top-28 right-6 md:right-8 flex flex-col items-end gap-2">
          <span className="meta-label opacity-60">SYS.REQ</span>
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
        </div>

        {/* Meta bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-[0.5px] border-[var(--rule)] pb-4 mb-6">
          <span className="meta-label">FRONTEND ENGINEER // DELHI</span>
          <span className="meta-label opacity-60 mt-2 sm:mt-0">28.6139° N, 77.2090° E</span>
        </div>

        {/* Name */}
        <motion.h1
          initial={reduced || !shouldAnimate ? false : { opacity: 0, y: 80 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="font-[family-name:var(--font-fraunces)] font-normal leading-[0.85] tracking-[-0.04em] uppercase text-[var(--ink)] m-0"
          style={{ fontSize: "clamp(4.5rem, 22vw, 16rem)" }}
        >
          SAI
          <br />
          <span className="text-[var(--accent)] italic font-light">KIRAN</span>
        </motion.h1>
      </motion.header>

      {/* ── WHO I AM ─────────────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 48 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        className="grid md:grid-cols-12 border-b-[0.5px] border-[var(--rule)]"
        aria-label="About"
      >
        {/* Left — story */}
        <div className="md:col-span-8 p-8 lg:p-16 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--rule)] bg-[var(--canvas)]">
          <span className="meta-label text-[var(--accent)] block mb-8">WHO I AM</span>

          <h2
            className="font-[family-name:var(--font-fraunces)] font-normal leading-[1.1] tracking-[-0.02em] text-[var(--ink)] mb-10"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            I build interfaces for systems where the user is an expert
            who doesn&rsquo;t want to be slowed down.
          </h2>

          <div className="editorial-columns font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] leading-relaxed font-light space-y-5">
            <p>
              Based in Delhi. Five years of frontend engineering across healthcare
              and finance — the industries where data is dense, stakes are real, and
              &ldquo;close enough&rdquo; breaks trust. I started at BNY Mellon migrating a
              legacy Java Swing data grid to React. 100,000 rows, canvas cell
              rendering, virtual scroll. That project taught me performance isn&rsquo;t a
              metric — it&rsquo;s a product decision.
            </p>
            <p>
              Now at Carelon Global Solutions (Elevance Health), building clinical
              analytics platforms: cost dashboards, AI-assisted decision support,
              role-based access across analyst, admin, and executive tiers. I own
              the frontend architecture end-to-end.
            </p>
          </div>

          <Link
            href="/about"
            className="mt-10 inline-block border-[0.5px] border-[var(--rule)] px-8 py-3.5 btn-outline no-underline hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all duration-300"
          >
            FULL PROFILE →
          </Link>
        </div>

        {/* Right — presence panel */}
        <div className="md:col-span-4 p-8 lg:p-10 bg-[var(--surface)] flex flex-col justify-between gap-10">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="group relative photo-wrap overflow-hidden shrink-0 w-[88px] h-[88px]">
              <span
                aria-hidden="true"
                className="absolute inset-0 z-10 pointer-events-none border border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <Image
                src="/images/avatar.jpeg"
                alt="Saikiran Ivaturi"
                width={88}
                height={88}
                className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.05] transition-all duration-700 ease-out"
              />
            </div>
            <div>
              <p className="meta-label text-[var(--accent)] mb-0.5">SAIKIRAN IVATURI</p>
              <p className="meta-label opacity-70">DELHI, INDIA</p>
            </div>
          </div>

          {/* Status data */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 meta-label text-[var(--accent)] pb-4 border-b-[0.5px] border-[var(--rule)]">
              <LiveDot />
              OPEN TO NEW ROLES
            </div>
            {[
              ["ROLE",   "SOFTWARE ENGINEER II"],
              ["AT",     "CARELON / ELEVANCE"],
              ["EXP.",   "5 YEARS"],
              ["STACK",  "REACT · TS · REDUX"],
              ["OPEN TO","SWE / REMOTE"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-baseline border-b-[0.5px] border-[var(--rule)] pb-3">
                <span className="meta-label">{label}</span>
                <span className="font-[family-name:var(--font-fraunces)] text-[15px] text-[var(--ink)] italic text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── BELIEFS ──────────────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="border-b-[0.5px] border-[var(--rule)]"
        aria-label="Engineering beliefs"
      >
        <div className="px-6 md:px-8 py-5 border-b-[0.5px] border-[var(--rule)]">
          <span className="meta-label">HOW I WORK</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {BELIEFS.map(({ num, text }, i) => (
            <motion.div
              key={num}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.09 }}
              className={[
                "p-8 border-b-[0.5px] border-[var(--rule)]",
                i < 3 ? "lg:border-r-[0.5px]" : "",
                i % 2 === 0 ? "sm:border-r-[0.5px] lg:border-r-[0.5px]" : "",
              ].join(" ")}
            >
              <span className="meta-label text-[var(--accent)] block mb-5">{num}</span>
              <p className="font-[family-name:var(--font-fraunces)] text-[19px] font-normal leading-[1.3] text-[var(--ink)]">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── SKILLS MARQUEE ───────────────────────────────── */}
      <div
        className="marquee-track border-b-[0.5px] border-[var(--rule)] overflow-hidden py-3 select-none"
        aria-hidden="true"
      >
        <div className="animate-marquee flex items-center gap-0 whitespace-nowrap">
          {[
            "REACT", "TYPESCRIPT", "NEXT.JS", "REDUX TOOLKIT", "VITE",
            "REACT QUERY", "FRAMER MOTION", "TAILWIND CSS", "VITEST",
            "PLAYWRIGHT", "OIDC / OAUTH2", "FIGMA", "GIT", "OKTA",
            "REACT", "TYPESCRIPT", "NEXT.JS", "REDUX TOOLKIT", "VITE",
            "REACT QUERY", "FRAMER MOTION", "TAILWIND CSS", "VITEST",
            "PLAYWRIGHT", "OIDC / OAUTH2", "FIGMA", "GIT", "OKTA",
          ].map((skill, i) => (
            <span key={i} className="flex items-center">
              <span
                className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: "var(--ink-muted)" }}
              >
                {skill}
              </span>
              <span
                className="mx-6 text-[var(--accent)]"
                style={{ opacity: 0.5, fontSize: "9px" }}
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── WORK PREVIEW ─────────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="border-b-[0.5px] border-[var(--rule)]"
        aria-labelledby="work-preview-heading"
      >
        <div className="px-6 md:px-8 py-5 border-b-[0.5px] border-[var(--rule)] flex items-center justify-between">
          <span id="work-preview-heading" className="meta-label">RECENT WORK</span>
          <Link href="/work" className="meta-label no-underline hover:text-[var(--accent)] transition-colors">
            ALL WORK →
          </Link>
        </div>
        {work.map((post, i) => {
          const num = String(i + 1).padStart(2, "0");
          const cat = CATEGORY_MAP[post.slug] ?? "ENGINEERING";
          return (
            <motion.div
              key={post.slug}
              initial={reduced ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
            >
              <Link
                href={`/work/${post.slug}`}
                className="group flex items-baseline gap-4 md:gap-6 px-6 md:px-8 py-5 border-b-[0.5px] border-[var(--rule)] no-underline hover:bg-[var(--surface)] active:bg-[var(--surface)] transition-colors duration-200"
                data-cursor="work"
              >
                <span className="meta-label w-8 shrink-0">{num}</span>
                <span className="meta-label w-24 md:w-32 shrink-0 text-[var(--accent)]">{cat}</span>
                <span className="font-[family-name:var(--font-fraunces)] text-[18px] md:text-[20px] font-normal text-[var(--ink)] uppercase tracking-[-0.02em] flex-1 min-w-0">
                  <span className="project-title">{post.frontmatter.title}</span>
                </span>
                <span className="meta-label shrink-0 hidden sm:block">{post.frontmatter.year}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.section>

      {/* ── WRITING ───────────────────────────────────────── */}
      {writing.length > 0 && (
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="border-b-[0.5px] border-[var(--rule)]"
          aria-labelledby="writing-heading"
        >
          <div className="px-6 md:px-8 py-5 border-b-[0.5px] border-[var(--rule)] flex items-center justify-between">
            <span id="writing-heading" className="meta-label">WRITING</span>
            <Link href="/writing" className="meta-label no-underline hover:text-[var(--accent)] transition-colors">
              ALL WRITING →
            </Link>
          </div>
          {writing.map((item, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={item.slug}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
              >
                <Link
                  href={`/writing/${item.slug}`}
                  className="group flex items-baseline gap-4 md:gap-6 px-6 md:px-8 py-5 border-b-[0.5px] border-[var(--rule)] no-underline hover:bg-[var(--surface)] active:bg-[var(--surface)] transition-colors duration-200"
                >
                  <span className="meta-label w-8 shrink-0">{num}</span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[18px] md:text-[20px] font-normal text-[var(--ink)] uppercase tracking-[-0.02em] flex-1 min-w-0">
                    <span className="project-title">{item.frontmatter.title}</span>
                  </span>
                  <span className="meta-label shrink-0">{item.readingTime}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.section>
      )}

      {/* ── CONTACT ───────────────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="px-6 md:px-8 py-16 lg:px-20 lg:py-28"
        aria-labelledby="contact-heading"
      >
        <span className="meta-label text-[var(--accent)] block mb-6">LET&rsquo;S TALK</span>
        <h2
          id="contact-heading"
          className="font-[family-name:var(--font-fraunces)] font-normal leading-[0.85] tracking-[-0.04em] uppercase text-[var(--ink)] mb-12"
          style={{ fontSize: "clamp(3rem, 10vw, 10rem)" }}
        >
          OPEN TO
          <br />
          <span className="italic text-[var(--accent)]">NEW ROLES</span>
        </h2>
        <p className="font-[family-name:var(--font-inter-tight)] text-[18px] text-[var(--ink-muted)] max-w-[500px] leading-relaxed mb-12 font-light">
          Open to software engineer roles — remote or hybrid. Contract
          work welcome. I reply to every email that deserves one.
        </p>
        <div className="flex flex-wrap gap-4">
          <motion.a
            href="mailto:ivaturisaikiran@gmail.com"
            whileTap={{ scale: 0.96 }}
            className="btn-primary bg-[var(--accent)] px-8 py-4 no-underline hover:brightness-110 transition-all duration-300"
          >
            SEND MESSAGE ↗
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/saikiran-ivaturi/"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.96 }}
            className="btn-outline border-[0.5px] border-[var(--rule)] px-8 py-4 no-underline hover:bg-[var(--surface)] transition-all duration-300"
          >
            LINKEDIN ↗
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
