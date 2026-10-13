-- AlterTable
ALTER TABLE "AiConversation" ADD COLUMN "guestId" TEXT;

-- CreateIndex
CREATE INDEX "AiConversation_guestId_idx" ON "AiConversation"("guestId");
