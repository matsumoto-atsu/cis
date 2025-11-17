"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import type { Question } from "@/lib/types";
import QuestionCard from "@/components/QuestionCard";
import { clearUserAnswers, qKey } from "@/lib/storage";
import styles from "./QuizClient.module.css";

type OrderMode = "sequential" | "random" | "bookmarked-saved" | "bookmarked-random";
type BookmarkOrder = "saved" | "random";

type Bookmark = {
  year: number;
  block: number;
  number: number;
  createdAt: string;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizClient({ year, block }: { year: number; block: number }) {
  const { data: session, status: authStatus } = useSession();
  const [ordered, setOrdered] = useState<Question[]>([]);
  const [all, setAll] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [orderMode, setOrderMode] = useState<OrderMode | null>(null);
  const [bookmarkOrder, setBookmarkOrder] = useState<BookmarkOrder>("saved");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readyForNext, setReadyForNext] = useState(false);
  const [startAtNumber, setStartAtNumber] = useState<number | null>(null);
  const [startInput, setStartInput] = useState("");
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [togglingBookmark, setTogglingBookmark] = useState(false);

  const isAuthenticated = authStatus === "authenticated" && Boolean(session?.user);

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
    if (!isAuthenticated) {
      setBookmarks([]);
      setBookmarkError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function loadBookmarks() {
      setBookmarksLoading(true);
      setBookmarkError(null);
      try {
        const res = await fetch(`/api/bookmarks?year=${year}&block=${block}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (res.status === 401) {
          setBookmarkError("ログインが必要です");
          return;
        }
        if (!res.ok) throw new Error(`failed: ${res.status}`);
        const payload = (await res.json().catch(() => null)) as { bookmarks?: Bookmark[] } | null;
        if (!cancelled) {
          setBookmarks(payload?.bookmarks ?? []);
        }
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError" || cancelled) return;
        console.error(err);
        setBookmarkError("ブックマークの取得に失敗しました");
      } finally {
        if (!cancelled) {
          setBookmarksLoading(false);
        }
      }
    }

    loadBookmarks();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [block, isAuthenticated, year]);

  const filteredBookmarks = useMemo(
    () => bookmarks.filter(b => b.year === year && b.block === block),
    [bookmarks, year, block],
  );
  const bookmarkedNumbers = useMemo(
    () => filteredBookmarks.map(b => b.number),
    [filteredBookmarks],
  );
  const bookmarkedSet = useMemo(() => new Set(bookmarkedNumbers), [bookmarkedNumbers]);
  const bookmarkedQuestions = useMemo(() => {
    const map = new Map(ordered.map(qItem => [qItem.number, qItem] as const));
    return bookmarkedNumbers
      .map(num => map.get(num))
      .filter(Boolean) as Question[];
  }, [bookmarkedNumbers, ordered]);

    useEffect(() => {
    if (!orderMode) {
      setAll([]);
      setIdx(0);
      setReadyForNext(false);
      setStartAtNumber(null);
      return;
    }

    if (orderMode !== "sequential" && orderMode !== "random") return;

    if (!ordered.length) {
      setAll([]);
      setIdx(0);
      setReadyForNext(false);
      setStartAtNumber(null);
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
  }, [orderMode, ordered, startAtNumber]);

  useEffect(() => {
    if (orderMode !== "bookmarked-saved" && orderMode !== "bookmarked-random") return;

    const source = orderMode === "bookmarked-saved" ? bookmarkedQuestions : shuffle(bookmarkedQuestions);
    setAll(source);
    setIdx(0);
    setReadyForNext(false);
  }, [bookmarkedQuestions, orderMode]);

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
  const correctCount = useMemo(() => Object.values(results).filter(Boolean).length, [results]);
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : null;

  const randomDisabled = ordered.length < 2;
  const bookmarkCount = filteredBookmarks.length;
  const showPicker = !orderMode && !loading && !error && ordered.length > 0;
  const showEmpty = !loading && !error && ordered.length === 0;
  const showCompletion = Boolean(orderMode) && readyForNext && !hasNext && hasQuestions;
  const isCurrentBookmarked = q ? bookmarkedSet.has(q.number) : false;

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

    function startBookmarked(order: BookmarkOrder) {
    if (bookmarkCount === 0) {
      setBookmarkError("ブックマークがありません");
      return;
    }

    if (bookmarkedQuestions.length) {
      const keys = bookmarkedQuestions.map(qItem => qKey(year, block, qItem.number));
      clearUserAnswers(keys);
    }

    const mode: OrderMode = order === "saved" ? "bookmarked-saved" : "bookmarked-random";
    setBookmarkOrder(order);
    setResults({});
    setStartAtNumber(null);
    setOrderMode(mode);
    setReadyForNext(false);
  }

    function resetOrder() {
    setOrderMode(null);
    setAll([]);
    setIdx(0);
    setReadyForNext(false);
    setStartAtNumber(null);
    setBookmarkOrder("saved");
    setResults({});
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

  async function toggleBookmark() {
    if (!q || !isAuthenticated) return;
    if (togglingBookmark) return;
    setTogglingBookmark(true);
    setBookmarkError(null);

    const endpoint = "/api/bookmarks";
    const payload = { year, block, number: q.number };
    const method = isCurrentBookmarked ? "DELETE" : "POST";

    try {
      if (!isCurrentBookmarked) {
        setBookmarks(prev => [...prev, { ...payload, createdAt: new Date().toISOString() }]);
      } else {
        setBookmarks(prev => prev.filter(item => !(item.year === year && item.block === block && item.number === q.number)));
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const fallback = await res.json().catch(() => null);
        throw new Error((fallback as { error?: string } | null)?.error ?? "ブックマーク更新に失敗しました");
      }
    } catch (err) {
      console.error(err);
      setBookmarkError((err as Error).message);
      // revert
      setBookmarks(prev => {
        if (isCurrentBookmarked) {
          return [...prev, { ...payload, createdAt: new Date().toISOString() }];
        }
        return prev.filter(item => !(item.year === year && item.block === block && item.number === q.number));
      });
    } finally {
      setTogglingBookmark(false);
    }
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
                出題順: {
                  orderMode === "sequential"
                    ? "番号順"
                    : orderMode === "random"
                    ? "ランダム"
                    : bookmarkOrder === "saved"
                    ? "ブックマーク（追加順）"
                    : "ブックマーク（ランダム）"
                }
              </span>
              <button
                type="button"
                onClick={resetOrder}
                className={`button-base button-secondary ${styles.orderReset}`}
              >
                終了する
              </button>
            </div>
          </div>
        )}
      </header>

      {error && <p className={styles.emptyState}>{error}</p>}

      {!error && loading && <p className={styles.emptyState}>読み込み中...</p>}

      {showEmpty && <p className={styles.emptyState}>問題が見つかりません</p>}

      {bookmarkError && <p className={styles.orderNote}>{bookmarkError}</p>}

      {showPicker && (
        <section className={styles.orderPicker}>
          <h2>出題順を選ぶ</h2>
          <p>通常の番号順かランダム、またはブックマークだけを解くモードを選べます。</p>
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
            <p className={styles.orderNote}>入力した番号の問題はありません。</p>
          )}
          {randomDisabled && (
            <p className={styles.orderNote}>このブロックには1問しかありません。</p>
          )}

          <div className={styles.bookmarkSection}>
            <div className={styles.bookmarkHeader}>
              <span>ブックマークだけ解く</span>
              <span className={styles.bookmarkBadge}>{bookmarkCount} 件</span>
            </div>
            {!isAuthenticated && <p className={styles.orderNote}>ログインするとブックマークできます。</p>}
            <div className={styles.bookmarkButtons}>
              <button
                type="button"
                className={`button-base button-secondary ${styles.orderButton}`}
                onClick={() => startBookmarked("saved")}
                disabled={!bookmarkCount || !isAuthenticated}
              >
                追加順で解く
              </button>
              <button
                type="button"
                className={`button-base button-secondary ${styles.orderButton}`}
                onClick={() => startBookmarked("random")}
                disabled={!bookmarkCount || !isAuthenticated}
              >
                ランダムで解く
              </button>
            </div>
            {bookmarksLoading && <p className={styles.orderNote}>ブックマークを読み込み中...</p>}
            {!bookmarksLoading && bookmarkCount === 0 && (
              <p className={styles.orderNote}>ブックマークした問題はありません。</p>
            )}
          </div>
        </section>
      )}

      {orderMode && !error && !loading && q && (
        <>
          <div className={styles.questionToolbar}>
            {isAuthenticated ? (
              <button
                type="button"
                className={`button-base button-secondary ${styles.bookmarkToggle}`}
                onClick={toggleBookmark}
                disabled={togglingBookmark}
                aria-pressed={isCurrentBookmarked}
              >
                {isCurrentBookmarked ? "★ ブックマーク中" : "☆ ブックマーク"}
              </button>
            ) : (
              <span className={styles.orderNote}>ログインするとブックマークできます。</span>
            )}
          </div>
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



