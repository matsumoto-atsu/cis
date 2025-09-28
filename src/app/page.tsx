import Link from "next/link";
import styles from "./page.module.css";

const quizCatalog = [
  {
    year: 2023,
    blocks: [1, 2, 3, 4, 5, 6, 7, 8],
    description: "卒試2023 過去問セット",
  },
  {
    year: 2024,
    blocks: [1, 2, 3, 4, 5, 6, 7, 8],
    description: "卒試2024 過去問セット",
  },
];

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.utilLinks}>
        <Link href="/pdf-check" className={styles.utilLink}>
          PDF確認
        </Link>
      </div>
      <section className={styles.hero}>
        <span className={styles.badge}>Preview</span>
        <h1 className={styles.title}>CIS Quiz</h1>
        <p className={styles.lead}>
          公衆衛生・臨床医学の知識確認に使えるコンパクトなクイズツール。年次・ブロックごとに問題を選んで、すばやく復習しましょう。
        </p>
        <div className={styles.meta}>
          <span>
            現在: <strong>2023 / Block 1</strong> を収録
          </span>
          <span>今後追加予定: 解説ノートや正答率の集計</span>
        </div>
      </section>

      <section className={styles.cards}>
        {quizCatalog.map(({ year, blocks, description }) => (
          <article key={year} className={"card-surface " + styles.yearCard}>
            <div className={styles.yearCardContent}>
              <header className={styles.yearHeader}>
                <div>
                  <h2 className={styles.yearLabel}>{year}</h2>
                  <p className={styles.yearSubtext}>{description}</p>
                </div>
                <span className="text-muted-foreground">
                  {blocks.length} Block{blocks.length > 1 ? "s" : ""}
                </span>
              </header>
              <div className={styles.blockButtons}>
                {blocks.map((block) => (
                  <Link
                    key={block}
                    href={`/quiz/${year}/${block}`}
                    className={styles.blockButton}
                  >
                    Block {block}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
