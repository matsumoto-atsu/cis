"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import QuestionCard from "@/components/QuestionCard";
import { clearUserAnswers, qKey } from "@/lib/storage";
import styles from "./QuizClient.module.css";

type OrderMode = "sequential" | "random";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizClient({ year, block }: { year: number; block: number }) {
  const [ordered, setOrdered] = useState<Question[]>([]);
  const [all, setAll] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [orderMode, setOrderMode] = useState<OrderMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readyForNext, setReadyForNext] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setOrdered([]);
    setAll([]);
    setIdx(0);
    setOrderMode(null);
    setLoading(true);
    setError(null);
    setReadyForNext(false);

    async function load() {
      try {
        const res = await fetch("/data/questions.json", { signal: controller.signal });
        if (!res.ok) throw new Error(`failed to load questions: ${res.status}`);

        const qs: Question[] = await res.json();
        const filtered = qs
          .filter(q => q.year === year && q.block === block)
          .sort((a, b) => a.number - b.number);

        setOrdered(filtered);
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        console.error(err);
        setOrdered([]);
        setError("問題の読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [year, block]);

  useEffect(() => {
    if (!ordered.length || !orderMode) {
      setAll([]);
      setIdx(0);
      setReadyForNext(false);
      return;
    }

    const nextAll = orderMode === "sequential" ? ordered : shuffle(ordered);
    setAll(nextAll);
    setIdx(0);
    setReadyForNext(false);
  }, [ordered, orderMode]);

  const q = all[idx];
  const total = all.length;
  const hasNext = idx < total - 1;
  const hasQuestions = total > 0;
  const progress = useMemo(() => (total ? `${idx + 1} / ${total}` : ""), [idx, total]);

  const randomDisabled = ordered.length < 2;
  const showPicker = !orderMode && !loading && !error && ordered.length > 0;
  const showEmpty = !loading && !error && ordered.length === 0;
  const showCompletion = Boolean(orderMode) && readyForNext && !hasNext && hasQuestions;

  function startWith(mode: OrderMode) {
    if (ordered.length) {
      const keys = ordered.map(qItem => qKey(year, block, qItem.number));
      clearUserAnswers(keys);
    }

    setOrderMode(mode);
    setReadyForNext(false);
  }

  function resetOrder() {
    setOrderMode(null);
    setAll([]);
    setIdx(0);
    setReadyForNext(false);
  }

  function handleAnswered() {
    setReadyForNext(true);
  }

  function goNext() {
    if (!hasNext) return;
    setIdx(i => i + 1);
    setReadyForNext(false);
  }

  return (
    <main className={styles.wrapper}>
      <header className={styles.topBar}>
        <div className={styles.headingGroup}>
          <Link href="/" className="button-base button-secondary">
            ホームに戻る
          </Link>
          <h1 className={styles.title}>
            {year} / Block {block}
          </h1>
          <div className={styles.progress}>{progress}</div>
        </div>

        {orderMode && (
          <div className={styles.controls}>
            <div className={styles.orderSummary}>
              <span>
                表示順: {orderMode === "sequential" ? "番号順" : "ランダム"}
              </span>
              <button
                type="button"
                onClick={resetOrder}
                className={`button-base button-secondary ${styles.orderReset}`}
              >
                選び直す
              </button>
            </div>
          </div>
        )}
      </header>

      {error && <p className={styles.emptyState}>{error}</p>}

      {!error && loading && <p className={styles.emptyState}>問題を読み込み中...</p>}

      {showEmpty && <p className={styles.emptyState}>問題がありません</p>}

      {showPicker && (
        <section className={styles.orderPicker}>
          <h2>表示順を選択</h2>
          <p>問題を番号順に解くか、ランダムに並べ替えて解くかを選んでください。</p>
          <div className={styles.orderChoiceGroup}>
            <button
              type="button"
              onClick={() => startWith("sequential")}
              className={`button-base button-primary ${styles.orderButton}`}
            >
              番号順で始める
            </button>
            <button
              type="button"
              onClick={() => startWith("random")}
              className={`button-base button-secondary ${styles.orderButton}`}
              disabled={randomDisabled}
            >
              ランダムで始める
            </button>
          </div>
          {randomDisabled && (
            <p className={styles.orderNote}>このブロックには1問しかありません。</p>
          )}
        </section>
      )}

      {orderMode && !error && !loading && q && (
        <>
          <QuestionCard
            key={`${year}-${block}-${q.number}`}
            q={q}
            year={year}
            block={block}
            onAnswered={handleAnswered}
            onNext={hasNext ? goNext : undefined}
            canAdvance={hasNext}
          />
          {showCompletion && (
            <div className={styles.completionNotice}>
              <p>これでこのブロックの問題をすべて解き終わりました。</p>
              <p>お疲れさまでした！</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}


