"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "@/content/copy";
import { copyEmail } from "@/lib/email";
import styles from "./CopyEmail.module.css";

/**
 * Shared state for every "copy the email" control: copies the address and
 * shows a confirmation toast for two seconds.
 */
export function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyEmail(navigator.clipboard);
    if (!ok) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const toast = (
    <div
      className={styles.toast}
      data-on={copied}
      role="status"
      data-testid="copy-toast"
    >
      {copied ? COPY.ui.copied : ""}
    </div>
  );

  return { copy, copied, toast };
}
