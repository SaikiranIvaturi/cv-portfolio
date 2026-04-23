"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectRow } from "@/components/ProjectRow";
import { PageHeading } from "@/components/PageHeading";
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
        className="max-w-[880px] mx-auto pt-14"
      >
        <div className="mb-10">
          <PageHeading>Work</PageHeading>
          <motion.p
            variants={itemVariant}
            className="font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] mt-5 max-w-[560px] leading-relaxed"
          >
            Case studies from four years of building frontend systems in
            healthcare and finance. Each one includes a problem statement, how I
            approached it, and what shipped.
          </motion.p>
        </div>

        <motion.div variants={itemVariant} className="border-t border-[var(--rule)]">
          <div className="xl:grid xl:grid-cols-2">
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
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
