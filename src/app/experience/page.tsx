import { PageIntro } from "@/components/PageIntro";
import { COPY, PAGES } from "@/content/copy";

export const metadata = {
  title: { absolute: PAGES.experience.title },
  description: PAGES.experience.description,
};

export default function ExperiencePage() {
  return (
    <PageIntro title={COPY.experience.title} intro={COPY.experience.intro} />
  );
}
