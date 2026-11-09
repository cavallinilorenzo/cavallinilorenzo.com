"use client";

import { COPY } from "@/content/copy";
import button from "./Button.module.css";
import { useCopyEmail } from "./useCopyEmail";

/** "Copy email" button: copies the public address and confirms it. Outlined
 *  unless a `className` restyles it. */
export function CopyEmailButton({ className }: { className?: string }) {
  const { copy, toast } = useCopyEmail();
  return (
    <>
      <button type="button" className={className ?? button.btn} onClick={copy}>
        {COPY.ui.copyEmail}
      </button>
      {toast}
    </>
  );
}
