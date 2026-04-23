"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { PageHeading } from "@/components/PageHeading";
import {
  fadeUp,
  fadeUpReduced,
  fadeSlideLeft,
  scaleReveal,
  staggerContainer,
} from "@/lib/motion";
import type { WorkPost } from "@/lib/content";

interface Props {
  post: WorkPost;
  prev: WorkPost | null;
  next: WorkPost | null;
  children: React.ReactNode;
}

export function WorkDetailClient({ post, prev, next, children }: Props) {
  const reduced = useReducedMotion();
  const item = reduced ? fadeUpReduced : fadeUp;
  const slideLeft = reduced ? fadeUpReduced : fadeSlideLeft;
  const scale = reduced ? fadeUpReduced : scaleReveal;

  const stackTags = post.frontmatter.stack
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="pt-24 pb-28 px-6">
      <div className="max-w-[880px] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="pt-14"
        >
          {/* Breadcrumb */}
          <motion.nav
            variants={slideLeft}
            aria-label="Breadcrumb"
            className="mb-12 flex items-center gap-2"
          >
            <Link
              href="/work"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)] no-underline hover:text-[var(--accent)] transition-colors"
            >
              Work
            </Link>
            <span
              className="text-[var(--ink-subtle)] mx-1 text-[12px]"
              aria-hidden="true"
            >
              /
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-muted)] truncate">
              {post.frontmatter.title}
            </span>
          </motion.nav>

          {/* Title */}
          <PageHeading className="mb-10">{post.frontmatter.title}</PageHeading>

          {/* Role + timeframe */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5"
          >
            <span className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)]">
              {post.frontmatter.role}
            </span>
            <span className="text-[var(--ink-subtle)]" aria-hidden="true">
              —
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-muted)]">
              {post.frontmatter.timeframe}
            </span>
          </motion.div>

          {/* Stack pills */}
          <motion.div variants={item} className="flex flex-wrap gap-2 mb-12">
            {stackTags.map((tag) => (
              <span
                key={tag}
                className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.05em] text-[var(--ink-subtle)] border border-[var(--rule)] px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Lede as blockquote */}
          <motion.blockquote
            variants={item}
            className="pl-5 border-l-2 border-[var(--accent)] font-[family-name:var(--font-fraunces)] text-[21px] italic text-[var(--ink-muted)] leading-[1.5] mb-14 max-w-[680px]"
          >
            {post.frontmatter.lede}
          </motion.blockquote>

          {/* Outcomes */}
          {post.frontmatter.outcomes &&
            post.frontmatter.outcomes.length > 0 && (
              <motion.aside
                variants={scale}
                aria-label="Project outcomes"
                className="mb-14"
              >
                <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink-subtle)] mb-5">
                  Outcomes
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {post.frontmatter.outcomes.map((outcome, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-[var(--surface)] border border-[var(--rule)] rounded-sm"
                    >
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[var(--accent)] text-[11px] mt-0.5 shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-[family-name:var(--font-inter-tight)] text-[14px] text-[var(--ink)] leading-snug">
                        {outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.aside>
            )}

          <motion.div variants={item} className="h-px bg-[var(--rule)] mb-14" />
        </motion.div>

        {/* Body content */}
        <Reveal>
          <article className="mdx-content">{children}</article>
        </Reveal>

        {/* Prev / Next */}
        {(prev || next) && (
          <Reveal>
            <nav
              aria-label="Project navigation"
              className="mt-20 pt-8 border-t border-[var(--rule)] grid grid-cols-2 gap-8"
            >
              {prev ? (
                <Link
                  href={`/work/${prev.slug}`}
                  className="group flex flex-col gap-1.5 no-underline"
                >
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] group-hover:text-[var(--accent)] transition-colors">
                    &larr; Prev
                  </span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[21px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {prev.frontmatter.title}
                  </span>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)]">
                    {prev.frontmatter.timeframe}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="group flex flex-col gap-1.5 text-right no-underline ml-auto"
                >
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] group-hover:text-[var(--accent)] transition-colors">
                    Next &rarr;
                  </span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[21px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {next.frontmatter.title}
                  </span>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)]">
                    {next.frontmatter.timeframe}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </Reveal>
        )}
      </div>
    </div>
  );
}
