import { PageIntro } from "@/components/PageIntro";
import { COPY, PAGES } from "@/content/copy";

export const metadata = {
  title: { absolute: PAGES.links.title },
  description: PAGES.links.description,
};

export default function LinksPage() {
  return <PageIntro title={COPY.links.title} intro={COPY.links.intro} />;
}
