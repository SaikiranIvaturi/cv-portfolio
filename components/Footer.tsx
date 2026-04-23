import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-no-print
      className="border-t border-[var(--rule)] mt-24"
    >
      <div className="max-w-[880px] mx-auto px-6 py-8 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)] m-0">
          Built with Next.js&nbsp;&middot;&nbsp;Fraunces + Inter Tight&nbsp;&middot;&nbsp;Last updated {year}
        </p>
        <ThemeToggle />
      </div>
    </footer>
  );
}
