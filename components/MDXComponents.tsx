import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-[family-name:var(--font-fraunces)] text-[32px] font-normal tracking-[-0.02em] text-[var(--ink)] mt-12 mb-4 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-[family-name:var(--font-fraunces)] text-[22px] font-[500] text-[var(--ink)] mt-10 mb-3 leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-[family-name:var(--font-fraunces)] text-[19px] font-[500] text-[var(--ink)] mt-8 mb-2 leading-snug">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-[17px] text-[var(--ink)] leading-[1.75] mb-5">
        {children}
      </p>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline underline-offset-[4px] decoration-[1px] hover:decoration-[2px] transition-all"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href ?? "#"}
          className="text-[var(--accent)] underline underline-offset-[4px] decoration-[1px] hover:decoration-[2px] transition-all"
        >
          {children}
        </Link>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-5 mb-5 space-y-1 text-[17px] text-[var(--ink)] leading-[1.75]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-5 mb-5 space-y-1 text-[17px] text-[var(--ink)] leading-[1.75]">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[var(--accent)] pl-6 my-8 font-[family-name:var(--font-fraunces)] italic text-[22px] text-[var(--ink-muted)] leading-relaxed">
        {children}
      </blockquote>
    ),
    hr: () => (
      <div className="my-12 flex items-center justify-center">
        <span className="text-[var(--accent)] text-[18px]">✦</span>
      </div>
    ),
    img: (props) => (
      <figure className="my-8 -mx-4 sm:mx-0">
        <Image
          {...(props as ImageProps)}
          alt={props.alt ?? ""}
          width={720}
          height={480}
          className="w-full rounded-sm object-cover"
          style={{ height: "auto" }}
        />
        {props.alt && (
          <figcaption className="text-center font-[family-name:var(--font-fraunces)] italic text-[13px] text-[var(--ink-muted)] mt-3">
            {props.alt}
          </figcaption>
        )}
      </figure>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full text-[15px] border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="text-left font-[family-name:var(--font-inter-tight)] font-[600] text-[12px] uppercase tracking-[0.06em] text-[var(--ink-muted)] border-b border-[var(--rule)] pb-2 pr-4">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="text-[var(--ink)] border-b border-[var(--rule)] py-2 pr-4 align-top">
        {children}
      </td>
    ),
    strong: ({ children }) => (
      <strong className="font-[600] text-[var(--ink)]">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="font-[family-name:var(--font-fraunces)] italic">{children}</em>
    ),
    code: ({ children }) => (
      <code className="font-[family-name:var(--font-jetbrains-mono)] text-[14px] bg-[var(--accent-soft)] px-[6px] py-[2px] rounded-[4px]">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-[var(--surface)] border border-[var(--rule)] rounded-[6px] p-5 overflow-x-auto my-6 text-[13px] leading-[1.7]">
        {children}
      </pre>
    ),
  };
}
