import { PageIntro } from "@/components/PageIntro";
import { Timeline } from "@/components/Timeline";
import { COPY, PAGES } from "@/content/copy";
import { TIMELINE } from "@/content/experience";
import { PageTransition } from "@/components/PageTransition";

export const metadata = {
  title: { absolute: PAGES.experience.title },
  description: PAGES.experience.description,
};

export default function ExperiencePage() {
  // "Today" is the build date (the page is static): ongoing lengths refresh on each deploy.
  const today = new Date().toISOString().slice(0, 7);
  return (
    <PageTransition>
      <PageIntro title={COPY.experience.title} intro={COPY.experience.intro} />
      <Timeline entries={TIMELINE} today={today} />
    </PageTransition>
  );
}
