-- CreateTable
CREATE TABLE "public"."QuestionComment" (
    "id" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "body" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "QuestionComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionComment_questionKey_idx" ON "public"."QuestionComment"("questionKey");
CREATE INDEX "QuestionComment_userId_idx" ON "public"."QuestionComment"("userId");

-- AddForeignKey
ALTER TABLE "public"."QuestionComment" ADD CONSTRAINT "QuestionComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
