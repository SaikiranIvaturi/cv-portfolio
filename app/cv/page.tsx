import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CVClient } from "./CVClient";

export const metadata: Metadata = buildMetadata({
  title: "CV",
  description:
    "Curriculum vitae of Saikiran — Software Engineer II with 5+ years of React, Redux, and TypeScript experience.",
  path: "/cv",
});

export default function CVPage() {
  return <CVClient />;
}
