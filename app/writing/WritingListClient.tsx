"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectRow } from "@/components/ProjectRow";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";
import type { WritingPost } from "@/lib/content";

export function WritingListClient({ posts }: { posts: WritingPost[] }) {
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
          Writing
        </motion.h1>
        <motion.p
          variants={itemVariant}
          className="font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] mb-12 leading-relaxed"
        >
          Technical notes and process writing. I write when I figure something
          out that took longer than it should have.
        </motion.p>

        {posts.map((post) => (
          <motion.div key={post.slug} variants={itemVariant}>
            <ProjectRow
              year={new Date(post.frontmatter.date).getFullYear()}
              title={post.frontmatter.title}
              description={post.frontmatter.description}
              href={`/writing/${post.slug}`}
              tag={post.readingTime}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
