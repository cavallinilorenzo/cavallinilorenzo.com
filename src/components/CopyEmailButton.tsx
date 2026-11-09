"use client";

import { COPY } from "@/content/copy";
import styles from "./CopyEmail.module.css";
import { useCopyEmail } from "./useCopyEmail";

/** Outlined "Copy email" button: copies the public address and confirms it. */
export function CopyEmailButton() {
  const { copy, toast } = useCopyEmail();
  return (
    <>
      <button type="button" className={styles.btn} onClick={copy}>
        {COPY.ui.copyEmail}
      </button>
      {toast}
    </>
  );
}
