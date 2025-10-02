import type { Metadata } from "next";
import { listDepartments } from "@/lib/content-loader";
import StudyExplorer from "@/components/study/StudyExplorer";

interface StudyPageProps {
  params: {
    slug?: string[];
  };
}

export const metadata: Metadata = {
  title: "医学テキスト | CIS",
  description: "診療科・章・セクションで整理された医学学習コンテンツ",
};

export const revalidate = 600;

export default async function StudyPage({ params }: StudyPageProps) {
  const departments = await listDepartments();
  const [departmentSlug, chapterId, sectionId] = params.slug ?? [];

  return (
    <StudyExplorer
      initialDepartments={departments}
      initialSelection={{ departmentSlug, chapterId, sectionId }}
    />
  );
}