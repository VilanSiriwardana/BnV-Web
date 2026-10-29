-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "status" SET DEFAULT 'inquiry_received';

-- CreateIndex
CREATE INDEX "orders_payment_status_idx" ON "orders"("payment_status");

-- D-04: existing orders start as inquiry_received
UPDATE "orders" SET "status" = 'inquiry_received' WHERE "status" = 'pending';
