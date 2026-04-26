import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getAllWork } from "@/lib/content";
import { WorkListClient } from "./WorkListClient";

export const metadata: Metadata = buildMetadata({
  title: "Recent Work",
  description: "Latest projects from Saikiran — enterprise software in healthcare and personal tools.",
  path: "/work",
});

export default function WorkPage() {
  const work = getAllWork();
  return <WorkListClient work={work} />;
}
