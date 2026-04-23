import type { Metadata } from "next";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  ogTitle?: string;
}

export function buildMetadata({
  title,
  description,
  path = "",
  ogTitle,
}: PageMetaProps): Metadata {
  const url = `https://saikiran.dev${path}`;
  const displayTitle = ogTitle ?? title;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: displayTitle,
      description,
      url,
      type: "website",
      images: [
        {
          url: `/og?title=${encodeURIComponent(displayTitle)}`,
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
    },
  };
}
