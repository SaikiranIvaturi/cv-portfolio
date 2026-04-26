"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { WorkPost } from "@/lib/content";

const CATEGORY_MAP: Record<string, string> = {
  "ecap-elevate":    "HEALTHCARE",
  "cost-of-care-ai": "HEALTHCARE · AI",
  "jsoncraft":       "SIDE PROJECT",
};

const EASE = [0.16, 1, 0.3, 1] as const;

function WorkRow({
  post,
  index,
  reduced,
}: {
  post: WorkPost;
  index: number;
  reduced: boolean | null;
}) {
  const num      = String(index + 1).padStart(2, "0");
  const category = CATEGORY_MAP[post.slug] ?? "ENGINEERING";
  const isSide   = category === "SIDE PROJECT";

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.07 }}
    >
      <Link
        href={`/work/${post.slug}`}
        className="group relative block border-b-[0.5px] border-[var(--rule)] px-6 md:px-12 py-10 md:py-16 overflow-hidden no-underline hover:bg-[var(--surface)] transition-colors duration-300"
      >
        {/* Watermark number — faint, right-anchored */}
        <span
          aria-hidden="true"
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 font-[family-name:var(--font-fraunces)] font-bold leading-none select-none pointer-events-none"
          style={{
            fontSize: "clamp(8rem, 24vw, 22rem)",
            color: "var(--ink)",
            opacity: 0.03,
          }}
        >
          {num}
        </span>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-5 flex-wrap relative">
          <span className="meta-label">{num}</span>
          <span className="w-px h-3 bg-[var(--rule)]" aria-hidden="true" />
          <span className="meta-label text-[var(--accent)]">{category}</span>
          {isSide && (
            <span className="meta-label border-[0.5px] border-[var(--accent)] text-[var(--accent)] px-2 py-[3px] leading-none">
              PERSONAL
            </span>
          )}
          <span className="meta-label ml-auto">{post.frontmatter.year}</span>
        </div>

        {/* Title — the headline */}
        <h2
          className="font-[family-name:var(--font-fraunces)] font-normal uppercase tracking-[-0.03em] leading-[0.9] text-[var(--ink)] mb-5 relative"
          style={{ fontSize: "clamp(2.6rem, 6.5vw, 6rem)" }}
        >
          <span className="project-title">{post.frontmatter.title}</span>
        </h2>

        {/* Description */}
        <p className="font-[family-name:var(--font-inter-tight)] text-[16px] text-[var(--ink-muted)] leading-relaxed max-w-2xl font-light mb-7 relative">
          {post.frontmatter.description}
        </p>

        {/* Bottom row: role + stack + cta */}
        <div className="flex items-end justify-between gap-4 relative">
          <div className="flex flex-col gap-1">
            <span className="meta-label opacity-40">{post.frontmatter.role}</span>
            <span className="meta-label opacity-25">{post.frontmatter.stack}</span>
          </div>
          <span
            className="meta-label text-[var(--accent)] shrink-0 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
          >
            VIEW CASE STUDY →
          </span>
        </div>

        {/* Accent line — grows on hover */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[0.5px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-500 ease-out"
        />
      </Link>
    </motion.div>
  );
}

export function WorkListClient({ work }: { work: WorkPost[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="pt-20">
      {/* ── Header ─────────────────────────────────────────── */}
      <motion.header
        initial={reduced ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="px-6 md:px-12 pt-12 pb-10 border-b-[0.5px] border-[var(--rule)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <h1
          className="font-[family-name:var(--font-fraunces)] font-normal uppercase tracking-[-0.04em] leading-[0.88] text-[var(--ink)]"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
        >
          RECENT
          <br />
          <span className="italic text-[var(--accent)]">WORK.</span>
        </h1>

        <div className="flex flex-col items-start sm:items-end gap-2 sm:pb-2 shrink-0">
          <p className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)] sm:text-right leading-relaxed sm:max-w-[200px] font-light">
            Enterprise software and personal tools.
          </p>
          <span className="meta-label opacity-30">{work.length} PROJECTS</span>
        </div>
      </motion.header>

      {/* ── Rows ────────────────────────────────────────────── */}
      {work.map((post, i) => (
        <WorkRow key={post.slug} post={post} index={i} reduced={reduced} />
      ))}
    </div>
  );
}
