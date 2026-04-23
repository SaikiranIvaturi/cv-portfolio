import type { Variants } from "framer-motion";

// ─── Easings ────────────────────────────────────────────
export const easings = {
  // Confident settle — for reveals, entrance animations, route transitions
  reveal: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // Linear-style snap — for hovers and interactive feedback
  snap: [0.32, 0.72, 0, 1] as [number, number, number, number],
} as const;

// ─── Durations (seconds) ────────────────────────────────
export const durations = {
  instant: 0.12,
  hover: 0.2,
  route: 0.18,
  reveal: 0.6,
  theme: 0.25,
} as const;

// ─── Stagger timings (seconds) ──────────────────────────
export const staggers = {
  word: 0.025,
  sibling: 0.07,
  section: 0.12,
} as const;

// ─── Session gate keys ──────────────────────────────────
export const SESSION_KEY = "sk-home-revealed";
export const INTRO_SESSION_KEY = "sk-intro-played";

// ─── Variants ───────────────────────────────────────────
// CRITICAL: transitions are defined inside the variant itself so that
// Framer Motion uses them automatically.

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: durations.reveal,
      ease: easings.reveal,
    },
  },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "linear" },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0,
      staggerChildren: staggers.section,
    },
  },
};

export const wordStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0,
      staggerChildren: staggers.word,
    },
  },
};

export const wordVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: easings.reveal,
    },
  },
};

export const wordVariantReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "linear" },
  },
};

// Clip-reveal: heading slides up from below an overflow-hidden mask
export const headingReveal: Variants = {
  hidden: { y: "105%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const headingRevealReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "linear" } },
};
