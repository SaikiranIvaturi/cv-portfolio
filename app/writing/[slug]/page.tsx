import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllWriting, getWritingBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { WritingDetailClient } from "./WritingDetailClient";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWriting().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/writing/${slug}`,
  });
}

export default async function WritingSlugPage({ params }: Params) {
  const { slug } = await params;
  const post = getWritingBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllWriting();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const { default: MDXContent } = await import(
    `@/content/writing/${slug}.mdx`
  );

  return (
    <WritingDetailClient post={post} prev={prev} next={next}>
      <MDXContent />
    </WritingDetailClient>
  );
}
