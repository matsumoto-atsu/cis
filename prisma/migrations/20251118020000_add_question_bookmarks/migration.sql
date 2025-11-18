-- CreateTable
CREATE TABLE "public"."QuestionBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "block" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionBookmark_userId_idx" ON "public"."QuestionBookmark"("userId");

-- CreateIndex
CREATE INDEX "QuestionBookmark_questionKey_idx" ON "public"."QuestionBookmark"("questionKey");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBookmark_userId_questionKey_key" ON "public"."QuestionBookmark"("userId", "questionKey");

-- AddForeignKey
ALTER TABLE "public"."QuestionBookmark" ADD CONSTRAINT "QuestionBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
