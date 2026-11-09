import { EmailTile } from "@/components/EmailTile";
import { Glyph } from "@/components/glyphs";
import tile from "@/components/LinkTile.module.css";
import { PageIntro } from "@/components/PageIntro";
import { COPY, PAGES } from "@/content/copy";
import { PageTransition } from "@/components/PageTransition";

export const metadata = {
  title: { absolute: PAGES.links.title },
  description: PAGES.links.description,
};

export default function LinksPage() {
  return (
    <PageTransition>
      <PageIntro title={COPY.links.title} intro={COPY.links.intro} />
      <div className={tile.grid}>
        {COPY.links.items.map((item) =>
          item.id === "mail" ? (
            <EmailTile key={item.id} glyph={<Glyph name="mail" />} />
          ) : (
            <a
              key={item.id}
              className={tile.tile}
              data-reveal="card"
              href={`https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Glyph name={item.id} />
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <span className={tile.url}>
                <span>{item.url}</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          ),
        )}
      </div>
    </PageTransition>
  );
}
