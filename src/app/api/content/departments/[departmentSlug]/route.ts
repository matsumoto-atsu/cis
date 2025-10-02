import { NextResponse } from "next/server";
import { getDepartmentDetail } from "@/lib/content-loader";

type RouteContext = {
  params: Promise<{
    departmentSlug: string;
  }>;
};

export const revalidate = 900;

export async function GET(_request: Request, context: RouteContext) {
  const { departmentSlug } = await context.params;
  try {
    const department = await getDepartmentDetail(departmentSlug);
    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }
    return NextResponse.json({ data: department });
  } catch (error) {
    console.error(`Failed to load department ${departmentSlug}`, error);
    return NextResponse.json({ error: "Failed to load department" }, { status: 500 });
  }
}
