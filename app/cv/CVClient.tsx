"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";

const experience = [
  {
    company: "Carelon Global Solutions (Elevance Health)",
    role: "Software Engineer II",
    period: "Feb 2023 – Present",
    location: "Gurugram, India",
    bullets: [
      "Software Engineer II on ECAP-Elevate — unified five siloed reporting surfaces into a single authenticated platform for Elevance Health operations teams. Built the application shell, Okta OIDC with idle session detection and automatic token refresh, and role-based access across admin, analyst, and executive tiers.",
      "Software Engineer II on Cost of Care AI — built data-intensive dashboards displaying cost trends, utilisation metrics, and AI-generated insights. Managed global state with Redux Toolkit, handling asynchronous API calls and large datasets, and integrated AI-driven APIs translating complex data into intuitive visual experiences.",
      "Led frontend on DEVA — designed component architecture, established coding standards, and integrated Okta OIDC auth. Delivered a 92% improvement in cut submission processing speed (7,000 cuts in 110 minutes) and a 90% reduction in data load times.",
      "Established team-wide patterns for role-based access control, API error handling, and reusable component libraries following DRY principles.",
      "Mentored junior engineers; contributed to sprint planning, estimations, and Agile ceremonies.",
    ],
  },
  {
    company: "BNY Mellon",
    role: "Associate Software Engineer",
    period: "2021 – 2022",
    location: "Delhi, India",
    bullets: [
      "Built and maintained internal financial operations tooling using React and Redux.",
      "Developed a data grid component handling 100k+ rows with virtualized rendering and inline editing.",
      "Worked with the design team to migrate a legacy system to a new design system, improving consistency and accessibility.",
      "Participated in on-call rotations and contributed to incident response documentation.",
    ],
  },
];

const education = [
  {
    institution: "The Hacker School",
    credential: "MERN Stack Certification",
    year: "2021",
  },
  {
    institution: "Amity University",
    credential: "B.C.A, Computer Applications",
    year: "2019",
  },
];

const skills = {
  Languages: ["TypeScript", "JavaScript (ES2022+)", "HTML5", "CSS3"],
  Frameworks: [
    "React 18/19",
    "Next.js",
    "Redux Toolkit",
    "React Query",
    "Framer Motion",
  ],
  Tools: ["Vite", "Webpack", "Vitest", "Jest", "Playwright", "Figma", "Git"],
  Practices: [
    "Component architecture",
    "WCAG accessibility",
    "Performance optimisation",
    "OIDC/OAuth2",
    "CI/CD",
  ],
};

export function CVClient() {
  const reduced = useReducedMotion();
  const item = reduced ? fadeUpReduced : fadeUp;

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-[640px] mx-auto pt-14">
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-10 border-b border-[var(--rule)] pb-8"
        >
          <motion.h1
            variants={item}
            className="font-[family-name:var(--font-fraunces)] text-[32px] font-normal tracking-[-0.02em] text-[var(--ink)] mb-2"
          >
            Saikiran
          </motion.h1>
          <motion.p
            variants={item}
            className="font-[family-name:var(--font-inter-tight)] text-[17px] text-[var(--ink-muted)] mb-1"
          >
            Software Engineer II · Frontend
          </motion.p>
          <motion.p
            variants={item}
            className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)]"
          >
            Delhi, India&nbsp;&middot;&nbsp;
            <a
              href="mailto:ivaturisaikiran@gmail.com"
              className="text-[var(--accent)] no-underline hover:underline"
            >
              ivaturisaikiran@gmail.com
            </a>
            &nbsp;&middot;&nbsp;
            <a
              href="https://github.com/SaikiranIvaturi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] no-underline hover:underline"
            >
              github.com/SaikiranIvaturi
            </a>
          </motion.p>
        </motion.header>

        <Reveal>
          <section className="mb-10" aria-labelledby="summary-heading">
            <h2
              id="summary-heading"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-3"
            >
              Summary
            </h2>
            <p className="font-[family-name:var(--font-inter-tight)] text-[16px] text-[var(--ink)] leading-[1.7]">
              Frontend engineer with 5+ years building production systems in
              React, Redux, and TypeScript. Currently at Carelon Global
              Solutions (Elevance Health), leading frontend development on
              healthcare AI and data tooling. Strong on component architecture,
              auth integrations, accessibility, and performance. Comfortable
              owning a product surface end-to-end.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-10" aria-labelledby="experience-heading">
            <h2
              id="experience-heading"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-6"
            >
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((job) => (
                <div key={job.company}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <div>
                      <span className="font-[family-name:var(--font-fraunces)] text-[18px] font-[500] text-[var(--ink)]">
                        {job.role}
                      </span>
                      <span className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)]">
                        &ensp;&mdash;&ensp;{job.company}
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)] shrink-0">
                      {job.period}
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-5 space-y-1.5">
                    {job.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)] leading-[1.65]"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-10" aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-6"
            >
              Skills
            </h2>
            <div className="space-y-3">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="flex gap-4 items-baseline">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.06em] text-[var(--ink-subtle)] w-24 shrink-0">
                    {category}
                  </span>
                  <span className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)]">
                    {items.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="education-heading">
            <h2
              id="education-heading"
              className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] text-[var(--ink-subtle)] mb-6"
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.institution}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                >
                  <div>
                    <span className="font-[family-name:var(--font-inter-tight)] text-[16px] font-[500] text-[var(--ink)]">
                      {edu.credential}
                    </span>
                    <span className="font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)]">
                      &ensp;&mdash;&ensp;{edu.institution}
                    </span>
                  </div>
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)]">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
