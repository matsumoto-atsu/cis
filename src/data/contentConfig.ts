export type StatusFlag = "reviewed" | "in-revision" | "archived";

export interface SectionOverride {
  name?: string;
  summary?: string;
  source?: string;
  status?: StatusFlag;
  badges?: string[];
  order?: number;
}

export interface ChapterOverride {
  name?: string;
  summary?: string;
  order?: number;
  status?: StatusFlag;
  badges?: string[];
  sections?: Record<string, SectionOverride>;
}

export interface DepartmentOverride {
  name: string;
  shortName?: string;
  description?: string;
  order?: number;
  updatedAt?: string;
  status?: StatusFlag;
  badges?: string[];
  chapters?: Record<string, ChapterOverride>;
}

export const departmentOverrides: Record<string, DepartmentOverride> = {
  kokyu: {
    name: "Respiratory",
    description: "Diagnosis and management of respiratory diseases",
    order: 10,
  },
  junkan: {
    name: "Cardiovascular",
    description: "Pathophysiology and management of cardiovascular disease",
    order: 20,
  },
  blood: {
    name: "Hematology",
    description: "Core and advanced topics in hematology",
    order: 30,
  },
  immune: {
    name: "Immunology & Rheumatology",
    order: 40,
  },
  infection: {
    name: "Infectious Disease",
    order: 50,
  },
  jin: {
    name: "Nephrology",
    order: 60,
  },
  kantansui: {
    name: "Hepatobiliary & Pancreas",
    order: 70,
  },
  syoukakan: {
    name: "Gastroenterology",
    order: 80,
  },
  naitai: {
    name: "Endocrine & Metabolism",
    order: 90,
  },
  shinkei: {
    name: "Neurology",
    order: 100,
  },
  sansyoro1sampu: {
    name: "Obstetrics & Gynecology",
    order: 110,
  },
  sansyoro2syouni: {
    name: "Pediatrics",
    order: 120,
  },
  sansyoro3rounen: {
    name: "Geriatrics",
    order: 130,
  },
  kyucyumako1qq: {
    name: "Emergency & Critical Care I",
    order: 140,
  },
  kyucyumako2cyuma: {
    name: "Emergency & Critical Care II (Toxicology)",
    order: 150,
  },
  kyucyumako3phealth: {
    name: "Emergency & Critical Care III (Public Health)",
    order: 160,
  },
  minor1seikei: {
    name: "Orthopedics",
    order: 170,
  },
  minor2ganka: {
    name: "Ophthalmology",
    order: 180,
  },
  minor3jibika: {
    name: "Otolaryngology",
    order: 190,
  },
  minor4hinyouki: {
    name: "Urology",
    order: 200,
  },
  minor5mental: {
    name: "Psychiatry",
    order: 210,
  },
  minor6hifu: {
    name: "Dermatology",
    order: 220,
  },
  minor7housya: {
    name: "Radiology",
    order: 230,
  },
  "2023": {
    name: "2023 Reference Materials",
    order: 300,
  },
};