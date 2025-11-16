import { questionKey } from "./question-key";

// ローカル保存（年/ブロックごとにユーザー解答を保持）
export type UserAnswerMap = Record<string, number[]>; // key: qKey("2023-1-1"), value: [2] など

const ANSWER_KEY = "cis-answers-v1";

function loadAllAnswers(): UserAnswerMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ANSWER_KEY);
    return raw ? (JSON.parse(raw) as UserAnswerMap) : {};
  } catch {
    return {};
  }
}

function saveAllAnswers(map: UserAnswerMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANSWER_KEY, JSON.stringify(map));
}

export function qKey(year: number, block: number, number: number) {
  return questionKey(year, block, number);
}

export function getUserAnswers(): UserAnswerMap {
  return loadAllAnswers();
}

export function setUserAnswer(key: string, val: number[]) {
  const all = loadAllAnswers();
  all[key] = val;
  saveAllAnswers(all);
}

export function clearUserAnswers(keys: string[]) {
  if (typeof window === "undefined" || keys.length === 0) return;

  const all = loadAllAnswers();
  let changed = false;

  for (const key of keys) {
    if (key in all) {
      delete all[key];
      changed = true;
    }
  }

  if (changed) saveAllAnswers(all);
}
