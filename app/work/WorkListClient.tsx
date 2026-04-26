"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectRow } from "@/components/ProjectRow";
import { PageHeading } from "@/components/PageHeading";
import type { WorkPost } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export function WorkListClient({ work }: { work: WorkPost[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="pt-24 pb-28 px-6">
      <div className="max-w-[880px] mx-auto">
        {/* Header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="pt-14 pb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <PageHeading>Recent Work</PageHeading>
          <p className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)] lg:max-w-[260px] lg:text-right leading-relaxed lg:pb-2 shrink-0">
            Latest projects — enterprise software and personal tools.
          </p>
        </motion.div>

        {/* Rows — staggered */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="border-t border-[var(--rule)]"
        >
          {work.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={reduced ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
            >
              <ProjectRow
                year={post.frontmatter.year}
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                href={`/work/${post.slug}`}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)] uppercase tracking-[0.08em]"
        >
          {work.length} project{work.length !== 1 ? "s" : ""}
        </motion.p>
      </div>
    </div>
  );
}
