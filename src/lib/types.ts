export type QuestionType = "single" | "x2" | "x3";


export type Question = {
year: number;
block: number;
number: number; // 1始まり
type: QuestionType;
stem: string;
choices: string[]; // 1..5 を想定
answer: number[]; // 1..5（複数可）
explanation?: string;
};