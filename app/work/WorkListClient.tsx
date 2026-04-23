"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectRow } from "@/components/ProjectRow";
import { PageHeading } from "@/components/PageHeading";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";
import type { WorkPost } from "@/lib/content";

export function WorkListClient({ work }: { work: WorkPost[] }) {
  const reduced = useReducedMotion();
  const item = reduced ? fadeUpReduced : fadeUp;

  return (
    <div className="pt-24 pb-28 px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-[880px] mx-auto"
      >
        {/* Header — heading left, descriptor right */}
        <div className="pt-14 pb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <PageHeading>Work</PageHeading>
          <motion.p
            variants={item}
            className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)] lg:max-w-[260px] lg:text-right leading-relaxed lg:pb-2 shrink-0"
          >
            Five years of frontend systems in healthcare and finance.
          </motion.p>
        </div>

        <motion.div variants={item} className="border-t border-[var(--rule)]">
          {work.map((post) => (
            <ProjectRow
              key={post.slug}
              year={post.frontmatter.year}
              title={post.frontmatter.title}
              description={post.frontmatter.description}
              href={`/work/${post.slug}`}
            />
          ))}
        </motion.div>

        <motion.p
          variants={item}
          className="mt-6 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)] uppercase tracking-[0.08em]"
        >
          {work.length} project{work.length !== 1 ? "s" : ""}
        </motion.p>
      </motion.div>
    </div>
  );
}
