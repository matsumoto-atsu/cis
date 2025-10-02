#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_ROOT = path.join(process.cwd(), "public", "data", "pdfs_images");
const OUTPUT_PATH = path.join(process.cwd(), "src", "data", "contentManifest.json");
const IMAGE_PATTERN = /^(\d+)_([0-9]+)(?:_([0-9]+))?\.(png|jpg|jpeg|webp)$/i;

async function collectManifest() {
  const departments = [];
  const entries = await fs.readdir(DATA_ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const dirPath = path.join(DATA_ROOT, slug);
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const chapterMap = new Map();
    let latestUpdate;

    for (const file of files) {
      if (!file.isFile()) continue;
      const match = file.name.match(IMAGE_PATTERN);
      if (!match) continue;
      const [, chapterRaw, sectionRaw, pageRaw] = match;
      const chapterId = chapterRaw.replace(/^0+/, "") || "0";
      const sectionId = sectionRaw.replace(/^0+/, "") || "0";
      const page = pageRaw ? Number.parseInt(pageRaw, 10) : 1;
      const filePath = path.join(dirPath, file.name);
      const stat = await fs.stat(filePath);
      const updatedAt = stat.mtime.toISOString();
      if (!latestUpdate || stat.mtime > latestUpdate) {
        latestUpdate = stat.mtime;
      }

      if (!chapterMap.has(chapterId)) {
        chapterMap.set(chapterId, new Map());
      }
      const sections = chapterMap.get(chapterId);
      const compositeId = `${chapterId}-${sectionId}`;
      if (!sections.has(compositeId)) {
        sections.set(compositeId, {
          id: compositeId,
          chapterId,
          sectionId,
          updatedAt,
          images: [],
        });
      }
      const section = sections.get(compositeId);
      section.images.push({
        fileName: file.name,
        page,
        updatedAt,
      });
      const currentSectionDate = section.updatedAt ? new Date(section.updatedAt) : undefined;
      if (!currentSectionDate || stat.mtime > currentSectionDate) {
        section.updatedAt = updatedAt;
      }
    }

    const chapters = [];
    for (const [chapterId, sections] of chapterMap.entries()) {
      const chapterSections = Array.from(sections.values())
        .map((section) => ({
          ...section,
          images: section.images.sort((a, b) => a.page - b.page || a.fileName.localeCompare(b.fileName)),
        }))
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
      const chapterUpdatedAt = chapterSections.reduce((acc, section) => {
        const date = section.updatedAt ? new Date(section.updatedAt) : undefined;
        if (!date) return acc;
        if (!acc || date > acc) return date;
        return acc;
      }, undefined);
      chapters.push({
        id: chapterId,
        updatedAt: chapterUpdatedAt ? chapterUpdatedAt.toISOString() : undefined,
        sections: chapterSections,
      });
    }

    chapters.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    departments.push({
      slug,
      updatedAt: latestUpdate ? latestUpdate.toISOString() : undefined,
      chapters,
    });
  }

  departments.sort((a, b) => a.slug.localeCompare(b.slug));
  return { generatedAt: new Date().toISOString(), departments };
}

async function main() {
  try {
    const manifest = await collectManifest();
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(manifest, null, 2), "utf8");
    console.log(`Content manifest generated at ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("Failed to generate content manifest", error);
    process.exitCode = 1;
  }
}

await main();
