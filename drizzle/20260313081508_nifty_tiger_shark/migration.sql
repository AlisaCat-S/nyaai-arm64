ALTER TABLE "model" ADD COLUMN "sortPriority" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "pagePatch" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "pagePatch" ADD CONSTRAINT "pagePatch_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL;