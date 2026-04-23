import { getAllWork, getAllWriting } from "@/lib/content";
import { HomepageClient } from "./HomepageClient";

export default async function HomePage() {
  const work = getAllWork().slice(0, 5);
  const writing = getAllWriting().slice(0, 3);

  return <HomepageClient work={work} writing={writing} />;
}
