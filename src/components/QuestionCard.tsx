"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Question } from "@/lib/types";
import { qKey, setUserAnswer, getUserAnswers } from "@/lib/storage";
import clsx from "clsx";
import styles from "./QuestionCard.module.css";

type Props = {
  q: Question;
  year: number;
  block: number;
  onAnswered?: (correct: boolean) => void;
  onNext?: () => void;
  canAdvance?: boolean;
};

function eqSet(a: number[], b: number[]) {
  const A = [...a].sort().join(",");
  const B = [...b].sort().join(",");
  return A === B;
}

export default function QuestionCard({ q, year, block, onAnswered, onNext, canAdvance }: Props) {
  const key = qKey(year, block, q.number);
  const [picks, setPicks] = useState<number[]>([]);
  const [graded, setGraded] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    skipSave.current = true;
    const stored = getUserAnswers()[key] ?? [];
    setPicks(stored);
    setGraded(false);
  }, [key]);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    setUserAnswer(key, picks);
  }, [key, picks]);

  const isMultiple = q.type !== "single";
  const inputType = isMultiple ? "checkbox" : "radio";
  const groupName = `q-${key}`;

  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const n = Number(e.key);
    if (n >= 1 && n <= q.choices.length) {
      e.preventDefault();
      toggle(n);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      grade();
    }
  }

  function set(val: number[]) {
    setPicks(val);
  }

  function toggle(n: number) {
    if (q.type === "single") {
      set([n]);
      setGraded(false);
      return;
    }
    const cur = new Set(picks);
    if (cur.has(n)) cur.delete(n);
    else cur.add(n);

    const max = q.type === "x2" ? 2 : 3;
    const arr = Array.from(cur);
    if (arr.length > max) arr.shift();

    set(arr);
    setGraded(false);
  }

  function grade() {
    const ok = eqSet(picks, q.answer);
    setGraded(true);
    onAnswered?.(ok);
  }

  const picked = new Set(picks);
  const correct = eqSet(picks, q.answer);
  const canShowNext = graded && !!onNext && canAdvance;

  return (
    <div tabIndex={0} onKeyDown={handleKey} className={styles.card}>
      <div className={styles.header}>
        <span>
          {year}年 Block {block}
        </span>
        <span>
          Q{q.number} / {q.type.toUpperCase()}
        </span>
      </div>

      <div className={styles.stem}>{q.stem}</div>

      {q.images && q.images.length > 0 && (
        <div className={styles.mediaGrid}>
          {q.images.map((src, idx) => (
            <figure key={src} className={styles.mediaItem}>
              <Image
                src={src}
                alt={`問題 ${q.number} の参考画像 ${idx + 1}`}
                width={1024}
                height={768}
                className={styles.mediaImage}
                sizes="(max-width: 640px) 100vw, 720px"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </figure>
          ))}
        </div>
      )}

      <ol className={styles.choiceList}>
        {q.choices.map((c, i) => {
          const idx = i + 1;
          const isPicked = picked.has(idx);
          const isAnswer = q.answer.includes(idx);
          const inputId = `${groupName}-choice-${idx}`;

          return (
            <li key={idx}>
              <label
                htmlFor={inputId}
                className={clsx(styles.choice, isPicked && styles.choicePicked)}
              >
                <input
                  id={inputId}
                  name={groupName}
                  type={inputType}
                  value={idx}
                  checked={isPicked}
                  onChange={() => toggle(idx)}
                />
                <div className={styles.choiceBody}>
                  <span className={styles.choiceIndex}>選択肢 {idx}</span>
                  <span>{c}</span>
                  <span className={styles.pickedTag}>選択中</span>
                  {graded && isAnswer && <span className={styles.answerHint}>正解</span>}
                </div>
              </label>
            </li>
          );
        })}
      </ol>

      {graded && (
        <div
          className={clsx(
            styles.statusPanel,
            correct ? styles.statusPanelCorrect : styles.statusPanelWrong
          )}
        >
          <div className={styles.statusTitle}>{correct ? "正解です" : "不正解です"}</div>

          {q.explanation && <p>{q.explanation}</p>}

          <div className={styles.statusMeta}>答え: {q.answer.join(", ")}</div>

          <div className={styles.statusMeta}>ショートカット: 1-5 で選択 / Enter で採点</div>
        </div>
      )}

      {!graded && (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={grade}
            className={styles.scoreButton}
            disabled={picks.length === 0}
            aria-disabled={picks.length === 0}
          >
            採点する
          </button>
        </div>
      )}

      {canShowNext && (
        <div className={styles.actions}>
          <button type="button" onClick={onNext} className={styles.nextButton}>
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
}
