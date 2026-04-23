import Link from "next/link";

interface ProjectRowProps {
  year: string | number;
  title: string;
  description: string;
  href: string;
  tag?: string;
}

export function ProjectRow({ year, title, description, href, tag }: ProjectRowProps) {
  return (
    <article className="relative">
      <Link
        href={href}
        data-cursor="work"
        className="group relative flex items-baseline gap-6 py-4 px-4 -mx-4 no-underline border-t border-[var(--rule)] rounded-sm overflow-hidden transition-[background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--accent-soft)]"
        style={{ textDecorationColor: "transparent" }}
      >
        {/* Left accent bar — grows from 0 to full height on hover */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--accent)] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
        />

        {/* Year */}
        <span
          className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[var(--ink-subtle)] shrink-0 w-10 tabular-nums transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[var(--accent)]"
          aria-label={`Year: ${year}`}
        >
          {year}
        </span>

        <span className="flex-1 min-w-0">
          {/* Title — shifts right 4px on hover */}
          <span className="block font-[family-name:var(--font-fraunces)] text-[20px] text-[var(--ink)] font-normal leading-snug transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
            {title}
          </span>
          <span className="block font-[family-name:var(--font-inter-tight)] text-[15px] text-[var(--ink-muted)] mt-0.5 leading-snug">
            {description}
          </span>
        </span>

        {tag && (
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--ink-subtle)] uppercase tracking-[0.06em] shrink-0 hidden sm:block">
            {tag}
          </span>
        )}
      </Link>
    </article>
  );
}
