import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getAllWork } from "@/lib/content";
import { WorkListClient } from "./WorkListClient";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description: "Selected case studies from Saikiran — React and TypeScript projects in healthcare and finance.",
  path: "/work",
});

export default function WorkPage() {
  const work = getAllWork();
  return <WorkListClient work={work} />;
}
