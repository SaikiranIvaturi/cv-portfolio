"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { label: "WORK",     href: "/work" },
  { label: "PROJECTS", href: "/projects" },
  { label: "WRITING",  href: "/writing" },
  { label: "ABOUT",    href: "/about" },
  { label: "CV",       href: "/cv" },
];

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time} IST</span>;
}

export function Nav() {
  const pathname    = usePathname();
  const [navVisible, setNavVisible] = useState(true);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const lastY = { current: 0 };

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Hide/show nav on scroll (skip when drawer is open)
  useEffect(() => {
    const onScroll = () => {
      if (menuOpen) return;
      const y = window.scrollY;
      setNavVisible(y < lastY.current || y < 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Bar ─────────────────────────────────────────────── */}
      <nav
        data-no-print
        aria-label="Site navigation"
        style={{
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 240ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        className="fixed top-0 left-0 w-full h-20 px-6 md:px-8 flex items-center justify-between border-b-[0.5px] border-[var(--rule)] bg-[var(--canvas)]/90 backdrop-blur-xl z-50"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-fraunces)] text-2xl italic font-normal tracking-tight text-[var(--accent)] no-underline hover:no-underline"
          aria-label="Home"
        >
          S.
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "meta-label no-underline transition-colors duration-200",
                    active ? "text-[var(--ink)]" : "hover:text-[var(--accent)]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: clock + actions + hamburger */}
        <div className="flex items-center gap-4 md:gap-6">
          <span className="hidden lg:block meta-label tabular-nums">
            <LiveClock /> // AVAILABLE
          </span>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("cmd-menu-open"))}
            aria-label="Open command menu"
            className="hidden md:block meta-label border-[0.5px] border-[var(--rule)] px-3 py-2 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200"
          >
            ⌘K
          </button>

          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
          >
            <span
              className="block w-5 h-[1px] bg-[var(--ink)] origin-center transition-all duration-300"
              style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-5 h-[1px] bg-[var(--ink)] transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-[1px] bg-[var(--ink)] origin-center transition-all duration-300"
              style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile fullscreen drawer ────────────────────────── */}
      <div
        aria-hidden={!menuOpen}
        className={[
          "fixed inset-0 z-40 bg-[var(--canvas)] flex flex-col md:hidden",
          "transition-all duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-3",
        ].join(" ")}
      >
        {/* Spacer for nav bar */}
        <div className="h-20 border-b-[0.5px] border-[var(--rule)] shrink-0" />

        {/* Links */}
        <ul className="flex flex-col flex-1 list-none m-0 px-6 pt-4 overflow-y-auto">
          {NAV_LINKS.map((link, i) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href} className="border-b-[0.5px] border-[var(--rule)]">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "flex items-center justify-between py-7 no-underline group",
                    active ? "text-[var(--accent)]" : "text-[var(--ink)]",
                  ].join(" ")}
                >
                  <span
                    className="font-[family-name:var(--font-fraunces)] font-normal uppercase tracking-[-0.03em] leading-none"
                    style={{ fontSize: "clamp(2rem, 11vw, 3.5rem)" }}
                  >
                    {link.label}
                  </span>
                  <span className="meta-label opacity-40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom strip */}
        <div className="px-6 py-6 border-t-[0.5px] border-[var(--rule)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="relative flex h-[6px] w-[6px]" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[var(--accent)]" />
            </span>
            <span className="meta-label text-[var(--accent)]">AVAILABLE</span>
          </div>
          <span className="meta-label tabular-nums opacity-50">
            <LiveClock />
          </span>
        </div>
      </div>
    </>
  );
}
