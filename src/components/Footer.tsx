import { COPY } from "@/content/copy";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>{COPY.footer.left}</span>
      <span>{COPY.footer.right}</span>
    </footer>
  );
}
