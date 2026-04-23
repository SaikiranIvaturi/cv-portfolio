<div align="center">

# saikiran.dev

**Personal portfolio & CV — Software Engineer II**

[![Live Site](https://img.shields.io/badge/Live%20Site-cv--portfolio--orpin.vercel.app-black?style=flat-square&logo=vercel)](https://cv-portfolio-orpin.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-animations-ff0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

A minimal, type-forward portfolio built with the Next.js App Router. Case studies and writing are authored in MDX. Light and dark modes, animated ambient background, scroll-linked progress, and a print-optimised CV page.

## Features

- **MDX case studies** — frontmatter-driven work entries with outcomes, stack, and rich body content
- **Writing section** — blog posts with auto-calculated reading time and tag filtering
- **Dynamic OG images** — per-page social preview cards via `app/og/route.tsx`
- **Print CV** — `/cv` renders as a clean single-page resumé
- **Ambient shapes** — parallax SVG layer that responds to scroll depth
- **Theme toggle** — light/dark with `localStorage` persistence and flash prevention
- **Scroll progress bar** — spring-animated indicator at the top of every page
- **Technology marquee** — infinite ticker of current stack on the homepage
- **Auto sitemap + robots.txt** — generated at build time

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 · CSS custom properties for design tokens |
| Content | MDX via `@next/mdx` · `remark-gfm` · `remark-frontmatter` |
| Animation | Framer Motion (`useScroll`, `useSpring`, `AnimatePresence`) |
| Fonts | Fraunces · Inter Tight · JetBrains Mono (self-hosted via `next/font`) |
| Deployment | Vercel (zero-config) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # verify the production build locally
```

No environment variables are required.

## Project Structure

```
app/
  layout.tsx            Global shell · fonts · JSON-LD · skip link
  page.tsx              Homepage — stagger animation, marquee, ambient glow
  about/page.tsx        About page
  cv/page.tsx           Print-optimised CV
  work/
    page.tsx            Work index
    [slug]/page.tsx     Case study (MDX-driven)
  writing/
    page.tsx            Writing index
    [slug]/page.tsx     Blog post (MDX-driven)
  og/route.tsx          Dynamic OG image generation
  sitemap.ts            Auto-generated sitemap
  robots.ts             robots.txt

components/
  Nav.tsx               Hide-on-scroll-down navigation
  Footer.tsx            Colophon · theme toggle
  ThemeToggle.tsx       Sun/moon toggle with Framer Motion
  ScrollProgress.tsx    Spring-animated scroll progress bar
  AmbientShapes.tsx     Full-viewport parallax SVG decorations
  ProjectRow.tsx        Reusable row for work/writing lists
  MDXComponents.tsx     Styled MDX component overrides

lib/
  content.ts            Frontmatter parsing · sorting · tag filtering
  metadata.ts           Shared SEO / OG image helpers

content/
  work/                 MDX case studies
  writing/              MDX blog posts
```

## Adding Content

### New case study

Create `content/work/my-project.mdx`:

```mdx
---
title: "Project Title"
description: "One-line description shown on the index row"
lede: "Italic summary sentence shown at the top of the case study."
role: "Your Role"
timeframe: "2024 – Present"
stack: "React · TypeScript · etc"
year: 2024
order: 5
outcomes:
  - "Outcome one"
  - "Outcome two"
---

Your MDX content here.
```

`order` controls sort position on the work index. Lower numbers appear first.

### New blog post

Create `content/writing/my-post.mdx`:

```mdx
---
title: "Post Title"
description: "Short description"
date: "2024-06-01"
tags: ["react", "typescript"]
---

Post content here.
```

Posts are sorted by date (newest first). Reading time is calculated automatically from word count.

## Customising

| What to change | Where |
|---|---|
| Name / current role | `app/HomepageClient.tsx` · `app/about/AboutClient.tsx` · `app/cv/CVClient.tsx` |
| GitHub / LinkedIn / email links | Same three files + `app/layout.tsx` |
| Domain | `app/layout.tsx` · `lib/metadata.ts` · `app/sitemap.ts` · `app/og/route.tsx` |
| Technology marquee | `STACK` array in `app/HomepageClient.tsx` |
| Profile photo | `app/about/page.tsx` — uncomment the `<Image>` block |

## Design

**Typography**
- **Fraunces** — optical-size serif for display headings and pull quotes
- **Inter Tight** — body and UI at 17 px / 1.65 line-height
- **JetBrains Mono** — metadata labels, code snippets, nav links

All fonts self-hosted via `next/font/google` — downloaded at build time, served from your own domain.

**Theming**  
CSS custom properties (`--ink`, `--canvas`, `--accent`, `--surface`, etc.) drive every colour. Switching theme swaps a `[data-theme]` attribute on `<html>` so no class purging is needed.

**Accessibility**
- WCAG AA contrast in both themes
- Full keyboard navigation with `2px var(--accent)` focus rings
- Semantic HTML (`<article>`, `<nav>`, `<main>`, `<time>`)
- Skip-to-content link
- `prefers-reduced-motion` respected — animations degrade to fades

## Deployment

Push to GitHub and import in the [Vercel dashboard](https://vercel.com/new). No build configuration or environment variables needed beyond the defaults.

---

<div align="center">
  <a href="https://cv-portfolio-orpin.vercel.app/">cv-portfolio-orpin.vercel.app</a>
</div>
