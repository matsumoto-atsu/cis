"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import QuestionCard from "@/components/QuestionCard";
import styles from "./QuizClient.module.css";

export default function QuizClient({ year, block }: { year: number; block: number }) {
  const [all, setAll] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch("/data/questions.sample.json", { signal: controller.signal });
        if (!res.ok) throw new Error(`failed to load questions: ${res.status}`);

        const qs: Question[] = await res.json();
        const filtered = qs
          .filter(q => q.year === year && q.block === block)
          .sort((a, b) => a.number - b.number);

        setAll(filtered);
        setIdx(0);
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        console.error(err);
        setAll([]);
        setIdx(0);
      }
    }

    load();
    return () => controller.abort();
  }, [year, block]);

  const q = all[idx];
  const total = all.length;
  const hasPrev = idx > 0;
  const hasNext = idx < total - 1;
  const next = () => setIdx(i => (i < total - 1 ? i + 1 : i));
  const prev = () => setIdx(i => (i > 0 ? i - 1 : i));
  const progress = useMemo(() => (total ? `${idx + 1} / ${total}` : ""), [idx, total]);

  return (
    <main className={styles.wrapper}>
      <header className={styles.topBar}>
        <div className={styles.headingGroup}>
          <Link href="/" className="button-base button-secondary">
            <span aria-hidden>←</span>
            ホームに戻る
          </Link>
          <h1 className={styles.title}>
            {year} / Block {block}
          </h1>
          <div className={styles.progress}>{progress}</div>
        </div>
        <div className={styles.navButtons}>
          <button
            type="button"
            onClick={prev}
            disabled={!hasPrev}
            className={styles.navButton}
          >
            <span aria-hidden>←</span>
            前へ
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!hasNext}
            className={styles.navButton}
          >
            次へ
            <span aria-hidden>→</span>
          </button>
        </div>
      </header>

      {!q && <p className={styles.emptyState}>問題がありません。</p>}
      {q && <QuestionCard q={q} year={year} block={block} />}
    </main>
  );
}
