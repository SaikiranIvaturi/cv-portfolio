import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface WorkFrontmatter {
  title: string;
  description: string;
  lede: string;
  role: string;
  timeframe: string;
  stack: string;
  year: number;
  order?: number;
  outcomes?: string[];
  draft?: boolean;
}

export interface WritingFrontmatter {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  draft?: boolean;
}

export interface WorkPost {
  slug: string;
  frontmatter: WorkFrontmatter;
  content: string;
}

export interface WritingPost {
  slug: string;
  frontmatter: WritingFrontmatter;
  content: string;
  readingTime: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export function getAllWork(): WorkPost[] {
  const dir = path.join(CONTENT_DIR, "work");
  const files = getMDXFiles(dir);

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        frontmatter: data as WorkFrontmatter,
        content,
      };
    })
    .filter((p) => !p.frontmatter.draft)
    .sort((a, b) => {
      const orderA = a.frontmatter.order ?? 99;
      const orderB = b.frontmatter.order ?? 99;
      return orderA - orderB;
    });
}

export function getWorkBySlug(slug: string): WorkPost | null {
  const dir = path.join(CONTENT_DIR, "work");
  const filePath =
    fs.existsSync(path.join(dir, `${slug}.mdx`))
      ? path.join(dir, `${slug}.mdx`)
      : fs.existsSync(path.join(dir, `${slug}.md`))
      ? path.join(dir, `${slug}.md`)
      : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as WorkFrontmatter, content };
}

export function getAllWriting(): WritingPost[] {
  const dir = path.join(CONTENT_DIR, "writing");
  const files = getMDXFiles(dir);

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(raw);
      const rt = readingTime(content);
      return {
        slug,
        frontmatter: data as WritingFrontmatter,
        content,
        readingTime: rt.text,
      };
    })
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getWritingBySlug(slug: string): WritingPost | null {
  const dir = path.join(CONTENT_DIR, "writing");
  const filePath =
    fs.existsSync(path.join(dir, `${slug}.mdx`))
      ? path.join(dir, `${slug}.mdx`)
      : fs.existsSync(path.join(dir, `${slug}.md`))
      ? path.join(dir, `${slug}.md`)
      : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug,
    frontmatter: data as WritingFrontmatter,
    content,
    readingTime: rt.text,
  };
}

export function getWritingByTag(tag: string): WritingPost[] {
  return getAllWriting().filter((p) =>
    p.frontmatter.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}
