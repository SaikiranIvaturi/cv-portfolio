import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "About Saikiran — frontend engineer at Carelon Global Solutions, Delhi.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutClient />;
}
