import { PageIntro } from "@/components/PageIntro";
import { ProjectGrid } from "@/components/ProjectCard";
import { COPY, PAGES } from "@/content/copy";
import { PROJECTS } from "@/content/projects";

export const metadata = {
  title: { absolute: PAGES.projects.title },
  description: PAGES.projects.description,
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro title={COPY.projects.title} intro={COPY.projects.intro} />
      <ProjectGrid projects={PROJECTS} />
    </>
  );
}
