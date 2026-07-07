-- Add optional service subcategories so the production menu can keep
-- brochure sections such as Full Set, Refill, Nail Style, and Waxing.
CREATE TABLE "ServiceSubcategory" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ServiceSubcategory_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Service"
ADD COLUMN "subcategoryId" TEXT;

CREATE UNIQUE INDEX "ServiceSubcategory_slug_key" ON "ServiceSubcategory"("slug");
CREATE INDEX "ServiceSubcategory_categoryId_idx" ON "ServiceSubcategory"("categoryId");
CREATE INDEX "Service_subcategoryId_idx" ON "Service"("subcategoryId");

ALTER TABLE "ServiceSubcategory"
ADD CONSTRAINT "ServiceSubcategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Service"
ADD CONSTRAINT "Service_subcategoryId_fkey"
FOREIGN KEY ("subcategoryId") REFERENCES "ServiceSubcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
