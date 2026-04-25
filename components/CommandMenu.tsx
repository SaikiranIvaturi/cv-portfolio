"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "open";
  action: () => void;
}

const NAV_SHORTCUTS: Record<string, string> = {
  h: "/",
  w: "/work",
  p: "/projects",
  r: "/writing",
  a: "/about",
  c: "/cv",
};

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [gPressed, setGPressed] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const gTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    { id: "home",     label: "Home",        hint: "G → H", group: "navigate", action: () => router.push("/") },
    { id: "work",     label: "Work",        hint: "G → W", group: "navigate", action: () => router.push("/work") },
    { id: "projects", label: "Projects",    hint: "G → P", group: "navigate", action: () => router.push("/projects") },
    { id: "writing",  label: "Writing",     hint: "G → R", group: "navigate", action: () => router.push("/writing") },
    { id: "about",    label: "About",       hint: "G → A", group: "navigate", action: () => router.push("/about") },
    { id: "cv",       label: "CV / Resume", hint: "G → C", group: "navigate", action: () => router.push("/cv") },
    { id: "github",   label: "GitHub ↗",    hint: "external", group: "open",     action: () => window.open("https://github.com/SaikiranIvaturi", "_blank") },
    { id: "email",    label: "Send email ↗", hint: "external", group: "open",     action: () => { window.location.href = "mailto:ivaturisaikiran@gmail.com"; } },
    { id: "linkedin", label: "LinkedIn ↗",  hint: "external", group: "open",     action: () => window.open("https://www.linkedin.com/in/saikiran-ivaturi/", "_blank") },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  // Open via custom event dispatched from Nav
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("cmd-menu-open", onOpen);
    return () => window.removeEventListener("cmd-menu-open", onOpen);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }

      if (open) return;

      const tag = (e.target as HTMLElement).tagName;
      const editable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;
      if (editable) return;

      if (e.key === "g" || e.key === "G") {
        setGPressed(true);
        clearTimeout(gTimer.current);
        gTimer.current = setTimeout(() => setGPressed(false), 1000);
        return;
      }

      if (gPressed && NAV_SHORTCUTS[e.key.toLowerCase()]) {
        e.preventDefault();
        router.push(NAV_SHORTCUTS[e.key.toLowerCase()]);
        setGPressed(false);
        clearTimeout(gTimer.current);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [open, gPressed, router]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        filtered[selectedIndex]?.action();
        setOpen(false);
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  const navItems = filtered.filter((c) => c.group === "navigate");
  const openItems = filtered.filter((c) => c.group === "open");

  const renderGroup = (items: Command[], label: string) => {
    if (items.length === 0) return null;
    return (
      <div key={label}>
        <p className="px-3 pt-3 pb-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--ink-subtle)]">
          {label}
        </p>
        {items.map((cmd) => {
          const globalIdx = filtered.indexOf(cmd);
          return (
            <button
              key={cmd.id}
              onClick={() => { cmd.action(); setOpen(false); }}
              onMouseEnter={() => setSelectedIndex(globalIdx)}
              className={[
                "w-full flex items-center justify-between px-3 py-2 text-left transition-colors duration-100 rounded-md mx-1",
                globalIdx === selectedIndex
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--ink)] hover:bg-[var(--accent-soft)]",
              ].join(" ")}
              style={{ width: "calc(100% - 8px)" }}
            >
              <span className="font-[family-name:var(--font-inter-tight)] text-[14px]">
                {cmd.label}
              </span>
              {cmd.hint && cmd.hint !== "external" && (
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--ink-subtle)] shrink-0">
                  {cmd.hint}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[var(--ink)]/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[18vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-[520px] px-4"
            role="dialog"
            aria-label="Command menu"
            aria-modal="true"
          >
            <div className="bg-[var(--canvas)] border border-[var(--rule)] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--rule)]">
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-jetbrains-mono)] text-[14px] text-[var(--ink-subtle)] shrink-0"
                >
                  ⌘
                </span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search…"
                  aria-label="Search commands"
                  className="flex-1 bg-transparent font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-subtle)] outline-none"
                />
                <kbd className="shrink-0">ESC</kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="py-2 max-h-[340px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-8 text-center font-[family-name:var(--font-inter-tight)] text-[14px] text-[var(--ink-subtle)]">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  <>
                    {renderGroup(navItems, "Navigate")}
                    {renderGroup(openItems, "Open")}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-5 px-4 py-2.5 border-t border-[var(--rule)]">
                {[
                  ["↑↓", "navigate"],
                  ["↵", "select"],
                  ["esc", "close"],
                ].map(([key, action]) => (
                  <span key={action} className="flex items-center gap-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--ink-subtle)]">
                    <kbd>{key}</kbd> {action}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
