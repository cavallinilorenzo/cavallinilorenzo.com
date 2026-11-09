"use client";

import { COPY } from "@/content/copy";
import { EMAIL } from "@/lib/email";
import tile from "./LinkTile.module.css";
import { useCopyEmail } from "./useCopyEmail";

/** The Links page's Email tile: shows the address, copies it on click. */
export function EmailTile({ glyph }: { glyph: React.ReactNode }) {
  const { copy, toast } = useCopyEmail();
  const item = COPY.links.items[3];
  return (
    <>
      <button
        type="button"
        className={tile.tile}
        onClick={copy}
        data-testid="email-tile"
      >
        {glyph}
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
        <span className={tile.url}>
          <span>{EMAIL}</span>
          <span aria-hidden="true">⧉</span>
        </span>
      </button>
      {toast}
    </>
  );
}
