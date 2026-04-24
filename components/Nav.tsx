"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { easings } from "@/lib/motion";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "CV", href: "/cv" },
];

export function Nav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY.current && current > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The underline shows on hovered link, falling back to active link
  const indicatorHref =
    hoveredHref ??
    navLinks.find((l) =>
      l.href === "/" ? pathname === "/" : pathname.startsWith(l.href),
    )?.href ??
    null;

  return (
    <nav
      data-no-print
      aria-label="Site navigation"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 240ms cubic-bezier(0.32, 0.72, 0, 1)",
      }}
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--canvas)]/90 backdrop-blur-sm border-b border-[var(--rule)]"
    >
      <div className="max-w-[880px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-fraunces)] text-[18px] text-[var(--ink)] no-underline hover:no-underline font-normal tracking-tight"
        >
          Saikiran
        </Link>
        <ul
          className="flex items-center gap-6 list-none m-0 p-0"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className={[
                    "font-[family-name:var(--font-jetbrains-mono)] text-[12px] uppercase tracking-[0.08em] no-underline transition-colors relative pb-1",
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                  ].join(" ")}
                >
                  {link.label}
                  {indicatorHref === link.href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent)]"
                      transition={{ duration: 0.2, ease: easings.snap }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
          <li className="flex items-center">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
