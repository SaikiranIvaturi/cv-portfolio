"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";
import type { WorkPost } from "@/lib/content";

interface Props {
  post: WorkPost;
  prev: WorkPost | null;
  next: WorkPost | null;
  children: React.ReactNode;
}

export function WorkDetailClient({ post, prev, next, children }: Props) {
  const reduced = useReducedMotion();
  const itemVariant = reduced ? fadeUpReduced : fadeUp;

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-[640px] mx-auto pt-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.nav variants={itemVariant} aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/work"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-muted)] no-underline hover:text-[var(--accent)]"
            >
              Work /
            </Link>
          </motion.nav>

          <motion.h1
            variants={itemVariant}
            className="font-[family-name:var(--font-fraunces)] text-[36px] font-[500] tracking-[-0.02em] text-[var(--ink)] mb-4 leading-tight"
          >
            {post.frontmatter.title}
          </motion.h1>

          <motion.p
            variants={itemVariant}
            className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-muted)] mb-6 leading-relaxed"
          >
            {post.frontmatter.role} &nbsp;|&nbsp; {post.frontmatter.timeframe} &nbsp;|&nbsp; {post.frontmatter.stack}
          </motion.p>

          <motion.p
            variants={itemVariant}
            className="font-[family-name:var(--font-inter-tight)] text-[20px] italic text-[var(--ink-muted)] leading-relaxed mb-10 border-b border-[var(--rule)] pb-10"
          >
            {post.frontmatter.lede}
          </motion.p>

          {post.frontmatter.outcomes && post.frontmatter.outcomes.length > 0 && (
            <motion.aside
              variants={itemVariant}
              aria-label="Project outcomes"
              className="mb-10 p-5 bg-[var(--surface)] border border-[var(--rule)] rounded-sm"
            >
              <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-4">
                Outcomes
              </h2>
              <ul className="list-none m-0 p-0 space-y-2">
                {post.frontmatter.outcomes.map((outcome, i) => (
                  <li key={i} className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)] leading-snug flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5 shrink-0">&rsaquo;</span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </motion.div>

        <Reveal>
          <article className="mdx-content">
            {children}
          </article>
        </Reveal>

        {(prev || next) && (
          <Reveal>
            <nav aria-label="Project navigation" className="mt-16 pt-8 border-t border-[var(--rule)] flex justify-between gap-4">
              {prev ? (
                <Link href={`/work/${prev.slug}`} className="group flex flex-col no-underline">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] mb-1">&larr; Previous</span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[18px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">{prev.frontmatter.title}</span>
                </Link>
              ) : <div />}
              {next ? (
                <Link href={`/work/${next.slug}`} className="group flex flex-col text-right no-underline">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] mb-1">Next &rarr;</span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[18px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">{next.frontmatter.title}</span>
                </Link>
              ) : <div />}
            </nav>
          </Reveal>
        )}
      </div>
    </div>
  );
}
