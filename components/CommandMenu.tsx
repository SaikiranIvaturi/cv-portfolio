"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: string;
  group: "navigate" | "open";
  action: () => void;
}

const NAV_SHORTCUTS: Record<string, string> = {
  h: "/",
  w: "/work",
  r: "/writing",
  a: "/about",
  c: "/cv",
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function CommandMenu() {
  const [open,          setOpen]          = useState(false);
  const [query,         setQuery]         = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [gPressed,      setGPressed]      = useState(false);
  const router    = useRouter();
  const inputRef  = useRef<HTMLInputElement>(null);
  const gTimer    = useRef<ReturnType<typeof setTimeout>>(undefined);
  const listRef   = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    { id: "home",     label: "Home",         hint: "G → H", icon: "↖",  group: "navigate", action: () => router.push("/") },
    { id: "work",     label: "Work",          hint: "G → W", icon: "→",  group: "navigate", action: () => router.push("/work") },
    { id: "writing",  label: "Writing",       hint: "G → R", icon: "→",  group: "navigate", action: () => router.push("/writing") },
    { id: "about",    label: "About",         hint: "G → A", icon: "→",  group: "navigate", action: () => router.push("/about") },
    { id: "cv",       label: "CV / Resume",   hint: "G → C", icon: "→",  group: "navigate", action: () => router.push("/cv") },
    { id: "github",   label: "GitHub",        hint: "↗",     icon: "↗",  group: "open",     action: () => window.open("https://github.com/SaikiranIvaturi", "_blank") },
    { id: "email",    label: "Send Email",    hint: "↗",     icon: "↗",  group: "open",     action: () => { window.location.href = "mailto:ivaturisaikiran@gmail.com"; } },
    { id: "linkedin", label: "LinkedIn",      hint: "↗",     icon: "↗",  group: "open",     action: () => window.open("https://www.linkedin.com/in/saikiran-ivaturi/", "_blank") },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const navItems  = filtered.filter((c) => c.group === "navigate");
  const openItems = filtered.filter((c) => c.group === "open");

  // Open via custom event from Nav button
  useEffect(() => {
    const onOpen = () => { setOpen(true); };
    window.addEventListener("cmd-menu-open", onOpen);
    return () => window.removeEventListener("cmd-menu-open", onOpen);
  }, []);

  // ⌘K toggle + G→X shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (open) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;
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

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Scroll selected into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    (list.children[selectedIndex] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter")     { filtered[selectedIndex]?.action(); setOpen(false); }
    if (e.key === "Escape")    { setOpen(false); }
  };

  const renderItems = (items: Command[], groupLabel: string) => {
    if (items.length === 0) return null;
    return (
      <div>
        <div className="px-5 pt-3 pb-1">
          <span className="meta-label opacity-25">{groupLabel}</span>
        </div>
        {items.map((cmd) => {
          const idx        = filtered.indexOf(cmd);
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={cmd.id}
              onClick={() => { cmd.action(); setOpen(false); }}
              onMouseEnter={() => setSelectedIndex(idx)}
              className="w-full flex items-center gap-4 px-5 py-3 text-left relative transition-colors duration-100"
              style={{ background: isSelected ? "var(--accent-soft)" : "transparent" }}
            >
              {/* Selection pill */}
              {isSelected && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}

              {/* Icon */}
              <span
                className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] w-4 shrink-0"
                style={{ color: isSelected ? "var(--accent)" : "var(--ink-subtle)" }}
              >
                {cmd.icon}
              </span>

              {/* Label */}
              <span
                className="font-[family-name:var(--font-inter-tight)] text-[15px] font-medium flex-1 min-w-0 truncate"
                style={{ color: "var(--ink)" }}
              >
                {cmd.label}
              </span>

              {/* Shortcut hint */}
              {cmd.hint && cmd.hint !== "↗" && (
                <span
                  className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] shrink-0"
                  style={{ color: isSelected ? "var(--accent)" : "var(--ink-subtle)", opacity: isSelected ? 1 : 0.5 }}
                >
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
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="fixed top-[16vh] left-1/2 -translate-x-1/2 z-[61] w-full max-w-[560px] px-4"
            role="dialog"
            aria-label="Command menu"
            aria-modal="true"
          >
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background: "var(--surface)",
                border: "0.5px solid var(--rule)",
                boxShadow: "0 48px 120px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.06) inset",
              }}
            >
              {/* Search bar */}
              <div className="flex items-center gap-3 px-5 py-4 border-b-[0.5px] border-[var(--rule)]">
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-[var(--accent)] shrink-0"
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
                  className="flex-1 bg-transparent font-[family-name:var(--font-inter-tight)] text-[16px] text-[var(--ink)] placeholder:text-[var(--ink-subtle)] outline-none"
                />
                <span className="meta-label opacity-25 shrink-0 hidden sm:block">COMMAND</span>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[360px] overflow-y-auto py-1.5"
              >
                {filtered.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="font-[family-name:var(--font-fraunces)] text-[20px] text-[var(--ink-subtle)] italic mb-1">
                      No results.
                    </p>
                    <p className="meta-label opacity-30">{query}</p>
                  </div>
                ) : (
                  <>
                    {renderItems(navItems, "NAVIGATE")}
                    {navItems.length > 0 && openItems.length > 0 && (
                      <div className="mx-5 my-2 border-t-[0.5px] border-[var(--rule)]" />
                    )}
                    {renderItems(openItems, "OPEN")}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-5 px-5 py-3 border-t-[0.5px] border-[var(--rule)]">
                {[
                  ["↑↓", "navigate"],
                  ["↵",  "open"],
                  ["esc", "close"],
                ].map(([key, label]) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--ink-subtle)] opacity-50"
                  >
                    <kbd
                      style={{
                        fontFamily: "inherit",
                        fontSize: "9px",
                        background: "var(--canvas)",
                        border: "0.5px solid var(--rule)",
                        padding: "2px 4px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {key}
                    </kbd>
                    {label}
                  </span>
                ))}

                {/* G-chord indicator */}
                <AnimatePresence>
                  {gPressed && (
                    <motion.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="ml-auto meta-label text-[var(--accent)]"
                    >
                      G pressed — type H W R A C
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
