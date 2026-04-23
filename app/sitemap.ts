import type { MetadataRoute } from "next";
import { getAllWork, getAllWriting } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://saikiran.dev";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, priority: 1.0 },
    { url: `${base}/about`, lastModified: now, priority: 0.9 },
    { url: `${base}/work`, lastModified: now, priority: 0.9 },
    { url: `${base}/writing`, lastModified: now, priority: 0.9 },
    { url: `${base}/cv`, lastModified: now, priority: 0.7 },
  ];

  const workRoutes: MetadataRoute.Sitemap = getAllWork().map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
    priority: 0.8,
  }));

  const writingRoutes: MetadataRoute.Sitemap = getAllWriting().map((p) => ({
    url: `${base}/writing/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...writingRoutes];
}
