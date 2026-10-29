-- AlterTable
ALTER TABLE "custom_requests" ADD COLUMN     "reference_image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "dispatched_at" TIMESTAMPTZ(6);
