"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./QuestionComments.module.css";

type Comment = {
  id: string;
  body: string;
  author: string;
  createdAt: string;
  isMine: boolean;
};

type Props = {
  year: number;
  block: number;
  number: number;
};

export default function QuestionComments({ year, block, number }: Props) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const endpoint = useMemo(
    () => `/api/questions/${year}/${block}/${number}/comments`,
    [year, block, number],
  );

  const fieldId = useMemo(() => `question-comment-${year}-${block}-${number}`, [year, block, number]);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const res = await fetch(endpoint, { signal: controller.signal, cache: "no-store" });
        if (!res.ok) {
          throw new Error(`failed: ${res.status}`);
        }

        const payload = (await res.json().catch(() => null)) as { comments?: Comment[] } | null;
        if (!cancelled) {
          setComments(payload?.comments ?? []);
        }
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError" || cancelled) return;
        console.error(err);
        setError("コメントの読み込みに失敗しました");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [endpoint, refreshIndex]);

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  function triggerRefresh() {
    setRefreshIndex(index => index + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) return;
    const trimmed = body.trim();
    if (!trimmed) {
      setFormError("コメントを入力してください");
      return;
    }

    setPosting(true);
    setFormError(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });

      const payload = (await res.json().catch(() => null)) as { comment?: Comment; error?: string } | null;

      if (!res.ok) {
        throw new Error(payload?.error ?? "コメントの投稿に失敗しました");
      }

      if (payload?.comment) {
        const comment = payload.comment;
        setComments(prev => {
          const withoutDup = prev.filter(existing => existing.id !== comment.id);
          return [...withoutDup, comment];
        });
      } else {
        triggerRefresh();
      }

      setBody("");
    } catch (err) {
      console.error(err);
      setFormError(err instanceof Error ? err.message : "コメントの投稿に失敗しました");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!isAuthenticated) return;
    const confirmed = window.confirm("コメントを削除しますか？");
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(commentId);

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId }),
      });

      const payload = (await res.json().catch(() => null)) as { success?: boolean; error?: string } | null;

      if (!res.ok) {
        throw new Error(payload?.error ?? "コメントの削除に失敗しました");
      }

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error(err);
      setDeleteError(err instanceof Error ? err.message : "コメントの削除に失敗しました");
    } finally {
      setDeletingId(null);
    }
  }

  function renderList() {
    if (loading) {
      return <p className={styles.message}>コメントを読み込み中...</p>;
    }
    if (error) {
      return (
        <div className={styles.errorRow}>
          <p className={styles.errorText}>{error}</p>
          <button type="button" className={styles.refreshButton} onClick={triggerRefresh}>
            再読み込み
          </button>
        </div>
      );
    }
    if (comments.length === 0) {
      return <p className={styles.message}>まだコメントはありません</p>;
    }

    return (
      <ul className={styles.list}>
        {comments.map(comment => (
          <li key={comment.id} className={styles.comment}>
            <div className={styles.meta}>
              <span className={styles.author}>{comment.author}</span>
              <time dateTime={comment.createdAt} className={styles.timestamp}>
                {dateFormatter.format(new Date(comment.createdAt))}
              </time>
            </div>
            <p className={styles.body}>{comment.body}</p>
            {comment.isMine && (
              <div className={styles.commentActions}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                >
                  {deletingId === comment.id ? "削除中..." : "削除"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <p className={styles.heading}>匿名なので好きなようにメモ的に書き込んでください。殺害予告や違法薬物の取引等はここでやらないでください</p>
        <button type="button" className={styles.refreshButton} onClick={triggerRefresh} disabled={loading}>
          更新
        </button>
      </div>

      {deleteError && <p className={styles.deleteError}>{deleteError}</p>}

      {renderList()}

      <div className={styles.divider} />

      {isAuthenticated ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor={fieldId} className={styles.formLabel}>
            コメントを投稿
          </label>
          <textarea
            id={fieldId}
            className={styles.textarea}
            placeholder="匿名なのでご自由にどうぞ"
            value={body}
            onChange={event => setBody(event.target.value)}
            rows={3}
            disabled={posting}
          />
          {formError && <p className={styles.formError}>{formError}</p>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.submit} disabled={posting}>
              {posting ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </form>
      ) : (
        <p className={styles.signInPrompt}>
          <Link href="/login">ログイン</Link>するとコメントできます
        </p>
      )}
    </div>
  );
}
