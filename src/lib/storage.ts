// ローカル保存（年/ブロックごとにユーザー解答を保持）
export type UserAnswerMap = Record<string, number[]>; // key: qKey("2023-1-1"), value: [2] など

const KEY = "cis-answers-v1";

function loadAll(): UserAnswerMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserAnswerMap) : {};
  } catch {
    return {};
  }
}

function saveAll(map: UserAnswerMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function qKey(year: number, block: number, number: number) {
  return `${year}-${block}-${number}`;
}

export function getUserAnswers(): UserAnswerMap {
  return loadAll();
}

export function setUserAnswer(key: string, val: number[]) {
  const all = loadAll();
  all[key] = val;
  saveAll(all);
}

export function clearUserAnswers(keys: string[]) {
  if (typeof window === "undefined" || keys.length === 0) return;

  const all = loadAll();
  let changed = false;

  for (const key of keys) {
    if (key in all) {
      delete all[key];
      changed = true;
    }
  }

  if (changed) saveAll(all);
}
