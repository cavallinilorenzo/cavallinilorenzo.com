import { PageIntro } from "@/components/PageIntro";
import { COPY, PAGES } from "@/content/copy";

export const metadata = {
  title: { absolute: PAGES.freelance.title },
  description: PAGES.freelance.description,
};

export default function FreelancePage() {
  return (
    <PageIntro title={COPY.freelance.title} intro={COPY.freelance.intro} />
  );
}
