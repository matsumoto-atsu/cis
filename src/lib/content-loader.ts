import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { departmentOverrides, type DepartmentOverride, type ChapterOverride, type SectionOverride } from "@/data/contentConfig";

const DATA_ROOT = path.join(process.cwd(), "public", "data", "pdfs_images");

const IMAGE_PATTERN = /^(\d+)_([0-9]+)(?:_([0-9]+))?\.(png|jpg|jpeg|webp)$/i;

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
  id: string; // e.g. 1-2
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
  if (override?.name) {
    return override.name;
  }
  return `Chapter ${chapterId}`;
}

function formatSectionName(chapterId: string, sectionId: string, override?: SectionOverride): string {
  if (override?.name) {
    return override.name;
  }
  return `${chapterId}-${sectionId}`;
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

async function readDepartmentStructure(slug: string): Promise<DepartmentInternal | null> {
  const dirPath = path.join(DATA_ROOT, slug);
  try {
    const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });
    const fileEntries = dirEntries.filter((entry) => entry.isFile());

    const departmentOverride = getOverride(slug);

    const chapterMap = new Map<string, { data: ChapterInternal; sections: Map<string, SectionInternal> }>();
    let latestUpdate: Date | undefined;
    let imageCount = 0;

    const fileStatsPromises = fileEntries
      .map((entry) => entry.name)
      .filter((name) => IMAGE_PATTERN.test(name))
      .map(async (name) => {
        const match = name.match(IMAGE_PATTERN);
        if (!match) {
          return null;
        }
        const [, chapterRaw, sectionRaw, pageRaw] = match;
        const chapterId = chapterRaw.replace(/^0+/, "") || "0";
        const sectionId = sectionRaw.replace(/^0+/, "") || "0";
        const page = pageRaw ? Number.parseInt(pageRaw, 10) : 1;
        const filePath = path.join(dirPath, name);
        const stat = await fs.stat(filePath);
        const fileUpdatedAt = stat.mtime;
        imageCount += 1;

        if (!latestUpdate || fileUpdatedAt > latestUpdate) {
          latestUpdate = fileUpdatedAt;
        }

        const chapterOverride = getChapterOverride(departmentOverride, chapterId);
        const sectionOverride = getSectionOverride(chapterOverride, sectionId);

        const chapterRecord = chapterMap.get(chapterId) ?? {
          data: {
            id: chapterId,
            order: defaultOrder(chapterId, chapterOverride?.order),
            name: formatChapterName(chapterId, chapterOverride),
            summary: chapterOverride?.summary,
            badges: toBadges(chapterOverride),
            status: toStatus(chapterOverride),
            sections: [],
            updatedAt: undefined,
          },
          sections: new Map(),
        };

        if (!chapterMap.has(chapterId)) {
          chapterMap.set(chapterId, chapterRecord);
        }

        const sectionKey = `${chapterId}-${sectionId}`;
        const sectionRecord = chapterRecord.sections.get(sectionKey) ?? {
          id: sectionKey,
          chapterId,
          sectionId,
          order: defaultOrder(sectionId),
          name: formatSectionName(chapterId, sectionId, sectionOverride),
          summary: sectionOverride?.summary,
          badges: toBadges(sectionOverride),
          status: toStatus(sectionOverride),
          source: sectionOverride?.source,
          images: [],
          updatedAt: undefined,
        };

        if (!chapterRecord.sections.has(sectionKey)) {
          chapterRecord.sections.set(sectionKey, sectionRecord);
        }

        const url = `/data/pdfs_images/${slug}/${name}`;
        sectionRecord.images.push({
          fileName: name,
          url,
          page,
          alt: `${sectionRecord.name} (ページ ${page})`,
          updatedAt: fileUpdatedAt.toISOString(),
        });

        const sectionUpdatedAt = sectionRecord.updatedAt ? new Date(sectionRecord.updatedAt) : undefined;
        if (!sectionUpdatedAt || fileUpdatedAt > sectionUpdatedAt) {
          sectionRecord.updatedAt = fileUpdatedAt.toISOString();
        }

        const chapterUpdatedAt = chapterRecord.data.updatedAt ? new Date(chapterRecord.data.updatedAt) : undefined;
        if (!chapterUpdatedAt || fileUpdatedAt > chapterUpdatedAt) {
          chapterRecord.data.updatedAt = fileUpdatedAt.toISOString();
        }

        return null;
      });

    await Promise.all(fileStatsPromises);

    const chapters: ChapterInternal[] = Array.from(chapterMap.values())
      .map(({ data, sections }) => {
        const sortedSections = Array.from(sections.values()).sort((a, b) => a.order - b.order);
        data.sections = sortedSections;
        return data;
      })
      .sort((a, b) => a.order - b.order);

    const sectionCount = chapters.reduce((acc, chapter) => acc + chapter.sections.length, 0);

    const departmentName = departmentOverride?.name ?? slug;
    const departmentDescription = departmentOverride?.description;
    const departmentOrder = departmentOverride?.order ?? Number.MAX_SAFE_INTEGER;

    return {
      slug,
      name: departmentName,
      description: departmentDescription,
      order: departmentOrder,
      badges: toBadges(departmentOverride),
      status: toStatus(departmentOverride),
      chapters,
      updatedAt: latestUpdate ? latestUpdate.toISOString() : undefined,
      sectionCount,
      imageCount,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

const getDepartmentInternal = cache(async (slug: string) => readDepartmentStructure(slug));

async function listDepartmentSlugs(): Promise<string[]> {
  const entries = await fs.readdir(DATA_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export const listDepartments = cache(async (): Promise<DepartmentSummary[]> => {
  const slugs = await listDepartmentSlugs();
  const departments = await Promise.all(slugs.map((slug) => getDepartmentInternal(slug)));
  const summaries: DepartmentSummary[] = departments
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

  return summaries;
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

  chapters.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

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

  sections.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

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
    sections,
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
  const slugs = await listDepartmentSlugs();
  const departments = await Promise.all(slugs.map((slug) => getDepartmentInternal(slug)));

  const nodes: SearchNode[] = [];

  for (const dept of departments) {
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


