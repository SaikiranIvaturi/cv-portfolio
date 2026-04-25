"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { WorkPost } from "@/lib/content";

const WORK_IMAGES: Record<string, string> = {
  "cost-of-care-ai": "/images/work/cost-of-care-ai.png",
};

const CATEGORY_MAP: Record<string, string> = {
  "ecap-elevate":         "HEALTHCARE",
  "cost-of-care-ai":      "HEALTHCARE / AI",
  "deva":                 "HEALTHCARE",
  "operations-data-grid": "FINANCE",
};

export function WorkListClient({ work }: { work: WorkPost[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="pt-20">
      {/* Page header */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="px-8 pt-16 pb-12 border-b-[0.5px] border-[var(--rule)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <h1
          className="font-[family-name:var(--font-fraunces)] font-normal uppercase tracking-[-0.04em] leading-[0.88] text-[var(--ink)]"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
        >
          WORK
        </h1>
        <p className="meta-label max-w-[240px] leading-[1.8] sm:text-right">
          Five years of frontend systems in healthcare and finance.
        </p>
      </motion.div>

      {/* Project list */}
      {work.map((post, i) => {
        const reduced2 = reduced;
        const image = WORK_IMAGES[post.slug];
        const category = CATEGORY_MAP[post.slug] ?? "ENGINEERING";
        const num = String(i + 1).padStart(2, "0");
        const imageLeft = i % 2 === 0;

        return (
          <motion.div
            key={post.slug}
            initial={reduced2 ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/work/${post.slug}`} className="no-underline block group">
              <section
                className={[
                  "grid md:grid-cols-12 border-b-[0.5px] border-[var(--rule)] overflow-hidden",
                  i % 2 === 0 ? "bg-[var(--canvas)]" : "bg-[var(--surface)]",
                ].join(" ")}
              >
                {/* Text */}
                <div
                  className={[
                    "md:col-span-7 p-10 lg:p-16 flex flex-col justify-between min-h-[440px]",
                    imageLeft
                      ? "border-b-[0.5px] md:border-b-0 md:border-r-[0.5px]"
                      : "md:order-2 md:border-l-[0.5px]",
                    "border-[var(--rule)]",
                  ].join(" ")}
                >
                  <div className="flex justify-between items-start">
                    <span className="meta-label text-[var(--accent)]">
                      {num} / {category}
                    </span>
                    <span className="meta-label">{post.frontmatter.year}</span>
                  </div>
                  <div>
                    <h2
                      className="font-[family-name:var(--font-fraunces)] font-normal leading-[0.92] uppercase tracking-[-0.03em] text-[var(--ink)] mb-5 transition-all duration-700 ease-in-out group-hover:italic"
                      style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
                    >
                      {post.frontmatter.title}
                    </h2>
                    <p className="font-[family-name:var(--font-inter-tight)] text-[16px] max-w-md text-[var(--ink-muted)] leading-relaxed font-light mb-8">
                      {post.frontmatter.description}
                    </p>
                    <span className="meta-label border-[0.5px] border-[var(--rule)] px-6 py-3 group-hover:bg-[var(--accent)] group-hover:text-[var(--canvas)] group-hover:border-[var(--accent)] transition-all duration-500">
                      VIEW CASE STUDY →
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div
                  className={[
                    "md:col-span-5 h-[50vh] md:h-auto overflow-hidden bg-[var(--canvas)] relative flex items-center justify-center",
                    imageLeft ? "" : "md:order-1",
                  ].join(" ")}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={post.frontmatter.title}
                      fill
                      className="object-cover grayscale opacity-30 transition-all duration-[1200ms] ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 42vw"
                    />
                  ) : (
                    <>
                      <span
                        aria-hidden="true"
                        className="font-[family-name:var(--font-fraunces)] font-bold text-[var(--ink)] pointer-events-none select-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
                        style={{ fontSize: "clamp(6rem, 18vw, 14rem)", lineHeight: 1 }}
                      >
                        {num}
                      </span>
                      <div className="absolute top-6 left-6 meta-label border-[0.5px] border-[var(--rule)] px-3 py-2">
                        REF. {post.frontmatter.year}-{num}
                      </div>
                    </>
                  )}
                </div>
              </section>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
