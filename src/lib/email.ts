export const EMAIL = "hello@cavallinilorenzo.com";
export const MAILTO = `mailto:${EMAIL}`;

type ClipboardLike = { writeText(text: string): Promise<void> };

/** Copies the public address. Resolves true on success, false otherwise. */
export async function copyEmail(
  clipboard: ClipboardLike | undefined,
): Promise<boolean> {
  if (!clipboard) return false;
  try {
    await clipboard.writeText(EMAIL);
    return true;
  } catch {
    return false;
  }
}
