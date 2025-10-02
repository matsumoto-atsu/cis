import { NextResponse } from "next/server";
import { listDepartments } from "@/lib/content-loader";

export const revalidate = 1800;

export async function GET() {
  try {
    const departments = await listDepartments();
    return NextResponse.json({ data: departments });
  } catch (error) {
    console.error("Failed to list departments", error);
    return NextResponse.json({ error: "Failed to load departments" }, { status: 500 });
  }
}
