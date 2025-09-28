import Link from "next/link";

import styles from "./pdf.module.css";
import { getPdfCatalog } from "@/lib/pdfCatalog";

export default function PdfCheckIndexPage() {
  const catalog = getPdfCatalog();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>PDF 確認</h1>
        <p className={styles.description}>
          原本の PDF をすぐに確認できるようにまとめました。年度を選んで、各ブロックや全体版（Answer）を開いてください。
        </p>
      </header>

      <section className={styles.cardGrid}>
        {catalog.map((entry) => (
          <article key={entry.year} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{entry.year} 年度</h2>
              <span className={styles.cardMeta}>
                {entry.blocks.length} ブロック
              </span>
            </div>
            <p className={styles.cardMeta}>
              PDF 原稿を年度ごとに保管しています。
            </p>
            <div className={styles.cardActions}>
              {entry.answer && (
                <Link className={styles.linkButton} href={`/pdf-check/${entry.year}/answer`}>
                  Answer を開く
                </Link>
              )}
              <Link className={styles.linkButton} href={`/pdf-check/${entry.year}`}>
                ブロック一覧
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
