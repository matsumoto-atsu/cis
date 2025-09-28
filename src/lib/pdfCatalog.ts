export type PdfDoc = {
  slug: string;
  label: string;
  path: string;
  description?: string;
};

export type PdfYear = {
  year: number;
  answer?: PdfDoc;
  blocks: PdfDoc[];
};

const pdfCatalog: PdfYear[] = [
  {
    year: 2023,
    answer: {
      slug: "answer",
      label: "Answer PDF",
      path: "/pdfs/2023/answer.pdf",
      description: "2023 年度の全ブロックをまとめた PDF",
    },
    blocks: Array.from({ length: 8 }, (_, index) => {
      const blockNumber = index + 1;
      return {
        slug: `block${blockNumber}`,
        label: `Block ${blockNumber}`,
        path: `/pdfs/2023/block${blockNumber}.pdf`,
      };
    }),
  },
];

export function getPdfCatalog(): PdfYear[] {
  return pdfCatalog;
}

export function getPdfYear(year: number): PdfYear | undefined {
  return pdfCatalog.find((entry) => entry.year === year);
}

export function getPdfDoc(year: number, slug: string): PdfDoc | undefined {
  const yearEntry = getPdfYear(year);
  if (!yearEntry) {
    return undefined;
  }

  if (slug === "answer") {
    return yearEntry.answer;
  }

  return yearEntry.blocks.find((doc) => doc.slug === slug);
}
