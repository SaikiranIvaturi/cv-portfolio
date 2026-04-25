import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const SOCIALS = [
  { label: "GITHUB",   href: "https://github.com/SaikiranIvaturi",            external: true },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/saikiran-ivaturi/", external: true },
  { label: "MAIL",     href: "mailto:ivaturisaikiran@gmail.com",               external: false },
  { label: "CV",       href: "/cv",                                            external: false },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-no-print
      className="border-t-[0.5px] border-[var(--rule)] px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
    >
      <div className="flex flex-wrap gap-8">
        {SOCIALS.map(({ label, href, external }) =>
          external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="meta-label opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-200 no-underline"
            >
              {label}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              className="meta-label opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-200 no-underline"
            >
              {label}
            </Link>
          )
        )}
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle />
        <p className="meta-label opacity-25">©{year} SAIKIRAN IVATURI</p>
      </div>
    </footer>
  );
}
