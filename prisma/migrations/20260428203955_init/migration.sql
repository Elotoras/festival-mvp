-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "codePrefix" TEXT NOT NULL DEFAULT 'P',
    "itemLabel" TEXT NOT NULL DEFAULT 'producto',
    "blindTasting" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "displayName" TEXT,
    "publicCode" TEXT NOT NULL,
    "productName" TEXT,
    "notes" TEXT,
    "visibleToJudges" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationCriterion" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "minScore" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "mainCriterion" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EvaluationCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JudgeVote" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "judgeName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceFingerprint" TEXT,

    CONSTRAINT "JudgeVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "criterionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialMention" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SpecialMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialMentionVote" (
    "id" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "specialMentionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "SpecialMentionVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Participant_eventId_sortOrder_idx" ON "Participant"("eventId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_eventId_publicCode_key" ON "Participant"("eventId", "publicCode");

-- CreateIndex
CREATE INDEX "EvaluationCriterion_eventId_sortOrder_idx" ON "EvaluationCriterion"("eventId", "sortOrder");

-- CreateIndex
CREATE INDEX "JudgeVote_eventId_createdAt_idx" ON "JudgeVote"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "Score_participantId_idx" ON "Score"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_voteId_participantId_criterionId_key" ON "Score"("voteId", "participantId", "criterionId");

-- CreateIndex
CREATE INDEX "SpecialMention_eventId_sortOrder_idx" ON "SpecialMention"("eventId", "sortOrder");

-- CreateIndex
CREATE INDEX "SpecialMentionVote_participantId_idx" ON "SpecialMentionVote"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialMentionVote_voteId_specialMentionId_key" ON "SpecialMentionVote"("voteId", "specialMentionId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCriterion" ADD CONSTRAINT "EvaluationCriterion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgeVote" ADD CONSTRAINT "JudgeVote_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "JudgeVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "EvaluationCriterion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialMention" ADD CONSTRAINT "SpecialMention_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialMentionVote" ADD CONSTRAINT "SpecialMentionVote_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "JudgeVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialMentionVote" ADD CONSTRAINT "SpecialMentionVote_specialMentionId_fkey" FOREIGN KEY ("specialMentionId") REFERENCES "SpecialMention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialMentionVote" ADD CONSTRAINT "SpecialMentionVote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
