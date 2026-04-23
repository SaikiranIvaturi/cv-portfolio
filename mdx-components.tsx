import type { MDXComponents } from "mdx/types";
import { getMDXComponents } from "@/components/MDXComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...getMDXComponents(),
    ...components,
  };
}
