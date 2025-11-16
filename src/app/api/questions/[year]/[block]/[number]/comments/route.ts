import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { questionKey } from "@/lib/question-key";

const MAX_COMMENT_LENGTH = 1000;

type RouteParams = {
  year?: string;
  block?: string;
  number?: string;
};

type RouteContext = {
  params: RouteParams | Promise<RouteParams>;
};

type ParsedParams = {
  year: number;
  block: number;
  number: number;
};

async function parseParams(paramsInput: RouteContext["params"]): Promise<ParsedParams | null> {
  const params = await Promise.resolve(paramsInput);
  const year = Number(params.year);
  const block = Number(params.block);
  const number = Number(params.number);

  if (!Number.isInteger(year) || !Number.isInteger(block) || !Number.isInteger(number)) {
    return null;
  }

  if (year <= 0 || block <= 0 || number <= 0) {
    return null;
  }

  return { year, block, number };
}

function formatComment(
  comment: {
    id: string;
    body: string;
    createdAt: Date;
    userId: string;
    user: { name: string | null; email: string | null };
  },
  currentUserId?: string | null,
) {
  const author = "名無し";
  const isMine = currentUserId ? comment.userId === currentUserId : false;
  return {
    id: comment.id,
    body: comment.body,
    author,
    createdAt: comment.createdAt.toISOString(),
    isMine,
  };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const parsed = await parseParams(context.params);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid question parameters" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const viewerId = session?.user?.id ?? null;
  const key = questionKey(parsed.year, parsed.block, parsed.number);
  const records = await prisma.questionComment.findMany({
    where: { questionKey: key },
    include: { user: true },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json({ comments: records.map(record => formatComment(record, viewerId)) });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const parsed = await parseParams(context.params);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid question parameters" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { body?: string } | null;
  const body = payload?.body?.trim();

  if (!body) {
    return NextResponse.json({ error: "コメントを入力してください" }, { status: 400 });
  }

  if (body.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json(
      { error: `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください` },
      { status: 422 },
    );
  }

  const key = questionKey(parsed.year, parsed.block, parsed.number);
  const created = await prisma.questionComment.create({
    data: {
      questionKey: key,
      body,
      userId: session.user.id,
    },
    include: { user: true },
  });

  return NextResponse.json({ comment: formatComment(created, session.user.id) }, { status: 201 });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const parsed = await parseParams(context.params);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid question parameters" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = payload?.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "削除対象のコメントIDが正しくありません" }, { status: 400 });
  }

  const key = questionKey(parsed.year, parsed.block, parsed.number);
  const result = await prisma.questionComment.deleteMany({
    where: {
      id,
      questionKey: key,
      userId: session.user.id,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "コメントが見つかりません" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
