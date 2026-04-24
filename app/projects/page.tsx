import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ProjectsClient } from "./ProjectsClient";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Personal projects and apps built by Saikiran — browser-based tools, experiments, and side work.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsClient />;
}
