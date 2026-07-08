-- Promotion campaign, voucher claim, and voucher email system.
ALTER TYPE "TransactionalEmailKind" ADD VALUE IF NOT EXISTS 'PROMOTION_VOUCHER';

CREATE TYPE "PromotionCampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED');
CREATE TYPE "PromotionDisplayLocation" AS ENUM ('HOMEPAGE', 'PROMOTIONS_PAGE', 'POPUP', 'ALL');
CREATE TYPE "PromotionTriggerType" AS ENUM ('SCROLL_PERCENT', 'SECTION_VISIBLE', 'DELAY_ONLY');
CREATE TYPE "VoucherDiscountType" AS ENUM ('PERCENT', 'FIXED_AMOUNT', 'FREE_ADDON', 'CUSTOM');
CREATE TYPE "VoucherCodeStatus" AS ENUM ('ISSUED', 'USED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "PromotionEmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "PromotionCampaign" (
  "id" TEXT NOT NULL,
  "seedKey" TEXT,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "eyebrow" TEXT,
  "badge" TEXT,
  "description" TEXT,
  "policyNote" TEXT,
  "ctaLabel" TEXT,
  "imageUrl" TEXT,
  "status" "PromotionCampaignStatus" NOT NULL DEFAULT 'DRAFT',
  "displayLocation" "PromotionDisplayLocation" NOT NULL DEFAULT 'HOMEPAGE',
  "showOnHomepage" BOOLEAN NOT NULL DEFAULT true,
  "popupEnabled" BOOLEAN NOT NULL DEFAULT false,
  "triggerType" "PromotionTriggerType" NOT NULL DEFAULT 'SCROLL_PERCENT',
  "scrollPercent" INTEGER NOT NULL DEFAULT 40,
  "delaySeconds" INTEGER NOT NULL DEFAULT 3,
  "frequencyHours" INTEGER NOT NULL DEFAULT 24,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PromotionCampaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VoucherTemplate" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "discountType" "VoucherDiscountType" NOT NULL,
  "discountValue" DECIMAL(65,30),
  "codePrefix" TEXT NOT NULL,
  "usageLimit" INTEGER NOT NULL DEFAULT 1,
  "perCustomerLimit" INTEGER NOT NULL DEFAULT 1,
  "expiresInDays" INTEGER NOT NULL DEFAULT 14,
  "minimumSpend" DECIMAL(65,30),
  "applicableServiceIds" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VoucherTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromotionLead" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "consentAccepted" BOOLEAN NOT NULL DEFAULT false,
  "sourcePage" TEXT,
  "ipHash" TEXT,
  "userAgent" TEXT,
  "emailStatus" "PromotionEmailStatus" NOT NULL DEFAULT 'PENDING',
  "emailSentAt" TIMESTAMP(3),
  "emailError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PromotionLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VoucherCode" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "leadId" TEXT,
  "code" TEXT NOT NULL,
  "codePrefix" TEXT,
  "status" "VoucherCodeStatus" NOT NULL DEFAULT 'ISSUED',
  "discountType" "VoucherDiscountType" NOT NULL,
  "discountValue" DECIMAL(65,30),
  "expiresAt" TIMESTAMP(3),
  "usedAt" TIMESTAMP(3),
  "bookingId" TEXT,
  "cancelledAt" TIMESTAMP(3),
  "cancelReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VoucherCode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromotionEmailTemplate" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "preheader" TEXT,
  "bodyHtml" TEXT NOT NULL,
  "bodyText" TEXT,
  "buttonLabel" TEXT,
  "buttonUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PromotionEmailTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PromotionCampaign_seedKey_key" ON "PromotionCampaign"("seedKey");
CREATE INDEX "PromotionCampaign_status_startDate_endDate_idx" ON "PromotionCampaign"("status", "startDate", "endDate");
CREATE INDEX "PromotionCampaign_showOnHomepage_popupEnabled_idx" ON "PromotionCampaign"("showOnHomepage", "popupEnabled");
CREATE INDEX "PromotionCampaign_sortOrder_idx" ON "PromotionCampaign"("sortOrder");
CREATE UNIQUE INDEX "VoucherTemplate_campaignId_key" ON "VoucherTemplate"("campaignId");
CREATE UNIQUE INDEX "PromotionLead_campaignId_email_key" ON "PromotionLead"("campaignId", "email");
CREATE INDEX "PromotionLead_email_idx" ON "PromotionLead"("email");
CREATE INDEX "PromotionLead_phone_idx" ON "PromotionLead"("phone");
CREATE INDEX "PromotionLead_campaignId_createdAt_idx" ON "PromotionLead"("campaignId", "createdAt");
CREATE UNIQUE INDEX "VoucherCode_leadId_key" ON "VoucherCode"("leadId");
CREATE UNIQUE INDEX "VoucherCode_code_key" ON "VoucherCode"("code");
CREATE INDEX "VoucherCode_campaignId_idx" ON "VoucherCode"("campaignId");
CREATE INDEX "VoucherCode_status_idx" ON "VoucherCode"("status");
CREATE INDEX "VoucherCode_expiresAt_idx" ON "VoucherCode"("expiresAt");
CREATE UNIQUE INDEX "PromotionEmailTemplate_campaignId_key" ON "PromotionEmailTemplate"("campaignId");

ALTER TABLE "VoucherTemplate" ADD CONSTRAINT "VoucherTemplate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PromotionCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PromotionLead" ADD CONSTRAINT "PromotionLead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PromotionCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VoucherCode" ADD CONSTRAINT "VoucherCode_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PromotionCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VoucherCode" ADD CONSTRAINT "VoucherCode_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "PromotionLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PromotionEmailTemplate" ADD CONSTRAINT "PromotionEmailTemplate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PromotionCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
