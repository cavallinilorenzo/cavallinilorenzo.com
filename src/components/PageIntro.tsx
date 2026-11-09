import styles from "./PageIntro.module.css";

export function PageIntro({ title, intro }: { title: string; intro: string }) {
  return (
    <div className={styles.intro}>
      <h1>{title}</h1>
      <p>{intro}</p>
    </div>
  );
}
