"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { PageHeading } from "@/components/PageHeading";
import {
  fadeUp,
  fadeUpReduced,
  fadeSlideLeft,
  staggerContainer,
} from "@/lib/motion";
import type { WritingPost } from "@/lib/content";

interface Props {
  post: WritingPost;
  prev: WritingPost | null;
  next: WritingPost | null;
  children: React.ReactNode;
}

export function WritingDetailClient({ post, prev, next, children }: Props) {
  const reduced = useReducedMotion();
  const item = reduced ? fadeUpReduced : fadeUp;
  const slideLeft = reduced ? fadeUpReduced : fadeSlideLeft;

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
              href="/writing"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)] no-underline hover:text-[var(--accent)] transition-colors"
            >
              Writing
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

          {/* Date + reading time */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-3 mb-16 pb-10 border-b border-[var(--rule)]"
          >
            <time
              dateTime={post.frontmatter.date}
              className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-muted)]"
            >
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span
              aria-hidden="true"
              className="w-1 h-1 rounded-full bg-[var(--rule)] shrink-0"
            />
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.06em] text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded-full">
              {post.readingTime}
            </span>
          </motion.div>
        </motion.div>

        {/* Body — constrained for reading comfort */}
        <Reveal>
          <article className="mdx-content max-w-[680px]">{children}</article>
        </Reveal>

        {/* Prev / Next */}
        {(prev || next) && (
          <Reveal>
            <nav
              aria-label="Article navigation"
              className="mt-20 pt-8 border-t border-[var(--rule)] grid grid-cols-2 gap-8"
            >
              {prev ? (
                <Link
                  href={`/writing/${prev.slug}`}
                  className="group flex flex-col gap-1.5 no-underline"
                >
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] group-hover:text-[var(--accent)] transition-colors">
                    &larr; Prev
                  </span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[21px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {prev.frontmatter.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/writing/${next.slug}`}
                  className="group flex flex-col gap-1.5 text-right no-underline ml-auto"
                >
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] group-hover:text-[var(--accent)] transition-colors">
                    Next &rarr;
                  </span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[21px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {next.frontmatter.title}
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
