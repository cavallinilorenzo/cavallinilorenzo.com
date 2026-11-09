"use client";

import { useEffect, useRef, useState } from "react";
import { COPY, EMAIL } from "@/content/copy";
import button from "./Button.module.css";

/** Copies the public email address and confirms it. Reused across pages. */
export function CopyEmailButton({
  className = button.btn,
}: {
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className={className} onClick={copy}>
      {copied ? COPY.ui.copied : COPY.ui.copyEmail}
      <span className={button.live} role="status">
        {copied ? COPY.ui.copied : ""}
      </span>
    </button>
  );
}
