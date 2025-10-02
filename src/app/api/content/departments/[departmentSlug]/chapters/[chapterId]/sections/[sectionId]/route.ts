import { NextResponse } from "next/server";
import { getSectionDetail } from "@/lib/content-loader";

type RouteContext = {
  params: Promise<{
    departmentSlug: string;
    chapterId: string;
    sectionId: string;
  }>;
};

export const revalidate = 300;

function buildSectionCompositeId(chapterId: string, sectionId: string): string {
  if (sectionId.includes("-")) {
    return sectionId;
  }
  const normalizedChapter = chapterId.replace(/^0+/, "") || "0";
  const normalizedSection = sectionId.replace(/^0+/, "") || "0";
  return `${normalizedChapter}-${normalizedSection}`;
}

export async function GET(_request: Request, context: RouteContext) {
  const { departmentSlug, chapterId, sectionId } = await context.params;
  try {
    const compositeId = buildSectionCompositeId(chapterId, sectionId);
    const section = await getSectionDetail(departmentSlug, chapterId, compositeId);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json({ data: section });
  } catch (error) {
    console.error(
      `Failed to load section ${departmentSlug}/${chapterId}/${sectionId}`,
      error,
    );
    return NextResponse.json({ error: "Failed to load section" }, { status: 500 });
  }
}
