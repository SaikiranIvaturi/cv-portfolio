"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectRow } from "@/components/ProjectRow";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";
import type { WorkPost } from "@/lib/content";

export function WorkListClient({ work }: { work: WorkPost[] }) {
  const reduced = useReducedMotion();
  const itemVariant = reduced ? fadeUpReduced : fadeUp;

  return (
    <div className="pt-24 pb-20 px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-[720px] mx-auto pt-14"
      >
        <motion.h1
          variants={itemVariant}
          className="font-[family-name:var(--font-fraunces)] text-[36px] font-normal tracking-[-0.02em] text-[var(--ink)] mb-3 leading-tight"
        >
          Work
        </motion.h1>
        <motion.p
          variants={itemVariant}
          className="font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] mb-12 leading-relaxed"
        >
          Case studies from four years of building frontend systems in
          healthcare and finance. Each one includes a problem statement, how I
          approached it, and what shipped.
        </motion.p>

        {work.map((item) => (
          <motion.div key={item.slug} variants={itemVariant}>
            <ProjectRow
              year={item.frontmatter.year}
              title={item.frontmatter.title}
              description={item.frontmatter.description}
              href={`/work/${item.slug}`}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
