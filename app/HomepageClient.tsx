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

const WORK_IMAGES: Record<string, string> = {
  "ecap-elevate":  "/images/work/cost-of-care-ai.png",
  "jsoncraft":     "/images/projects/jsoncraft.png",
};

const CATEGORY_MAP: Record<string, string> = {
  "ecap-elevate":    "HEALTHCARE",
  "cost-of-care-ai": "HEALTHCARE / AI",
  "jsoncraft":       "PERSONAL PROJECT",
};

const EASE = [0.16, 1, 0.3, 1] as const;

function LiveDot() {
  return (
    <span className="relative flex h-[6px] w-[6px] shrink-0" aria-hidden="true">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
      <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[var(--accent)]" />
    </span>
  );
}

// ── Full-bleed project section ──────────────────────────────
function ProjectSection({
  post,
  index,
}: {
  post: WorkPost;
  index: number;
}) {
  const imageLeft = index % 2 === 1;
  const image = WORK_IMAGES[post.slug];
  const category = CATEGORY_MAP[post.slug] ?? "ENGINEERING";
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link href={`/work/${post.slug}`} className="no-underline block group">
      <motion.section
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={[
          "grid md:grid-cols-12 border-b-[0.5px] border-[var(--rule)] cursor-pointer overflow-hidden",
          index === 0 ? "bg-[var(--canvas)]" : "bg-[var(--surface)]",
        ].join(" ")}
      >
        {/* Text panel */}
        <div
          className={[
            "md:col-span-7 p-8 lg:p-20 flex flex-col justify-between min-h-[360px] md:min-h-[500px]",
            imageLeft
              ? "md:order-2 md:border-l-[0.5px]"
              : "border-b-[0.5px] md:border-b-0 md:border-r-[0.5px]",
            "border-[var(--rule)]",
          ].join(" ")}
        >
          <div className="flex justify-between items-start">
            <span className="meta-label text-[var(--accent)]">
              {num} / {category}
            </span>
            <span className="meta-label">{post.frontmatter.year}</span>
          </div>

          <div>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-normal leading-[0.92] uppercase tracking-[-0.03em] text-[var(--ink)] mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              <span className="project-title">{post.frontmatter.title}</span>
            </h2>
            <p className="font-[family-name:var(--font-inter-tight)] text-[17px] max-w-lg text-[var(--ink-muted)] leading-relaxed font-light">
              {post.frontmatter.description}
            </p>
          </div>
        </div>

        {/* Image panel */}
        <div
          className={[
            "md:col-span-5 h-[42vh] md:h-auto overflow-hidden bg-[var(--canvas)] relative flex items-center justify-center",
            imageLeft ? "md:order-1" : "",
          ].join(" ")}
        >
          {image ? (
            <Image
              src={image}
              alt={post.frontmatter.title}
              fill
              className="object-cover grayscale project-img opacity-60 md:opacity-30 transition-all duration-[1200ms] ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          ) : (
            <>
              <span
                aria-hidden="true"
                className="font-[family-name:var(--font-fraunces)] font-bold text-[var(--ink)] pointer-events-none select-none opacity-[0.04] transition-opacity duration-700 group-hover:opacity-[0.08]"
                style={{ fontSize: "clamp(6rem, 20vw, 18rem)", lineHeight: 1 }}
              >
                {num}
              </span>
              <div className="absolute top-6 left-6 meta-label border-[0.5px] border-[var(--rule)] px-3 py-2">
                REF. {post.frontmatter.year}-{num}
              </div>
            </>
          )}
        </div>
      </motion.section>
    </Link>
  );
}

// ── Homepage ────────────────────────────────────────────────
export function HomepageClient({ work, writing }: Props) {
  const reduced = useReducedMotion();
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

  const show = mounted && (!shouldAnimate || introDone);

  const featured = work.slice(0, 2);
  const indexed  = work.slice(2);

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
        className="relative min-h-[100svh] pt-20 px-6 md:px-8 flex flex-col justify-end pb-10 md:pb-12 border-b-[0.5px] border-[var(--rule)] overflow-hidden"
        aria-label="Introduction"
      >
        {/* Background watermark */}
        <span
          aria-hidden="true"
          className="absolute top-16 right-6 font-[family-name:var(--font-fraunces)] font-bold leading-none pointer-events-none select-none"
          style={{
            fontSize: "clamp(8rem, 25vw, 28rem)",
            color: "var(--ink)",
            opacity: 0.025,
          }}
        >
          FE
        </span>

        {/* Status badge */}
        <div className="absolute top-28 right-6 md:right-8 flex flex-col items-end gap-2">
          <span className="meta-label opacity-40">SYS.REQ</span>
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
        </div>

        {/* Meta bar above name */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-[0.5px] border-[var(--rule)] pb-4 mb-6">
          <span className="meta-label">FRONTEND ENGINEER // DELHI</span>
          <span className="meta-label opacity-40 mt-2 sm:mt-0">
            28.6139° N, 77.2090° E
          </span>
        </div>

        {/* Name — the logo moment */}
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

      {/* ── FEATURED WORK ─────────────────────────────────── */}
      {featured.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={reduced ? false : { opacity: 0, y: 48 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.2 }}
        >
          <ProjectSection post={post} index={i} />
        </motion.div>
      ))}

      {/* ── MANIFESTO + STATUS ────────────────────────────── */}
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="grid md:grid-cols-12 border-b-[0.5px] border-[var(--rule)]"
        aria-label="About"
      >
        {/* Left: data panel */}
        <div className="md:col-span-4 p-8 lg:p-16 flex flex-col justify-between border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--rule)] bg-[var(--surface)]">
          <div className="flex items-center gap-3 meta-label text-[var(--accent)]">
            <LiveDot />
            STATUS: AVAILABLE
          </div>
          <div className="flex flex-col gap-5 mt-12">
            {[
              ["LOCATION",  "DELHI '26"],
              ["FOCUS",     "FRONTEND"],
              ["EXP.",      "5 YEARS"],
              ["OPEN TO",   "REMOTE"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-baseline border-b-[0.5px] border-[var(--rule)] pb-3"
              >
                <span className="meta-label">{label}</span>
                <span className="font-[family-name:var(--font-fraunces)] text-[18px] text-[var(--accent)] italic">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: manifesto */}
        <div className="md:col-span-8 p-8 lg:p-20 bg-[var(--canvas)]">
          <h2
            className="font-[family-name:var(--font-fraunces)] font-normal leading-[0.85] tracking-[-0.04em] uppercase text-[var(--ink)] mb-16"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            BUILDING
            <br />
            <span className="italic text-[var(--accent)]">BETTER</span>
            <br />
            TOOLS.
          </h2>
          <div className="editorial-columns font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] leading-relaxed font-light">
            <p className="mb-6">
              I build interfaces for complex systems — dashboards where the data
              is dense, auth flows where a mistake has consequences, and tools
              where the user is an expert who doesn&rsquo;t want to be slowed down.
            </p>
            <p>
              Five years in healthcare and finance taught me that the gap between
              &ldquo;technically works&rdquo; and &ldquo;actually good&rdquo; is
              where product quality lives. I close that gap.
            </p>
          </div>
          <Link
            href="/about"
            className="mt-14 inline-block border-[0.5px] border-[var(--rule)] px-10 py-4 meta-label no-underline hover:bg-[var(--accent)] hover:text-[var(--canvas)] hover:border-[var(--accent)] transition-all duration-500"
          >
            READ MORE →
          </Link>
        </div>
      </motion.section>

      {/* ── REMAINING WORK INDEX ─────────────────────────── */}
      {indexed.length > 0 && (
        <motion.section
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="border-b-[0.5px] border-[var(--rule)]"
          aria-labelledby="work-index-heading"
        >
          <div className="px-6 md:px-8 py-6 border-b-[0.5px] border-[var(--rule)] flex items-center justify-between">
            <span id="work-index-heading" className="meta-label">INDEX</span>
            <Link
              href="/work"
              className="meta-label no-underline hover:text-[var(--accent)] transition-colors"
            >
              ALL WORK →
            </Link>
          </div>
          {indexed.map((post, i) => {
            const num = String(i + featured.length + 1).padStart(2, "0");
            const cat = CATEGORY_MAP[post.slug] ?? "ENGINEERING";
            return (
              <motion.div
                key={post.slug}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
              >
                <Link
                  href={`/work/${post.slug}`}
                  className="group flex items-baseline gap-4 md:gap-6 px-6 md:px-8 py-5 border-b-[0.5px] border-[var(--rule)] no-underline hover:bg-[var(--surface)] active:bg-[var(--surface)] transition-colors duration-200"
                  data-cursor="work"
                >
                  <span className="meta-label w-8 shrink-0">{num}</span>
                  <span className="meta-label w-28 md:w-32 shrink-0 text-[var(--accent)]">{cat}</span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[18px] md:text-[20px] font-normal text-[var(--ink)] uppercase tracking-[-0.02em] flex-1 min-w-0">
                    <span className="project-title">{post.frontmatter.title}</span>
                  </span>
                  <span className="meta-label shrink-0">{post.frontmatter.year}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.section>
      )}

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
          <div className="px-6 md:px-8 py-6 border-b-[0.5px] border-[var(--rule)] flex items-center justify-between">
            <span id="writing-heading" className="meta-label">WRITING</span>
            <Link
              href="/writing"
              className="meta-label no-underline hover:text-[var(--accent)] transition-colors"
            >
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

      {/* ── CONTACT CTA ───────────────────────────────────── */}
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
          AVAILABLE
          <br />
          <span className="italic text-[var(--accent)]">NOW.</span>
        </h2>
        <p className="font-[family-name:var(--font-inter-tight)] text-[18px] text-[var(--ink-muted)] max-w-[500px] leading-relaxed mb-12 font-light">
          Open to senior frontend roles, contract work, and interesting
          conversations. I reply to every email that deserves one.
        </p>
        <div className="flex flex-wrap gap-4">
          <motion.a
            href="mailto:ivaturisaikiran@gmail.com"
            whileTap={{ scale: 0.96 }}
            className="meta-label bg-[var(--accent)] text-[var(--canvas)] px-8 py-4 no-underline hover:brightness-110 transition-all duration-300"
          >
            SEND MESSAGE ↗
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/saikiran-ivaturi/"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.96 }}
            className="meta-label border-[0.5px] border-[var(--rule)] px-8 py-4 no-underline hover:bg-[var(--surface)] transition-all duration-300"
          >
            LINKEDIN ↗
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
