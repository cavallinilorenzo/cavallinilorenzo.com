"use client";

import { COPY } from "@/content/copy";
import button from "./Button.module.css";
import { useCopyEmail } from "./useCopyEmail";

/** Outlined "Copy email" button: copies the public address and confirms it. */
export function CopyEmailButton() {
  const { copy, toast } = useCopyEmail();
  return (
    <>
      <button type="button" className={button.btn} onClick={copy}>
        {COPY.ui.copyEmail}
      </button>
      {toast}
    </>
  );
}
