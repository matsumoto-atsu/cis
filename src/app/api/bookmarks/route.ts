import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { questionKey } from "@/lib/question-key";

type SessionLike = {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
} & Record<string, unknown>;

type ParsedQuestion = {
  year: number;
  block: number;
  number: number;
};

type BookmarkDto = ParsedQuestion & { createdAt: string };

type BookmarkPayload = {
  year?: unknown;
  block?: unknown;
  number?: unknown;
};

function getSessionUserId(session: unknown): string | null {
  return (session as SessionLike | null)?.user?.id ?? null;
}

function parseQuestion(input: BookmarkPayload): ParsedQuestion | null {
  const year = Number(input.year);
  const block = Number(input.block);
  const number = Number(input.number);

  if (!Number.isInteger(year) || !Number.isInteger(block) || !Number.isInteger(number)) {
    return null;
  }

  if (year <= 0 || block <= 0 || number <= 0) {
    return null;
  }

  return { year, block, number };
}

function format(record: {
  year: number;
  block: number;
  number: number;
  createdAt: Date;
}): BookmarkDto {
  return {
    year: record.year,
    block: record.block,
    number: record.number,
    createdAt: record.createdAt.toISOString(),
  };
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions as never);
  const userId = getSessionUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams;
  const year = search.get("year");
  const block = search.get("block");
  const order = search.get("order");

  const yearNumber = year ? Number(year) : null;
  const blockNumber = block ? Number(block) : null;

  const where: Record<string, unknown> = { userId };
  if (yearNumber && Number.isInteger(yearNumber)) where.year = yearNumber;
  if (blockNumber && Number.isInteger(blockNumber)) where.block = blockNumber;

  const records = await prisma.questionBookmark.findMany({
    where,
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  const bookmarks = order === "random" ? shuffle(records) : records;
  return NextResponse.json({ bookmarks: bookmarks.map(format) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions as never);
  const userId = getSessionUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as BookmarkPayload | null;
  const parsed = payload ? parseQuestion(payload) : null;
  if (!parsed) {
    return NextResponse.json({ error: "year / block / number を指定してください" }, { status: 400 });
  }

  const key = questionKey(parsed.year, parsed.block, parsed.number);

  const created = await prisma.questionBookmark.upsert({
    where: { userId_questionKey: { userId, questionKey: key } },
    update: {},
    create: {
      userId,
      questionKey: key,
      year: parsed.year,
      block: parsed.block,
      number: parsed.number,
    },
  });

  return NextResponse.json({ bookmark: format(created) }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions as never);
  const userId = getSessionUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as BookmarkPayload | null;
  const parsed = payload ? parseQuestion(payload) : null;
  if (!parsed) {
    return NextResponse.json({ error: "year / block / number を指定してください" }, { status: 400 });
  }

  const key = questionKey(parsed.year, parsed.block, parsed.number);

  const result = await prisma.questionBookmark.deleteMany({
    where: {
      userId,
      questionKey: key,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "ブックマークが見つかりません" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
