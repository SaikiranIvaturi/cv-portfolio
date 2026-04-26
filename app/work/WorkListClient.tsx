"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { WorkPost } from "@/lib/content";

const WORK_IMAGES: Record<string, string> = {
  "ecap-elevate":    "/images/work/cost-of-care-ai.png",
  "cost-of-care-ai": "/images/work/cost-of-care-ai-grid.png",
  "jsoncraft":       "/images/projects/jsoncraft.png",
};

const CATEGORY_MAP: Record<string, string> = {
  "ecap-elevate":    "HEALTHCARE",
  "cost-of-care-ai": "HEALTHCARE / AI",
  "jsoncraft":       "SIDE PROJECT",
};

const EASE = [0.16, 1, 0.3, 1] as const;

function WorkSection({
  post,
  index,
  reduced,
}: {
  post: WorkPost;
  index: number;
  reduced: boolean | null;
}) {
  const imageLeft  = index % 2 === 1;
  const image      = WORK_IMAGES[post.slug];
  const category   = CATEGORY_MAP[post.slug] ?? "ENGINEERING";
  const num        = String(index + 1).padStart(2, "0");
  const isSide     = category === "SIDE PROJECT";
  const bg         = index % 2 === 0 ? "bg-[var(--canvas)]" : "bg-[var(--surface)]";

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.85, ease: EASE, delay: index * 0.08 }}
    >
      <Link href={`/work/${post.slug}`} className="no-underline block group">
        <motion.section
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`grid md:grid-cols-12 border-b-[0.5px] border-[var(--rule)] overflow-hidden ${bg}`}
        >
          {/* Text panel */}
          <div
            className={[
              "md:col-span-7 p-8 lg:p-20 flex flex-col justify-between min-h-[360px] md:min-h-[480px]",
              imageLeft
                ? "md:order-2 md:border-l-[0.5px]"
                : "border-b-[0.5px] md:border-b-0 md:border-r-[0.5px]",
              "border-[var(--rule)]",
            ].join(" ")}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="meta-label text-[var(--accent)]">
                  {num} / {category}
                </span>
                {isSide && (
                  <span className="meta-label border-[0.5px] border-[var(--accent)] text-[var(--accent)] px-2 py-[3px] leading-none">
                    PERSONAL
                  </span>
                )}
              </div>
              <span className="meta-label shrink-0 ml-4">{post.frontmatter.year}</span>
            </div>

            <div>
              <h2
                className="font-[family-name:var(--font-fraunces)] font-normal leading-[0.92] uppercase tracking-[-0.03em] text-[var(--ink)] mb-6"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
              >
                <span className="project-title">{post.frontmatter.title}</span>
              </h2>
              <p className="font-[family-name:var(--font-inter-tight)] text-[17px] max-w-lg text-[var(--ink-muted)] leading-relaxed font-light">
                {post.frontmatter.description}
              </p>
            </div>
          </div>

          {/* Image panel */}
          <div
            className={[
              "md:col-span-5 h-[42vh] md:h-auto overflow-hidden bg-[var(--canvas)] relative flex items-center justify-center",
              imageLeft ? "md:order-1" : "",
            ].join(" ")}
          >
            {image ? (
              <Image
                src={image}
                alt={post.frontmatter.title}
                fill
                className="object-cover grayscale project-img opacity-60 md:opacity-30 transition-all duration-[1200ms] ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-fraunces)] font-bold text-[var(--ink)] pointer-events-none select-none opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700"
                  style={{ fontSize: "clamp(6rem, 20vw, 18rem)", lineHeight: 1 }}
                >
                  {num}
                </span>
                <div className="absolute top-6 left-6 meta-label border-[0.5px] border-[var(--rule)] px-3 py-2">
                  REF. {post.frontmatter.year}-{num}
                </div>
              </>
            )}
          </div>
        </motion.section>
      </Link>
    </motion.div>
  );
}

export function WorkListClient({ work }: { work: WorkPost[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="pt-20">
      {/* ── Page header ─────────────────────────────────── */}
      <motion.header
        initial={reduced ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="px-6 md:px-8 pt-12 pb-10 border-b-[0.5px] border-[var(--rule)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <h1
          className="font-[family-name:var(--font-fraunces)] font-normal uppercase tracking-[-0.04em] leading-[0.88] text-[var(--ink)]"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
        >
          RECENT
          <br />
          <span className="italic text-[var(--accent)]">WORK.</span>
        </h1>
        <p className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)] sm:max-w-[240px] sm:text-right leading-relaxed sm:pb-2 shrink-0">
          Enterprise software and personal tools — latest {work.length}.
        </p>
      </motion.header>

      {/* ── Numbered sections ───────────────────────────── */}
      {work.map((post, i) => (
        <WorkSection key={post.slug} post={post} index={i} reduced={reduced} />
      ))}
    </div>
  );
}
