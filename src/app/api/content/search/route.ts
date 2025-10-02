import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/content-loader";

const DEFAULT_LIMIT = 30;

export const revalidate = 600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryRaw = searchParams.get("q") ?? "";
  const query = queryRaw.trim();
  if (!query) {
    return NextResponse.json({ data: [], meta: { query: "", count: 0 } });
  }

  const limit = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const normalizedQuery = query.toLowerCase();

  const index = await buildSearchIndex();

  const results = index
    .map((node) => {
      const labelLower = node.label.toLowerCase();
      const descriptionLower = node.description?.toLowerCase() ?? "";
      const matchesLabel = labelLower.includes(normalizedQuery);
      const matchesDescription = descriptionLower.includes(normalizedQuery);
      const matchesPath = node.path.join("/").toLowerCase().includes(normalizedQuery);
      if (!matchesLabel && !matchesDescription && !matchesPath) {
        return null;
      }
      let score = 0;
      if (labelLower.startsWith(normalizedQuery)) {
        score += 3;
      } else if (matchesLabel) {
        score += 2;
      }
      if (matchesDescription) {
        score += 1;
      }
      if (matchesPath) {
        score += 0.5;
      }
      return {
        ...node,
        score,
      };
    })
    .filter((node): node is typeof index[number] & { score: number } => node !== null)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.label.localeCompare(b.label);
    })
    .slice(0, Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT)
    .map(({ score, ...rest }) => ({ ...rest, score }));

  return NextResponse.json({
    data: results,
    meta: {
      query,
      count: results.length,
    },
  });
}
