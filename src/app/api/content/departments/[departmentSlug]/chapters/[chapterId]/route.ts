import { NextResponse } from "next/server";
import { getChapterDetail } from "@/lib/content-loader";

type RouteContext = {
  params: Promise<{
    departmentSlug: string;
    chapterId: string;
  }>;
};

export const revalidate = 600;

export async function GET(_request: Request, context: RouteContext) {
  const { departmentSlug, chapterId } = await context.params;
  try {
    const chapter = await getChapterDetail(departmentSlug, chapterId);
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }
    return NextResponse.json({ data: chapter });
  } catch (error) {
    console.error(`Failed to load chapter ${departmentSlug}/${chapterId}`, error);
    return NextResponse.json({ error: "Failed to load chapter" }, { status: 500 });
  }
}
