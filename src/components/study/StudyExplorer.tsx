"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type {
  ChapterDetail,
  DepartmentDetail,
  DepartmentSummary,
  SectionDetail,
} from "@/lib/content-loader";
import styles from "./StudyExplorer.module.css";

interface StudyExplorerProps {
  initialDepartments: DepartmentSummary[];
  initialSelection: {
    departmentSlug?: string;
    chapterId?: string;
    sectionId?: string;
  };
}

type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: T }
  | { status: "error"; error: string };

type DepartmentState = Record<string, LoadState<DepartmentDetail>>;
type ChapterState = Record<string, Record<string, LoadState<ChapterDetail>>>;
type SectionState = Record<string, Record<string, Record<string, LoadState<SectionDetail>>>>;

type BookmarkEntry = {
  departmentSlug: string;
  departmentName: string;
  chapterId: string;
  chapterName: string;
  sectionId: string;
  sectionName: string;
  savedAt: string;
};

type SearchResult = {
  type: "department" | "chapter" | "section";
  path: string[];
  label: string;
  description?: string;
  score: number;
};

const BOOKMARK_STORAGE_KEY = "cis-study-bookmarks";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    let message = "Request failed";
    try {
      const payload = await res.json();
      if (typeof payload?.error === "string") {
        message = payload.error;
      }
    } catch {
      // ignore body parse errors
    }
    throw new Error(message);
  }
  const json = await res.json();
  return json.data as T;
}

function useBookmarks(userKey?: string) {
  const storageKey = userKey ? `${BOOKMARK_STORAGE_KEY}:${userKey}` : BOOKMARK_STORAGE_KEY;
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      setBookmarks([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as BookmarkEntry[];
      setBookmarks(parsed);
    } catch (error) {
      console.warn("Failed to parse bookmarks", error);
      setBookmarks([]);
    }
  }, [storageKey]);

  const persist = useCallback(
    (updater: BookmarkEntry[] | ((prev: BookmarkEntry[]) => BookmarkEntry[])) => {
      setBookmarks((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (prev: BookmarkEntry[]) => BookmarkEntry[])(prev)
            : updater;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        }
        return next;
      });
    },
    [storageKey],
  );

  const toggle = useCallback(
    (entry: BookmarkEntry) => {
      persist((prevBookmarks) => {
        const exists = prevBookmarks.some(
          (item) =>
            item.departmentSlug === entry.departmentSlug &&
            item.chapterId === entry.chapterId &&
            item.sectionId === entry.sectionId,
        );
        if (exists) {
          return prevBookmarks.filter(
            (item) =>
              !(
                item.departmentSlug === entry.departmentSlug &&
                item.chapterId === entry.chapterId &&
                item.sectionId === entry.sectionId
              ),
          );
        }
        return [entry, ...prevBookmarks].slice(0, 200);
      });
    },
    [persist],
  );

  const isBookmarked = useCallback(
    (departmentSlug: string, chapterId: string, sectionId: string) =>
      bookmarks.some(
        (item) =>
          item.departmentSlug === departmentSlug &&
          item.chapterId === chapterId &&
          item.sectionId === sectionId,
      ),
    [bookmarks],
  );

  return {
    bookmarks,
    setBookmarks: persist,
    toggle,
    isBookmarked,
  };
}

function normalizeChapterId(chapterId: string | undefined): string | undefined {
  if (!chapterId) return undefined;
  const normalized = chapterId.replace(/^0+/, "");
  return normalized.length > 0 ? normalized : "0";
}

function normalizeSectionId(sectionId: string | undefined): string | undefined {
  if (!sectionId) return undefined;
  return sectionId;
}

export default function StudyExplorer({ initialDepartments, initialSelection }: StudyExplorerProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionUser = session?.user as { id?: string } | undefined;
  const userId = typeof sessionUser?.id === "string" ? sessionUser.id : undefined;

  const pendingDepartmentsRef = useRef(new Map<string, Promise<DepartmentDetail>>());
  const pendingChaptersRef = useRef(new Map<string, Promise<ChapterDetail>>());
  const pendingSectionsRef = useRef(new Map<string, Promise<SectionDetail>>());

  const [departmentsState, setDepartmentsState] = useState<DepartmentState>({});
  const [chaptersState, setChaptersState] = useState<ChapterState>({});
  const [sectionsState, setSectionsState] = useState<SectionState>({});

  const [openDepartment, setOpenDepartment] = useState<string | null>(
    initialSelection.departmentSlug ?? null,
  );
  const [openChapter, setOpenChapter] = useState<string | null>(
    normalizeChapterId(initialSelection.chapterId) ?? null,
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    normalizeSectionId(initialSelection.sectionId) ?? null,
  );
  const [selectedSectionDetail, setSelectedSectionDetail] = useState<SectionDetail | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isBookmarkPanelOpen, setBookmarkPanelOpen] = useState(false);

  const bookmarksState = useBookmarks(userId);

  const refreshDepartment = useCallback(async (slug: string) => {
    const pending = pendingDepartmentsRef.current.get(slug);
    if (pending) {
      return pending;
    }

    const task = (async () => {
      setDepartmentsState((prev) => ({
        ...prev,
        [slug]: { status: "loading" },
      }));
      try {
        const detail = await fetchJSON<DepartmentDetail>(`/api/content/departments/${slug}`);
        setDepartmentsState((prev) => ({
          ...prev,
          [slug]: { status: "loaded", data: detail },
        }));
        setChaptersState((prev) => ({
          ...prev,
          [slug]: prev[slug] ?? {},
        }));
        return detail;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load department";
        setDepartmentsState((prev) => ({
          ...prev,
          [slug]: { status: "error", error: message },
        }));
        throw error;
      } finally {
        pendingDepartmentsRef.current.delete(slug);
      }
    })();

    pendingDepartmentsRef.current.set(slug, task);
    return task;
  }, []);

  const ensureDepartment = useCallback(
    async (slug: string) => {
      const current = departmentsState[slug];
      if (current?.status === "loaded") {
        return current.data;
      }
      if (current?.status === "loading") {
        return refreshDepartment(slug);
      }
      return refreshDepartment(slug);
    },
    [departmentsState, refreshDepartment],
  );

  const refreshChapter = useCallback(
    async (departmentSlug: string, chapterId: string) => {
      const key = `${departmentSlug}:${chapterId}`;
      const pending = pendingChaptersRef.current.get(key);
      if (pending) {
        return pending;
      }

      const task = (async () => {
        setChaptersState((prev) => ({
          ...prev,
          [departmentSlug]: {
            ...(prev[departmentSlug] ?? {}),
            [chapterId]: { status: "loading" },
          },
        }));
        try {
          const detail = await fetchJSON<ChapterDetail>(
            `/api/content/departments/${departmentSlug}/chapters/${chapterId}`,
          );
          setChaptersState((prev) => ({
            ...prev,
            [departmentSlug]: {
              ...(prev[departmentSlug] ?? {}),
              [chapterId]: { status: "loaded", data: detail },
            },
          }));
          setSectionsState((prev) => ({
            ...prev,
            [departmentSlug]: {
              ...(prev[departmentSlug] ?? {}),
              [chapterId]: prev[departmentSlug]?.[chapterId] ?? {},
            },
          }));
          return detail;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to load chapter";
          setChaptersState((prev) => ({
            ...prev,
            [departmentSlug]: {
              ...(prev[departmentSlug] ?? {}),
              [chapterId]: { status: "error", error: message },
            },
          }));
          throw error;
        } finally {
          pendingChaptersRef.current.delete(key);
        }
      })();

      pendingChaptersRef.current.set(key, task);
      return task;
    },
    [],
  );

  const ensureChapter = useCallback(
    async (departmentSlug: string, chapterId: string) => {
      const chapterMap = chaptersState[departmentSlug];
      const current = chapterMap?.[chapterId];
      if (current?.status === "loaded") {
        return current.data;
      }
      return refreshChapter(departmentSlug, chapterId);
    },
    [chaptersState, refreshChapter],
  );

  const refreshSection = useCallback(
    async (departmentSlug: string, chapterId: string, sectionId: string) => {
      const key = `${departmentSlug}:${chapterId}:${sectionId}`;
      const pending = pendingSectionsRef.current.get(key);
      if (pending) {
        return pending;
      }

      const task = (async () => {
        setSectionsState((prev) => ({
          ...prev,
          [departmentSlug]: {
            ...(prev[departmentSlug] ?? {}),
            [chapterId]: {
              ...(prev[departmentSlug]?.[chapterId] ?? {}),
              [sectionId]: { status: "loading" },
            },
          },
        }));
        try {
          const detail = await fetchJSON<SectionDetail>(
            `/api/content/departments/${departmentSlug}/chapters/${chapterId}/sections/${sectionId}`,
          );
          setSectionsState((prev) => ({
            ...prev,
            [departmentSlug]: {
              ...(prev[departmentSlug] ?? {}),
              [chapterId]: {
                ...(prev[departmentSlug]?.[chapterId] ?? {}),
                [sectionId]: { status: "loaded", data: detail },
              },
            },
          }));
          return detail;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to load section";
          setSectionsState((prev) => ({
            ...prev,
            [departmentSlug]: {
              ...(prev[departmentSlug] ?? {}),
              [chapterId]: {
                ...(prev[departmentSlug]?.[chapterId] ?? {}),
                [sectionId]: { status: "error", error: message },
              },
            },
          }));
          throw error;
        } finally {
          pendingSectionsRef.current.delete(key);
        }
      })();

      pendingSectionsRef.current.set(key, task);
      return task;
    },
    [],
  );

  const ensureSection = useCallback(
    async (departmentSlug: string, chapterId: string, sectionId: string) => {
      const chapterMap = sectionsState[departmentSlug]?.[chapterId];
      const current = chapterMap?.[sectionId];
      if (current?.status === "loaded") {
        return current.data;
      }
      return refreshSection(departmentSlug, chapterId, sectionId);
    },
    [refreshSection, sectionsState],
  );

  const updateUrl = useCallback(
    (departmentSlug?: string | null, chapterId?: string | null, sectionId?: string | null) => {
      const segments = [departmentSlug, chapterId, sectionId].filter(Boolean) as string[];
      if (segments.length === 0) {
        router.push("/study", { scroll: false });
      } else {
        router.push(`/study/${segments.join("/")}`, { scroll: false });
      }
    },
    [router],
  );

  const handleSelectDepartment = useCallback(
    async (slug: string) => {
      setOpenDepartment((current) => (current === slug ? null : slug));
      setOpenChapter(null);
      setSelectedSectionId(null);
      setSelectedSectionDetail(null);
      updateUrl(slug, null, null);
      try {
        await ensureDepartment(slug);
      } catch (error) {
        console.error("Failed to ensure department", error);
      }
    },
    [ensureDepartment, updateUrl],
  );

  const handleSelectChapter = useCallback(
    async (departmentSlug: string, chapterId: string) => {
      const normalizedChapter = normalizeChapterId(chapterId) ?? "";
      setOpenDepartment(departmentSlug);
      setOpenChapter((current) => (current === normalizedChapter ? null : normalizedChapter));
      setSelectedSectionId(null);
      setSelectedSectionDetail(null);
      updateUrl(departmentSlug, normalizedChapter, null);
      try {
        await ensureChapter(departmentSlug, normalizedChapter);
      } catch (error) {
        console.error("Failed to ensure chapter", error);
      }
    },
    [ensureChapter, updateUrl],
  );

  const handleSelectSection = useCallback(
    async (departmentSlug: string, chapterId: string, sectionId: string) => {
      setOpenDepartment(departmentSlug);
      const normalizedChapter = normalizeChapterId(chapterId) ?? "";
      setOpenChapter(normalizedChapter);
      setSelectedSectionId(sectionId);
      updateUrl(departmentSlug, normalizedChapter, sectionId);
      try {
        const detail = await ensureSection(departmentSlug, normalizedChapter, sectionId);
        setSelectedSectionDetail(detail);
      } catch (error) {
        console.error("Failed to ensure section", error);
        setSelectedSectionDetail(null);
      }
    },
    [ensureSection, updateUrl],
  );

  const navigateToPath = useCallback(
    async (path: string[]) => {
      const [departmentSlug, chapterId, sectionId] = path;
      if (!departmentSlug) return;
      try {
        await ensureDepartment(departmentSlug);
        setOpenDepartment(departmentSlug);
        if (chapterId) {
          const normalizedChapter = normalizeChapterId(chapterId) ?? chapterId;
          await ensureChapter(departmentSlug, normalizedChapter);
          setOpenChapter(normalizedChapter);
          if (sectionId) {
            await handleSelectSection(departmentSlug, normalizedChapter, sectionId);
            return;
          }
          updateUrl(departmentSlug, normalizedChapter, null);
        } else {
          updateUrl(departmentSlug, null, null);
        }
      } catch (error) {
        console.error("Failed to navigate", error);
      }
    },
    [ensureDepartment, ensureChapter, handleSelectSection, updateUrl],
  );

  useEffect(() => {
    const slug = initialSelection.departmentSlug;
    if (slug) {
      ensureDepartment(slug).catch((error) => console.error(error));
    }
  }, [ensureDepartment, initialSelection.departmentSlug]);

  useEffect(() => {
    const slug = initialSelection.departmentSlug;
    const chapterId = normalizeChapterId(initialSelection.chapterId);
    const sectionId = normalizeSectionId(initialSelection.sectionId);
    if (slug && chapterId) {
      ensureChapter(slug, chapterId).catch((error) => console.error(error));
    }
    if (slug && chapterId && sectionId) {
      ensureSection(slug, chapterId, sectionId)
        .then((detail) => setSelectedSectionDetail(detail))
        .catch((error) => console.error(error));
    }
  }, [ensureChapter, ensureSection, initialSelection.chapterId, initialSelection.departmentSlug, initialSelection.sectionId]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }
    let cancelled = false;
    setSearchLoading(true);
    setSearchError(null);

    const handler = window.setTimeout(async () => {
      try {
        const payload = await fetch(`/api/content/search?q=${encodeURIComponent(searchQuery)}`);
        if (!payload.ok) {
          throw new Error("検索に失敗しました");
        }
        const json = (await payload.json()) as { data?: SearchResult[] };
        if (!cancelled) {
          setSearchResults(Array.isArray(json.data) ? json.data : []);
          setSearchLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setSearchLoading(false);
          setSearchError(error instanceof Error ? error.message : "検索に失敗しました");
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(handler);
    };
  }, [searchQuery]);


  const handleToggleBookmark = useCallback(() => {
    if (!selectedSectionDetail) {
      return;
    }
    bookmarksState.toggle({
      departmentSlug: selectedSectionDetail.breadcrumbs.department.slug,
      departmentName: selectedSectionDetail.breadcrumbs.department.name,
      chapterId: selectedSectionDetail.breadcrumbs.chapter.id,
      chapterName: selectedSectionDetail.breadcrumbs.chapter.name,
      sectionId: selectedSectionDetail.id,
      sectionName: selectedSectionDetail.name,
      savedAt: new Date().toISOString(),
    });
  }, [bookmarksState, selectedSectionDetail]);

  const sectionIsBookmarked = selectedSectionDetail
    ? bookmarksState.isBookmarked(
        selectedSectionDetail.breadcrumbs.department.slug,
        selectedSectionDetail.breadcrumbs.chapter.id,
        selectedSectionDetail.id,
      )
    : false;

  const mainHeading = "医学テキスト";

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{mainHeading}</h1>
          <p className={styles.subtitle}>診療科 &gt; 章 &gt; セクションで医学テキストを探す</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.bookmarkButton}
            onClick={() => setBookmarkPanelOpen((open) => !open)}
          >
            {`ブックマーク (${bookmarksState.bookmarks.length})`}
          </button>
        </div>
      </header>

      <div className={styles.searchArea}>
        <label className={styles.searchLabel} htmlFor="study-search">
          検索
        </label>
        <input
          id="study-search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="診療科・章・セクション名で検索"
        />
        {searchLoading && <span className={styles.searchStatus}>検索中...</span>}
        {searchError && <span className={styles.searchError}>{searchError}</span>}
        {searchQuery && searchResults.length > 0 && (
          <ul className={styles.searchResults}>
            {searchResults.map((result) => (
              <li key={result.path.join("-")}>
                <button
                  type="button"
                  className={styles.searchResultButton}
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    navigateToPath(result.path);
                  }}
                >
                  <span className={styles.searchResultLabel}>{result.label}</span>
                  {result.description && (
                    <span className={styles.searchResultDescription}>{result.description}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.contentArea}>
        <nav className={styles.navigation} aria-label="診療科の一覧">
          <ul className={styles.departmentList}>
            {initialDepartments.map((department) => {
              const isOpen = openDepartment === department.slug;
              const loadState = departmentsState[department.slug];
              return (
                <li key={department.slug}>
                  <button
                    type="button"
                    className={`${styles.departmentButton} ${isOpen ? styles.active : ""}`}
                    onClick={() => handleSelectDepartment(department.slug)}
                    aria-expanded={isOpen}
                  >
                    <span>{department.name}</span>
                    <span className={styles.meta}>{department.chapterCount}章</span>
                  </button>
                  {isOpen && (
                    <div className={styles.departmentPanel}>
                      {loadState?.status === "loading" && (
                        <p className={styles.statusMessage}>読み込み中...</p>
                      )}
                      {loadState?.status === "error" && (
                        <div className={styles.errorBox}>
                          <p>{loadState.error}</p>
                          <button
                            type="button"
                            className={styles.retryButton}
                            onClick={() => refreshDepartment(department.slug)}
                          >
                            再試行
                          </button>
                        </div>
                      )}
                      {loadState?.status === "loaded" && (
                        <ul className={styles.chapterList}>
                          {loadState.data.chapters.map((chapter) => {
                            const chapterOpen = openChapter === chapter.id;
                            const chapterState = chaptersState[department.slug]?.[chapter.id];
                            return (
                              <li key={chapter.id}>
                                <button
                                  type="button"
                                  className={`${styles.chapterButton} ${chapterOpen ? styles.active : ""}`}
                                  onClick={() => handleSelectChapter(department.slug, chapter.id)}
                                  aria-expanded={chapterOpen}
                                >
                                  <span>{chapter.name}</span>
                                  <span className={styles.meta}>{chapter.sectionCount}セクション</span>
                                </button>
                                {chapterOpen && (
                                  <div className={styles.chapterPanel}>
                                    {chapterState?.status === "loading" && (
                                      <p className={styles.statusMessage}>読み込み中...</p>
                                    )}
                                    {chapterState?.status === "error" && (
                                      <div className={styles.errorBox}>
                                        <p>{chapterState.error}</p>
                                        <button
                                          type="button"
                                          className={styles.retryButton}
                                          onClick={() => refreshChapter(department.slug, chapter.id)}
                                        >
                                          再試行
                                        </button>
                                      </div>
                                    )}
                                    {chapterState?.status === "loaded" && (
                                      <ul className={styles.sectionList}>
                                        {chapterState.data.sections.map((section) => {
                                          const sectionActive = selectedSectionId === section.id;
                                          const sectionState =
                                            sectionsState[department.slug]?.[chapter.id]?.[section.id];
                                          return (
                                            <li key={section.id}>
                                              <button
                                                type="button"
                                                className={`${styles.sectionButton} ${
                                                  sectionActive ? styles.active : ""
                                                }`}
                                                onClick={() =>
                                                  handleSelectSection(
                                                    department.slug,
                                                    chapter.id,
                                                    section.id,
                                                  )
                                                }
                                              >
                                                <span>{section.name}</span>
                                                <span className={styles.meta}>{section.imageCount}枚</span>
                                              </button>
                                              {sectionState?.status === "error" && (
                                                <p className={styles.inlineError}>{sectionState.error}</p>
                                              )}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <section className={styles.viewerSection} aria-live="polite">
          {selectedSectionDetail ? (
            <SectionViewer
              detail={selectedSectionDetail}
              onToggleBookmark={handleToggleBookmark}
              bookmarked={sectionIsBookmarked}
            />
          ) : (
            <div className={styles.placeholder}>
              <p>セクションを選択すると本文画像が表示されます。</p>
            </div>
          )}
        </section>
      </div>

      <aside
        className={`${styles.bookmarkPanel} ${isBookmarkPanelOpen ? styles.open : ""}`}
        aria-hidden={!isBookmarkPanelOpen}
      >
        <div className={styles.bookmarkHeader}>
          <h2>ブックマーク</h2>
          <button type="button" onClick={() => setBookmarkPanelOpen(false)} className={styles.closeButton}>
            閉じる
          </button>
        </div>
        {bookmarksState.bookmarks.length === 0 ? (
          <p className={styles.statusMessage}>ブックマークされたセクションはありません。</p>
        ) : (
          <ul className={styles.bookmarkList}>
            {bookmarksState.bookmarks.map((bookmark) => (
              <li key={`${bookmark.departmentSlug}-${bookmark.chapterId}-${bookmark.sectionId}`}>
                <button
                  type="button"
                  className={styles.bookmarkEntry}
                  onClick={() => {
                    setBookmarkPanelOpen(false);
                    navigateToPath([bookmark.departmentSlug, bookmark.chapterId, bookmark.sectionId]);
                  }}
                >
                  <span className={styles.bookmarkLabel}>{bookmark.sectionName}</span>
                  <span className={styles.bookmarkDescription}>
                    {bookmark.departmentName} / {bookmark.chapterName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

interface SectionViewerProps {
  detail: SectionDetail;
  onToggleBookmark: () => void;
  bookmarked: boolean;
}

function SectionViewer({ detail, onToggleBookmark, bookmarked }: SectionViewerProps) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZoom(1);
  }, [detail.id]);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      setZoom((value) => {
        const next = Math.min(Math.max(0.5, value + delta), 3);
        return Number(next.toFixed(2));
      });
    }
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  const zoomIn = useCallback(() => {
    setZoom((value) => Math.min(3, Number((value + 0.1).toFixed(2))));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((value) => Math.max(0.5, Number((value - 0.1).toFixed(2))));
  }, []);

  return (
    <div className={styles.viewer}>
      <div className={styles.viewerHeader}>
        <div>
          <nav className={styles.breadcrumbs} aria-label="パンくず">
            <span>{detail.breadcrumbs.department.name}</span>
            <span aria-hidden="true">?</span>
            <span>{detail.breadcrumbs.chapter.name}</span>
            <span aria-hidden="true">?</span>
            <span>{detail.name}</span>
          </nav>
          {detail.source && <p className={styles.source}>出典: {detail.source}</p>}
        </div>
        <div className={styles.viewerActions}>
          <button type="button" onClick={zoomOut} className={styles.viewerButton}>
            －
          </button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={zoomIn} className={styles.viewerButton}>
            ＋
          </button>
          <button type="button" onClick={onToggleBookmark} className={styles.viewerButton}>
            {bookmarked ? "ブックマーク解除" : "ブックマーク"}
          </button>
        </div>
      </div>
      <div className={styles.viewerContent} ref={containerRef}>
        {detail.images.map((image) => (
          <figure key={image.fileName} className={styles.pageFigure} style={{ transform: `scale(${zoom})` }}>
            <img src={image.url} alt={image.alt} loading="lazy" />
            <figcaption>ページ {image.page}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
































