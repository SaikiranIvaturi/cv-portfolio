import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getAllWriting } from "@/lib/content";
import { WritingListClient } from "./WritingListClient";

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description: "Technical writing and process notes from Saikiran — mostly React, auth flows, and frontend craft.",
  path: "/writing",
});

export default function WritingPage() {
  const posts = getAllWriting();
  return <WritingListClient posts={posts} />;
}
