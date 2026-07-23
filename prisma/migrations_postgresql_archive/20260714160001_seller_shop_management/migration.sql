-- AlterTable
ALTER TABLE "seller_profiles" ADD COLUMN "shop_slug" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "logo_path" TEXT,
ADD COLUMN "banner_path" TEXT,
ADD COLUMN "return_policy" TEXT,
ADD COLUMN "shipping_policy" TEXT,
ADD COLUMN "shop_phone" TEXT,
ADD COLUMN "shop_email" TEXT,
ADD COLUMN "address_line1" TEXT,
ADD COLUMN "address_line2" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "region" TEXT,
ADD COLUMN "country" TEXT DEFAULT 'CM',
ADD COLUMN "onboarding_completed_at" TIMESTAMP(3),
ADD COLUMN "suspended_at" TIMESTAMP(3),
ADD COLUMN "suspension_reason" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_shop_slug_key" ON "seller_profiles"("shop_slug");

-- AlterTable
ALTER TABLE "seller_applications" ADD COLUMN "contact_phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN "contact_email" TEXT NOT NULL DEFAULT '',
ADD COLUMN "business_city" TEXT NOT NULL DEFAULT '',
ADD COLUMN "business_region" TEXT NOT NULL DEFAULT '',
ADD COLUMN "reviewed_by_id" TEXT;

-- Remove temporary defaults after backfill
ALTER TABLE "seller_applications" ALTER COLUMN "contact_phone" DROP DEFAULT;
ALTER TABLE "seller_applications" ALTER COLUMN "contact_email" DROP DEFAULT;
ALTER TABLE "seller_applications" ALTER COLUMN "business_city" DROP DEFAULT;
ALTER TABLE "seller_applications" ALTER COLUMN "business_region" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "seller_applications_status_submitted_at_idx" ON "seller_applications"("status", "submitted_at");
