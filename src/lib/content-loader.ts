import { cache } from "react";
import manifest from "@/data/contentManifest.json";
import {
  departmentOverrides,
  type DepartmentOverride,
  type ChapterOverride,
  type SectionOverride,
} from "@/data/contentConfig";

export type StatusFlag = "reviewed" | "in-revision" | "archived";

export interface DepartmentSummary {
  slug: string;
  name: string;
  description?: string;
  order: number;
  badges: string[];
  status?: StatusFlag;
  chapterCount: number;
  sectionCount: number;
  updatedAt?: string;
}

export interface ChapterSummary {
  id: string;
  name: string;
  summary?: string;
  order: number;
  badges: string[];
  status?: StatusFlag;
  sectionCount: number;
  imageCount: number;
  updatedAt?: string;
}

export interface SectionSummary {
  id: string;
  name: string;
  summary?: string;
  order: number;
  badges: string[];
  status?: StatusFlag;
  imageCount: number;
  updatedAt?: string;
  source?: string;
}

export interface SectionImage {
  fileName: string;
  url: string;
  page: number;
  alt: string;
  updatedAt?: string;
}

export interface ChapterDetail extends ChapterSummary {
  sections: SectionSummary[];
}

export interface SectionDetail extends SectionSummary {
  images: SectionImage[];
  breadcrumbs: {
    department: { slug: string; name: string };
    chapter: { id: string; name: string };
  };
}

export interface DepartmentDetail extends DepartmentSummary {
  chapters: ChapterSummary[];
}

interface ManifestImage {
  fileName: string;
  page: number;
  updatedAt?: string;
}

interface ManifestSection {
  id: string;
  chapterId: string;
  sectionId: string;
  updatedAt?: string;
  images: ManifestImage[];
}

interface ManifestChapter {
  id: string;
  updatedAt?: string;
  sections: ManifestSection[];
}

interface ManifestDepartment {
  slug: string;
  updatedAt?: string;
  chapters: ManifestChapter[];
}

interface ContentManifest {
  generatedAt: string;
  departments: ManifestDepartment[];
}

interface SectionInternal {
  id: string;
  chapterId: string;
  sectionId: string;
  order: number;
  name: string;
  summary?: string;
  badges: string[];
  status?: StatusFlag;
  source?: string;
  images: SectionImage[];
  updatedAt?: string;
}

interface ChapterInternal {
  id: string;
  order: number;
  name: string;
  summary?: string;
  badges: string[];
  status?: StatusFlag;
  sections: SectionInternal[];
  updatedAt?: string;
}

interface DepartmentInternal {
  slug: string;
  name: string;
  description?: string;
  order: number;
  badges: string[];
  status?: StatusFlag;
  chapters: ChapterInternal[];
  updatedAt?: string;
  sectionCount: number;
  imageCount: number;
}

const manifestData = manifest as ContentManifest;

function getOverride(slug: string): DepartmentOverride | undefined {
  return departmentOverrides[slug];
}

function getChapterOverride(override: DepartmentOverride | undefined, chapterId: string): ChapterOverride | undefined {
  return override?.chapters?.[chapterId];
}

function getSectionOverride(
  chapterOverride: ChapterOverride | undefined,
  sectionId: string,
): SectionOverride | undefined {
  return chapterOverride?.sections?.[sectionId];
}

function formatChapterName(chapterId: string, override?: ChapterOverride): string {
  return override?.name ?? `Chapter ${chapterId}`;
}

function formatSectionName(chapterId: string, sectionId: string, override?: SectionOverride): string {
  return override?.name ?? `${chapterId}-${sectionId}`;
}

function defaultOrder(value: string, overrideOrder?: number): number {
  if (typeof overrideOrder === "number") {
    return overrideOrder;
  }
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
}

function toStatus(override?: { status?: StatusFlag }): StatusFlag | undefined {
  return override?.status;
}

function toBadges(override?: { badges?: string[] }): string[] {
  return override?.badges ?? [];
}

function buildSectionInternal(
  slug: string,
  chapterId: string,
  manifestSection: ManifestSection,
  chapterOverride: ChapterOverride | undefined,
): SectionInternal {
  const sectionOverride = getSectionOverride(chapterOverride, manifestSection.sectionId);
  const name = formatSectionName(chapterId, manifestSection.sectionId, sectionOverride);

  const images: SectionImage[] = manifestSection.images.map((image) => ({
    fileName: image.fileName,
    url: `/data/pdfs_images/${slug}/${image.fileName}`,
    page: image.page,
    alt: `${name} (ページ ${image.page})`,
    updatedAt: image.updatedAt,
  }));

  const order = defaultOrder(manifestSection.sectionId, sectionOverride?.order);

  return {
    id: manifestSection.id,
    chapterId,
    sectionId: manifestSection.sectionId,
    order,
    name,
    summary: sectionOverride?.summary,
    badges: toBadges(sectionOverride),
    status: toStatus(sectionOverride),
    source: sectionOverride?.source,
    images,
    updatedAt: manifestSection.updatedAt,
  };
}

function buildChapterInternal(
  slug: string,
  manifestChapter: ManifestChapter,
  departmentOverride: DepartmentOverride | undefined,
): ChapterInternal {
  const chapterOverride = getChapterOverride(departmentOverride, manifestChapter.id);
  const name = formatChapterName(manifestChapter.id, chapterOverride);
  const order = defaultOrder(manifestChapter.id, chapterOverride?.order);

  const sections = manifestChapter.sections
    .map((section) => buildSectionInternal(slug, manifestChapter.id, section, chapterOverride))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  return {
    id: manifestChapter.id,
    order,
    name,
    summary: chapterOverride?.summary,
    badges: toBadges(chapterOverride),
    status: toStatus(chapterOverride),
    sections,
    updatedAt: manifestChapter.updatedAt,
  };
}

function buildDepartmentInternal(manifestDept: ManifestDepartment): DepartmentInternal {
  const override = getOverride(manifestDept.slug);
  const chapters = manifestDept.chapters
    .map((chapter) => buildChapterInternal(manifestDept.slug, chapter, override))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  const sectionCount = chapters.reduce((acc, chapter) => acc + chapter.sections.length, 0);
  const imageCount = chapters.reduce(
    (acc, chapter) => acc + chapter.sections.reduce((inner, section) => inner + section.images.length, 0),
    0,
  );

  const departmentOrder = override?.order ?? Number.MAX_SAFE_INTEGER;

  return {
    slug: manifestDept.slug,
    name: override?.name ?? manifestDept.slug,
    description: override?.description,
    order: departmentOrder,
    badges: toBadges(override),
    status: toStatus(override),
    chapters,
    updatedAt: manifestDept.updatedAt,
    sectionCount,
    imageCount,
  };
}

const departmentMap = new Map<string, DepartmentInternal | null>();

function getManifestDepartment(slug: string): ManifestDepartment | undefined {
  return manifestData.departments.find((dept) => dept.slug === slug);
}

async function getDepartmentInternal(slug: string): Promise<DepartmentInternal | null> {
  if (departmentMap.has(slug)) {
    return departmentMap.get(slug) ?? null;
  }
  const manifestDept = getManifestDepartment(slug);
  if (!manifestDept) {
    departmentMap.set(slug, null);
    return null;
  }
  const internal = buildDepartmentInternal(manifestDept);
  departmentMap.set(slug, internal);
  return internal;
}

const listDepartmentSlugs = cache(async (): Promise<string[]> => {
  return manifestData.departments.map((dept) => dept.slug);
});

export const listDepartments = cache(async (): Promise<DepartmentSummary[]> => {
  const slugs = await listDepartmentSlugs();
  const departments = await Promise.all(slugs.map((slug) => getDepartmentInternal(slug)));

  return departments
    .filter((dept): dept is DepartmentInternal => Boolean(dept))
    .map((dept) => ({
      slug: dept.slug,
      name: dept.name,
      description: dept.description,
      order: dept.order,
      badges: dept.badges,
      status: dept.status,
      chapterCount: dept.chapters.length,
      sectionCount: dept.sectionCount,
      updatedAt: dept.updatedAt,
    }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
});

export async function getDepartmentDetail(slug: string): Promise<DepartmentDetail | null> {
  const dept = await getDepartmentInternal(slug);
  if (!dept) {
    return null;
  }

  const chapters: ChapterSummary[] = dept.chapters.map((chapter) => ({
    id: chapter.id,
    name: chapter.name,
    summary: chapter.summary,
    order: chapter.order,
    badges: chapter.badges,
    status: chapter.status,
    sectionCount: chapter.sections.length,
    imageCount: chapter.sections.reduce((acc, section) => acc + section.images.length, 0),
    updatedAt: chapter.updatedAt,
  }));

  return {
    slug: dept.slug,
    name: dept.name,
    description: dept.description,
    order: dept.order,
    badges: dept.badges,
    status: dept.status,
    chapterCount: dept.chapters.length,
    sectionCount: dept.sectionCount,
    updatedAt: dept.updatedAt,
    chapters,
  };
}

export async function getChapterDetail(slug: string, chapterId: string): Promise<ChapterDetail | null> {
  const dept = await getDepartmentInternal(slug);
  if (!dept) {
    return null;
  }
  const normalizedChapterId = chapterId.replace(/^0+/, "") || "0";
  const chapter = dept.chapters.find((item) => item.id === normalizedChapterId);
  if (!chapter) {
    return null;
  }

  const sections: SectionSummary[] = chapter.sections.map((section) => ({
    id: section.id,
    name: section.name,
    summary: section.summary,
    order: section.order,
    badges: section.badges,
    status: section.status,
    imageCount: section.images.length,
    updatedAt: section.updatedAt,
    source: section.source,
  }));

  return {
    id: chapter.id,
    name: chapter.name,
    summary: chapter.summary,
    order: chapter.order,
    badges: chapter.badges,
    status: chapter.status,
    sectionCount: chapter.sections.length,
    imageCount: chapter.sections.reduce((acc, section) => acc + section.images.length, 0),
    updatedAt: chapter.updatedAt,
    sections: sections.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)),
  };
}

export async function getSectionDetail(
  slug: string,
  chapterId: string,
  sectionCompositeId: string,
): Promise<SectionDetail | null> {
  const dept = await getDepartmentInternal(slug);
  if (!dept) {
    return null;
  }
  const normalizedChapterId = chapterId.replace(/^0+/, "") || "0";
  const chapter = dept.chapters.find((item) => item.id === normalizedChapterId);
  if (!chapter) {
    return null;
  }
  const section = chapter.sections.find((item) => item.id === sectionCompositeId);
  if (!section) {
    return null;
  }

  const sortedImages = [...section.images].sort((a, b) => a.page - b.page || a.fileName.localeCompare(b.fileName));

  return {
    id: section.id,
    name: section.name,
    summary: section.summary,
    order: section.order,
    badges: section.badges,
    status: section.status,
    imageCount: section.images.length,
    updatedAt: section.updatedAt,
    source: section.source,
    images: sortedImages,
    breadcrumbs: {
      department: { slug: dept.slug, name: dept.name },
      chapter: { id: chapter.id, name: chapter.name },
    },
  };
}

export interface SearchNode {
  type: "department" | "chapter" | "section";
  path: string[];
  label: string;
  description?: string;
}

export const buildSearchIndex = cache(async (): Promise<SearchNode[]> => {
  const nodes: SearchNode[] = [];

  for (const manifestDept of manifestData.departments) {
    const dept = await getDepartmentInternal(manifestDept.slug);
    if (!dept) continue;

    nodes.push({
      type: "department",
      path: [dept.slug],
      label: dept.name,
      description: dept.description,
    });

    for (const chapter of dept.chapters) {
      nodes.push({
        type: "chapter",
        path: [dept.slug, chapter.id],
        label: `${dept.name} / ${chapter.name}`,
        description: chapter.summary,
      });

      for (const section of chapter.sections) {
        nodes.push({
          type: "section",
          path: [dept.slug, chapter.id, section.id],
          label: `${dept.name} / ${chapter.name} / ${section.name}`,
          description: section.summary,
        });
      }
    }
  }

  return nodes;
});

