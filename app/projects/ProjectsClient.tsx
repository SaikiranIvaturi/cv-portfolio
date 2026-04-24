"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PageHeading } from "@/components/PageHeading";
import { staggerContainer, fadeUp, fadeUpReduced } from "@/lib/motion";

interface AppProject {
  year: number;
  title: string;
  description: string;
  href: string;
  tag: string;
  stack: string[];
  features: string[];
  image?: string;
  imageAlt?: string;
}

const projects: AppProject[] = [
  {
    year: 2026,
    title: "JSONCraft",
    description:
      "Browser-based JSON toolkit with a full Monaco editor. Format, validate, diff two documents side-by-side, and explore any structure with a tree view and deep stats. Multiple tabs, drag-and-drop files, share via compressed URL. Everything runs locally — no data leaves your machine.",
    href: "https://jsoncraft.in",
    tag: "Tool",
    stack: ["TypeScript", "React", "Monaco Editor"],
    features: [
      "Format & Minify",
      "Live Validation",
      "Side-by-side Diff",
      "Tree Explorer",
      "Cmd+K Menu",
    ],
    image: "/images/projects/jsoncraft.png",
    imageAlt: "JSONCraft — browser-based JSON toolkit interface",
  },
];

function ProjectCard({ project, index }: { project: AppProject; index: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block no-underline"
      >
        <div className="overflow-hidden rounded-2xl border border-[var(--rule)] transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[var(--accent)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]">

          {/* Screenshot */}
          <div className="relative w-full overflow-hidden bg-[var(--canvas-raised)]">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.imageAlt ?? project.title}
                width={1600}
                height={900}
                className="w-full h-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                sizes="(max-width: 880px) 100vw, 880px"
              />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-subtle)]">
                  {project.href.replace("https://", "")}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--rule)] transition-colors duration-300 group-hover:bg-[var(--accent)]" />

          {/* Text */}
          <div className="p-8">
            {/* Meta row */}
            <div className="mb-4 flex items-center gap-2">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--ink-subtle)]">
                {project.tag}
              </span>
              <span aria-hidden="true" className="text-[11px] text-[var(--rule)]">·</span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)]">
                {project.year}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h2 className="mb-2 font-[family-name:var(--font-fraunces)] text-[26px] font-normal leading-tight tracking-[-0.02em] text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="mb-6 font-[family-name:var(--font-inter-tight)] text-[15px] leading-[1.7] text-[var(--ink-muted)] max-w-[560px]">
                  {project.description}
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2">
                  {project.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-[var(--rule)] px-2.5 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.06em] text-[var(--ink-subtle)]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right column: stack + CTA */}
              <div className="flex sm:flex-col sm:items-end justify-between sm:justify-start gap-4 sm:gap-6 shrink-0">
                <div className="flex flex-wrap sm:flex-col sm:items-end gap-x-3 gap-y-1">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="font-[family-name:var(--font-inter-tight)] text-[13px] text-[var(--ink-subtle)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--accent)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0">
                  Visit ↗
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export function ProjectsClient() {
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
        <div className="pt-14 pb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <PageHeading>Projects</PageHeading>
          <motion.p
            variants={item}
            className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)] lg:max-w-[260px] lg:text-right leading-relaxed lg:pb-2 shrink-0"
          >
            Personal apps and tools built outside of work.
          </motion.p>
        </div>

        <motion.div variants={item} className="space-y-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.href} project={p} index={i} />
          ))}
        </motion.div>

        <motion.p
          variants={item}
          className="mt-10 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)] uppercase tracking-[0.08em]"
        >
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </motion.p>
      </motion.div>
    </div>
  );
}
