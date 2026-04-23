"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { PageHeading } from "@/components/PageHeading";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";
import type { WritingPost } from "@/lib/content";

interface Props {
  post: WritingPost;
  prev: WritingPost | null;
  next: WritingPost | null;
  children: React.ReactNode;
}

export function WritingDetailClient({ post, prev, next, children }: Props) {
  const reduced = useReducedMotion();
  const itemVariant = reduced ? fadeUpReduced : fadeUp;

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-[880px] mx-auto pt-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.nav variants={itemVariant} aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/writing"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-muted)] no-underline hover:text-[var(--accent)]"
            >
              Writing /
            </Link>
          </motion.nav>

          <PageHeading className="mb-4">{post.frontmatter.title}</PageHeading>

          <motion.div
            variants={itemVariant}
            className="flex items-center gap-3 mb-10 border-b border-[var(--rule)] pb-8"
          >
            <time
              dateTime={post.frontmatter.date}
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-muted)]"
            >
              {new Date(post.frontmatter.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-[var(--rule)]">/</span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)]">
              {post.readingTime}
            </span>
          </motion.div>
        </motion.div>

        <Reveal>
          <article className="mdx-content">
            {children}
          </article>
        </Reveal>

        {(prev || next) && (
          <Reveal>
            <nav aria-label="Article navigation" className="mt-16 pt-8 border-t border-[var(--rule)] flex justify-between gap-4">
              {prev ? (
                <Link href={`/writing/${prev.slug}`} className="group flex flex-col no-underline">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] mb-1">&larr; Previous</span>
                  <span className="font-[family-name:var(--font-fraunces)] text-[18px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">{prev.frontmatter.title}</span>
                </Link>
              ) : <div />}
              {next ? (
                <Link href={`/writing/${next.slug}`} className="group flex flex-col text-right no-underline">
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
