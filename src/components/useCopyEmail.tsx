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
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyEmail(navigator.clipboard);
    setMessage(ok ? COPY.ui.copied : COPY.ui.copyFailed);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2000);
  };

  const toast = (
    <div
      className={styles.toast}
      data-on={message !== null}
      role="status"
      data-testid="copy-toast"
    >
      {message ?? ""}
    </div>
  );

  return { copy, toast };
}
