import { PageIntro } from "@/components/PageIntro";
import { COPY, PAGES } from "@/content/copy";

export const metadata = {
  title: { absolute: PAGES.projects.title },
  description: PAGES.projects.description,
};

export default function ProjectsPage() {
  return <PageIntro title={COPY.projects.title} intro={COPY.projects.intro} />;
}
