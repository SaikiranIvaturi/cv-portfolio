"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectRow } from "@/components/ProjectRow";
import { PageHeading } from "@/components/PageHeading";
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
        className="max-w-[880px] mx-auto pt-14"
      >
        <div className="mb-10">
          <PageHeading>Writing</PageHeading>
          <motion.p
            variants={itemVariant}
            className="font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] mt-5 max-w-[560px] leading-relaxed"
          >
            Technical notes and process writing. I write when I figure something
            out that took longer than it should have.
          </motion.p>
        </div>

        <motion.div variants={itemVariant} className="border-t border-[var(--rule)]">
          <div className="xl:grid xl:grid-cols-2">
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
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
