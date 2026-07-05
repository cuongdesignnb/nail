CREATE TABLE IF NOT EXISTS "SeoSiteSetting" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL DEFAULT 'default',
  "titleTemplate" TEXT NOT NULL DEFAULT '%s | Aera Nail Lounge',
  "defaultRobots" TEXT NOT NULL DEFAULT 'index,follow',
  "locale" TEXT NOT NULL DEFAULT 'en_US',
  "twitterCard" TEXT NOT NULL DEFAULT 'summary_large_image',
  "twitterHandle" TEXT,
  "enableWebSiteSchema" BOOLEAN NOT NULL DEFAULT true,
  "enableNailSalonSchema" BOOLEAN NOT NULL DEFAULT true,
  "enableBreadcrumbSchema" BOOLEAN NOT NULL DEFAULT true,
  "enableFaqSchema" BOOLEAN NOT NULL DEFAULT true,
  "enableArticleSchema" BOOLEAN NOT NULL DEFAULT true,
  "enableServiceSchema" BOOLEAN NOT NULL DEFAULT true,
  "businessType" TEXT NOT NULL DEFAULT 'NailSalon',
  "priceRange" TEXT DEFAULT '$$',
  "latitude" DECIMAL(65,30),
  "longitude" DECIMAL(65,30),
  "googleBusinessProfileUrl" TEXT,
  "googleMapsUrl" TEXT,
  "sameAs" JSONB,
  "googleSiteVerification" TEXT,
  "bingSiteVerification" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeoSiteSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SeoSiteSetting_key_key" ON "SeoSiteSetting"("key");

