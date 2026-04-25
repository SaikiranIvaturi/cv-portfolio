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
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastY = { current: 0 };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-no-print
      aria-label="Site navigation"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 240ms cubic-bezier(0.32, 0.72, 0, 1)",
      }}
      className="fixed top-0 left-0 w-full h-20 px-8 flex items-center justify-between border-b-[0.5px] border-[var(--rule)] bg-[var(--canvas)]/80 backdrop-blur-xl z-50"
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-[family-name:var(--font-fraunces)] text-2xl italic font-normal tracking-tight text-[var(--accent)] no-underline hover:no-underline"
        aria-label="Home"
      >
        S.
      </Link>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
        {NAV_LINKS.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
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

      {/* Right: clock + actions */}
      <div className="flex items-center gap-6">
        <span className="hidden lg:block meta-label tabular-nums">
          <LiveClock /> // AVAILABLE
        </span>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent("cmd-menu-open"))}
          aria-label="Open command menu"
          className="meta-label border-[0.5px] border-[var(--rule)] px-3 py-2 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200"
        >
          ⌘K
        </button>

        <ThemeToggle />
      </div>
    </nav>
  );
}
