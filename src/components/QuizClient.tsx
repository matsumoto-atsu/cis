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
  const [startAtNumber, setStartAtNumber] = useState<number | null>(null);
  const [startInput, setStartInput] = useState("");
  const [results, setResults] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();

    setOrdered([]);
    setAll([]);
    setIdx(0);
    setOrderMode(null);
    setLoading(true);
    setError(null);
    setReadyForNext(false);
    setStartAtNumber(null);
    setStartInput("");
    setResults({});

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
      setStartAtNumber(null);
      setResults({});
      return;
    }

    const nextAll = orderMode === "sequential" ? ordered : shuffle(ordered);
    setAll(nextAll);
    if (orderMode === "sequential" && startAtNumber !== null) {
      const startIdx = nextAll.findIndex(qItem => qItem.number === startAtNumber);
      setIdx(startIdx >= 0 ? startIdx : 0);
    } else {
      setIdx(0);
    }
    setReadyForNext(false);
  }, [ordered, orderMode, startAtNumber]);

  const q = all[idx];
  const total = all.length;
  const hasNext = idx < total - 1;
  const hasQuestions = total > 0;
  const progress = useMemo(() => (total ? `${idx + 1} / ${total}` : ""), [idx, total]);

  const orderedNumbers = useMemo(() => new Set(ordered.map(qItem => qItem.number)), [ordered]);
  const lastNumber = ordered.at(-1)?.number ?? 0;
  const firstNumber = ordered[0]?.number ?? 0;
  const parsedStartInput = useMemo(() => {
    const trimmed = startInput.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isInteger(n) ? n : null;
  }, [startInput]);
  const canStartFromNumber = parsedStartInput !== null && orderedNumbers.has(parsedStartInput);

  const answeredCount = useMemo(() => Object.keys(results).length, [results]);
  const correctCount = useMemo(
    () => Object.values(results).filter(Boolean).length,
    [results]
  );
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : null;

  const randomDisabled = ordered.length < 2;
  const showPicker = !orderMode && !loading && !error && ordered.length > 0;
  const showEmpty = !loading && !error && ordered.length === 0;
  const showCompletion = Boolean(orderMode) && readyForNext && !hasNext && hasQuestions;

  function startWith(mode: OrderMode) {
    if (ordered.length) {
      const keys = ordered.map(qItem => qKey(year, block, qItem.number));
      clearUserAnswers(keys);
    }

    setStartAtNumber(null);
    setResults({});
    setOrderMode(mode);
    setReadyForNext(false);
  }

  function startFromNumber() {
    if (!canStartFromNumber || parsedStartInput === null) return;
    if (ordered.length) {
      const keys = ordered.map(qItem => qKey(year, block, qItem.number));
      clearUserAnswers(keys);
    }

    setStartAtNumber(parsedStartInput);
    setResults({});
    setOrderMode("sequential");
    setReadyForNext(false);
  }

  function resetOrder() {
    setOrderMode(null);
    setAll([]);
    setIdx(0);
    setReadyForNext(false);
    setStartAtNumber(null);
  }

  function handleAnswered(correct: boolean) {
    if (q) {
      setResults(prev => ({ ...prev, [q.number]: correct }));
    }
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
          <div className={styles.startFromForm}>
            <label className={styles.startLabel} htmlFor="start-number">
              番号を指定して開始
            </label>
            <input
              id="start-number"
              type="number"
              min={firstNumber || 1}
              max={lastNumber || undefined}
              value={startInput}
              onChange={e => setStartInput(e.target.value)}
              className={styles.startInput}
              placeholder="例: 5"
            />
            <button
              type="button"
              onClick={startFromNumber}
              className={`button-base button-secondary ${styles.orderButton}`}
              disabled={!canStartFromNumber}
            >
              番号を指定して始める
            </button>
          </div>
          <p className={styles.orderNote}>開始可能な番号: {firstNumber} 〜 {lastNumber}</p>
          {startInput.trim() && !canStartFromNumber && (
            <p className={styles.orderNote}>入力された番号の問題は見つかりません。</p>
          )}
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
            stats={{ accuracy, answeredCount, correctCount, total: ordered.length }}
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
