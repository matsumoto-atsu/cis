export interface SectionOverride {
  name?: string;
  summary?: string;
  source?: string;
  status?: "reviewed" | "in-revision" | "archived";
  badges?: string[];
}

export interface ChapterOverride {
  name?: string;
  summary?: string;
  order?: number;
  status?: "reviewed" | "in-revision" | "archived";
  badges?: string[];
  sections?: Record<string, SectionOverride>;
}

export interface DepartmentOverride {
  name: string;
  shortName?: string;
  description?: string;
  order?: number;
  updatedAt?: string;
  status?: "reviewed" | "in-revision" | "archived";
  badges?: string[];
  chapters?: Record<string, ChapterOverride>;
}

export const departmentOverrides: Record<string, DepartmentOverride> = {
  kokyu: {
    name: "呼吸器",
    description: "呼吸器疾患の診断と治療のまとめ",
    order: 10,
  },
  junkan: {
    name: "循環器",
    description: "循環器疾患の病態とマネジメント",
    order: 20,
  },
  blood: {
    name: "血液・造血器",
    description: "血液疾患の各論",
    order: 30,
  },
  immune: {
    name: "免疫・膠原病",
    order: 40,
  },
  infection: {
    name: "感染症",
    order: 50,
  },
  jin: {
    name: "腎臓",
    order: 60,
  },
  kantansui: {
    name: "肝胆膵",
    order: 70,
  },
  syoukakan: {
    name: "消化器",
    order: 80,
  },
  naitai: {
    name: "内分泌・代謝",
    order: 90,
  },
  shinkei: {
    name: "神経",
    order: 100,
  },
  sansyoro1sampu: {
    name: "産科",
    order: 110,
  },
  sansyoro2syouni: {
    name: "小児",
    order: 120,
  },
  sansyoro3rounen: {
    name: "老年",
    order: 130,
  },
  kyucyumako1qq: {
    name: "救急・集中治療 I",
    order: 140,
  },
  kyucyumako2cyuma: {
    name: "救急・集中治療 II (中毒)",
    order: 150,
  },
  kyucyumako3phealth: {
    name: "救急・集中治療 III (公衆衛生)",
    order: 160,
  },
  minor1seikei: {
    name: "整形外科",
    order: 170,
  },
  minor2ganka: {
    name: "眼科",
    order: 180,
  },
  minor3jibika: {
    name: "耳鼻咽喉科",
    order: 190,
  },
  minor4hinyouki: {
    name: "泌尿器科",
    order: 200,
  },
  minor5mental: {
    name: "精神科",
    order: 210,
  },
  minor6hifu: {
    name: "皮膚科",
    order: 220,
  },
  minor7housya: {
    name: "放射線科",
    order: 230,
  },
  2023: {
    name: "2023 年資料",
    order: 240,
  },
};
