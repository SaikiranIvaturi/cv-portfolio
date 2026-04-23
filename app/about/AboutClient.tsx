"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";
import { PageHeading } from "@/components/PageHeading";

export function AboutClient() {
  const reduced = useReducedMotion();
  const item = reduced ? fadeUpReduced : fadeUp;

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-[880px] mx-auto pt-14"
    >
      <motion.div variants={item} className="mb-8">
        <Image
          src="/images/avatar.jpeg"
          alt="Saikiran Ivaturi"
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
      </motion.div>

      <PageHeading className="mb-10">About</PageHeading>

      <div className="prose-content">
        <motion.p variants={item} className="text-[17px] text-[var(--ink)] leading-[1.75] mb-6">
          I&rsquo;m Saikiran, a Software Engineer II at Carelon Global
          Solutions (Elevance Health) in Delhi. I have four-plus years
          building frontend systems — mostly in React, Redux, and TypeScript —
          for products that are used by clinicians, analysts, and care
          managers in the US healthcare system.
        </motion.p>

        <motion.p variants={item} className="text-[17px] text-[var(--ink)] leading-[1.75] mb-6">
          Before Carelon, I worked at BNY Mellon on internal tooling for
          financial operations. That work shaped how I think about data-dense
          interfaces: the goal is always to reduce cognitive load, not just
          render information. A screen that makes its user feel smart is doing
          something right.
        </motion.p>

        <motion.p variants={item} className="text-[17px] text-[var(--ink)] leading-[1.75] mb-6">
          I care about the structural part of frontend work &mdash; state
          design, component contracts, authentication flows, accessibility
          from the start. I&rsquo;ve led the frontend on projects that span
          Okta/OIDC auth, complex role-based access, and real-time data
          pipelines, and I try to write code that a future colleague can read
          without needing to find me.
        </motion.p>

        <motion.p variants={item} className="text-[17px] text-[var(--ink)] leading-[1.75] mb-6">
          Outside of work I build small tools and UI experiments, write
          occasionally about things I&rsquo;ve figured out, and read
          obsessively about typography and the history of information design.
        </motion.p>

        <motion.p variants={item} className="text-[17px] text-[var(--ink)] leading-[1.75] mb-6">
          I hold a MERN Stack certification from The Hacker School and a
          B.C.A in Computer Applications from Amity University. The bootcamp mattered more.
        </motion.p>
      </div>

      <motion.span
        variants={item}
        className="block text-[var(--accent)] text-[16px] my-10"
        aria-hidden="true"
      >
        ✦
      </motion.span>

      <motion.section variants={item} aria-label="Contact">
        <h2 className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-4">
          Get in touch
        </h2>
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--ink-muted)]">
          <a
            href="mailto:ivaturisaikiran@gmail.com"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            ivaturisaikiran@gmail.com
          </a>
          &nbsp;&middot;&nbsp;
          <a
            href="https://www.linkedin.com/in/saikiran-ivaturi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink-muted)] no-underline hover:text-[var(--accent)]"
          >
            LinkedIn
          </a>
          &nbsp;&middot;&nbsp;
          <a
            href="https://github.com/SaikiranIvaturi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink-muted)] no-underline hover:text-[var(--accent)]"
          >
            GitHub
          </a>
        </p>
      </motion.section>
    </motion.article>
  );
}
