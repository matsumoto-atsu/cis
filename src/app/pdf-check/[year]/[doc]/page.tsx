import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../../pdf.module.css";
import { getPdfDoc } from "@/lib/pdfCatalog";

type Params = {
  params: {
    year: string;
    doc: string;
  };
};

export default function PdfViewerPage({ params }: Params) {
  const year = Number(params.year);
  if (!Number.isInteger(year)) {
    notFound();
  }

  const pdfDoc = getPdfDoc(year, params.doc);
  if (!pdfDoc) {
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
        <Link className={styles.breadcrumbLink} href={`/pdf-check/${year}`}>
          {year} 年度
        </Link>
        <span>/</span>
        <span>{pdfDoc.label}</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{pdfDoc.label}</h1>
        <p className={styles.description}>
          ブラウザでのプレビューは行わず、必要に応じて新しいタブで開くかファイルをダウンロードしてください。
        </p>
        <div className={styles.cardActions}>
          <Link className={styles.linkButton} href={pdfDoc.path} target="_blank" rel="noreferrer">
            新しいタブで開く
          </Link>
          <Link className={styles.linkButton} href={pdfDoc.path} download>
            PDF をダウンロード
          </Link>
        </div>
      </header>
    </main>
  );
}
