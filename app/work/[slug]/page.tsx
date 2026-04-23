import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllWork, getWorkBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { WorkDetailClient } from "./WorkDetailClient";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWork().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getWorkBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.lede,
    path: `/work/${slug}`,
  });
}

export default async function WorkSlugPage({ params }: Params) {
  const { slug } = await params;
  const post = getWorkBySlug(slug);
  if (!post) notFound();

  const allWork = getAllWork();
  const currentIndex = allWork.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? allWork[currentIndex - 1] : null;
  const next = currentIndex < allWork.length - 1 ? allWork[currentIndex + 1] : null;

  const { default: MDXContent } = await import(
    `@/content/work/${slug}.mdx`
  );

  return (
    <WorkDetailClient post={post} prev={prev} next={next}>
      <MDXContent />
    </WorkDetailClient>
  );
}
