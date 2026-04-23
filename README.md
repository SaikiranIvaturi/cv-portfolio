# saikiran.dev

Personal CV / portfolio website for Saikiran — Software Engineer II at Carelon Global Solutions (Elevance Health).

## Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript** (strict)
- **Tailwind CSS v4** with CSS variables for design tokens
- **MDX** via `@next/mdx` for case studies and blog posts
- **Framer Motion** for stagger animations and theme toggle
- **next/font** for zero-FOUC self-hosted fonts (Fraunces, Inter Tight, JetBrains Mono)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx          Global shell, fonts, JSON-LD, skip link
  page.tsx            Homepage (server) + HomepageClient.tsx (stagger animation)
  about/page.tsx      About page
  work/
    page.tsx          Work index
    [slug]/page.tsx   Case study template (MDX)
  writing/
    page.tsx          Writing index
    [slug]/page.tsx   Blog post template (MDX)
  cv/page.tsx         Print-optimized CV
  og/route.tsx        Dynamic OG image generation
  sitemap.ts          Auto-generated sitemap
  robots.ts           robots.txt

components/
  Nav.tsx             Hide-on-scroll-down navigation
  Footer.tsx          Colophon + theme toggle
  ThemeToggle.tsx     Sun/moon toggle with Framer Motion
  ProjectRow.tsx      Reusable work/writing list row
  MDXComponents.tsx   Styled MDX component overrides

lib/
  content.ts          MDX frontmatter parsing, sorting, tag filtering
  metadata.ts         Shared SEO / OG image helpers

content/
  work/               MDX case studies (4 included)
  writing/            MDX blog posts (2 included)

mdx-components.tsx    Root-level file required by @next/mdx
```

## Customising Personal Details

Search for these strings to update with your real information:

| What | Where |
|------|-------|
| GitHub URL | `app/HomepageClient.tsx`, `app/about/page.tsx`, `app/cv/page.tsx`, `app/layout.tsx` |
| LinkedIn URL | Same files |
| Email address | Same files |
| Domain (`saikiran.dev`) | `app/layout.tsx`, `lib/metadata.ts`, `app/sitemap.ts`, `app/og/route.tsx` |
| Current work description | `app/HomepageClient.tsx` (Currently section) |
| Real profile photo | `app/about/page.tsx` — uncomment the `<Image>` block |

## Adding Content

### New case study

Create `content/work/my-project.mdx` with this frontmatter:

```mdx
---
title: "Project Title"
description: "One-line description for index rows"
lede: "The italic summary sentence shown at the top of the case study"
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

The `order` field controls sort position on the index page.

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

Posts are automatically sorted by date (newest first). Reading time is calculated automatically.

## Deployment

Deploy to Vercel: push to GitHub and import the repository in the Vercel dashboard. No environment variables are required for the base setup.

```bash
npm run build  # Verify the build passes locally first
```

## Fonts

- **Fraunces** — optical-size serif, used for display headings and pull quotes
- **Inter Tight** — body and UI text at 17px / 1.65 line-height  
- **JetBrains Mono** — metadata labels, code snippets, nav links

All fonts are self-hosted via `next/font/google` — they are downloaded at build time and served from your own domain, not Google's CDN.

## Theme

Light mode (default) and dark mode, with system preference detection and a manual toggle in the footer. Choice is persisted in `localStorage`. A flash-prevention script in `<head>` reads the preference before React hydrates to avoid the light→dark flicker.

## Accessibility

- WCAG AA colour contrast in both themes
- Keyboard navigation on all interactive elements with `2px var(--accent)` focus rings
- Semantic HTML throughout (`<article>`, `<nav>`, `<main>`, `<time>`)
- Skip-to-content link
- All images require `alt` text (enforced by `next/image`)
- `prefers-reduced-motion` respected — animations scale back to fades only
