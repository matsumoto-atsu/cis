import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../pdf.module.css";
import { getPdfYear } from "@/lib/pdfCatalog";

type Params = {
  params: {
    year: string;
  };
};

export default function PdfYearPage({ params }: Params) {
  const year = Number(params.year);

  if (!Number.isInteger(year)) {
    notFound();
  }

  const pdfYear = getPdfYear(year);
  if (!pdfYear) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <nav className={styles.breadcrumbs}>
        <Link className={styles.breadcrumbLink} href="/">
          ホーム
        </Link>
        <span>/</span>
        <Link className={styles.breadcrumbLink} href="/pdf-check">
          PDF 確認
        </Link>
        <span>/</span>
        <span>{year} 年度</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{year} 年度の PDF</h1>
        <p className={styles.description}>
          Answer（全ブロック一括）とブロックごとの原稿を確認できます。
        </p>
      </header>

      <section className={styles.cardGrid}>
        {pdfYear.answer && (
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Answer</h2>
              <span className={styles.cardMeta}>全ブロック収録</span>
            </div>
            <p className={styles.cardMeta}>
              ブロック横断で内容をチェックしたいときはこちらから。
            </p>
            <div className={styles.cardActions}>
              <Link className={styles.linkButton} href={`/pdf-check/${year}/answer`}>
                開く
              </Link>
            </div>
          </article>
        )}

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>ブロック別</h2>
            <span className={styles.cardMeta}>{pdfYear.blocks.length} 件</span>
          </div>
          <p className={styles.cardMeta}>
            必要なブロックを選んで PDF を開きます。
          </p>
          <div className={styles.cardActions}>
            {pdfYear.blocks.map((block) => (
              <Link
                key={block.slug}
                className={styles.linkButton}
                href={`/pdf-check/${year}/${block.slug}`}
              >
                {block.label}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
