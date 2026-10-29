-- CreateTable
CREATE TABLE "collection_products" (
    "collection_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_products_pkey" PRIMARY KEY ("collection_id","product_id")
);

-- CreateTable
CREATE TABLE "custom_requests" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "order_id" UUID,
    "request_type" TEXT NOT NULL,
    "product_type" TEXT,
    "occasion" TEXT,
    "customization_type" TEXT,
    "personalization_text" TEXT,
    "preferred_color" TEXT,
    "preferred_material" TEXT,
    "budget_min" DECIMAL(12,2),
    "budget_max" DECIMAL(12,2),
    "required_date" DATE,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_email" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "custom_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaboration_inquiries" (
    "id" UUID NOT NULL,
    "inquiry_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand_name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "project_type" TEXT,
    "required_people" TEXT,
    "preferred_date" DATE,
    "preferred_time" TEXT,
    "meeting_mode" TEXT,
    "location" TEXT,
    "budget_range" TEXT,
    "expected_audience" TEXT,
    "requested_role" TEXT,
    "message" TEXT,
    "reference_links" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "collaboration_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'contact_page',
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "email" TEXT NOT NULL,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "subscribed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" UUID NOT NULL,
    "setting_key" TEXT NOT NULL,
    "setting_value" JSONB NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_products_collection_id_sort_order_idx" ON "collection_products"("collection_id", "sort_order");

-- CreateIndex
CREATE INDEX "collection_products_product_id_idx" ON "collection_products"("product_id");

-- CreateIndex
CREATE INDEX "custom_requests_user_id_idx" ON "custom_requests"("user_id");

-- CreateIndex
CREATE INDEX "custom_requests_order_id_idx" ON "custom_requests"("order_id");

-- CreateIndex
CREATE INDEX "custom_requests_request_type_status_idx" ON "custom_requests"("request_type", "status");

-- CreateIndex
CREATE INDEX "custom_requests_customer_phone_idx" ON "custom_requests"("customer_phone");

-- CreateIndex
CREATE INDEX "custom_requests_created_at_idx" ON "custom_requests"("created_at" DESC);

-- CreateIndex
CREATE INDEX "collaboration_inquiries_status_created_at_idx" ON "collaboration_inquiries"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "collaboration_inquiries_inquiry_type_idx" ON "collaboration_inquiries"("inquiry_type");

-- CreateIndex
CREATE INDEX "collaboration_inquiries_email_idx" ON "collaboration_inquiries"("email");

-- CreateIndex
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");

-- CreateIndex
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages"("created_at" DESC);

-- CreateIndex
CREATE INDEX "contact_messages_email_idx" ON "contact_messages"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_user_id_idx" ON "newsletter_subscribers"("user_id");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_status_idx" ON "newsletter_subscribers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_setting_key_key" ON "site_settings"("setting_key");

-- CreateIndex
CREATE INDEX "site_settings_is_public_idx" ON "site_settings"("is_public");

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Backfill collection_products from products.collection_id before dropping it (D-21)
INSERT INTO "collection_products" ("collection_id", "product_id", "sort_order")
SELECT "collection_id", "id", 0 FROM "products";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_collection_id_fkey";

-- DropIndex
DROP INDEX "products_collection_id_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "collection_id";
