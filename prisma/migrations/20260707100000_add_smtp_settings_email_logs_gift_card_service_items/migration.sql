-- SMTP settings, transactional email logs, and service-bundle Gift Cards.
-- Backward compatible with existing single-service Gift Card records.

CREATE TYPE "TransactionalEmailKind" AS ENUM (
  'BOOKING_REQUEST_RECEIVED',
  'BOOKING_CONFIRMED',
  'BOOKING_RESCHEDULED',
  'BOOKING_CANCELLED',
  'BOOKING_COMPLETED',
  'GIFT_CARD_DELIVERY',
  'GIFT_CARD_PURCHASE_RECEIPT',
  'GIFT_CARD_RESEND',
  'SMTP_TEST'
);

CREATE TYPE "TransactionalEmailStatus" AS ENUM (
  'PENDING',
  'SENDING',
  'SENT',
  'FAILED'
);

ALTER TABLE "GiftCardPurchase"
  ADD COLUMN "serviceSubtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
  ADD COLUMN "gratuityAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
  ADD COLUMN "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;

UPDATE "GiftCardPurchase"
SET
  "serviceSubtotal" = CASE WHEN "type" = 'SERVICE' THEN "amount" ELSE 0 END,
  "totalAmount" = "amount"
WHERE "totalAmount" = 0;

ALTER TABLE "GiftCard"
  ADD COLUMN "gratuityAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
  ADD COLUMN "gratuityRedeemedAt" TIMESTAMP(3);

CREATE TABLE "GiftCardPurchaseServiceItem" (
  "id" TEXT NOT NULL,
  "purchaseId" TEXT NOT NULL,
  "serviceId" TEXT,
  "serviceNameSnapshot" TEXT NOT NULL,
  "servicePriceSnapshot" DECIMAL(65,30) NOT NULL,
  "serviceDurationSnapshot" INTEGER NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GiftCardPurchaseServiceItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GiftCardServiceItem" (
  "id" TEXT NOT NULL,
  "giftCardId" TEXT NOT NULL,
  "serviceId" TEXT,
  "serviceNameSnapshot" TEXT NOT NULL,
  "servicePriceSnapshot" DECIMAL(65,30) NOT NULL,
  "serviceDurationSnapshot" INTEGER NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "redeemedAt" TIMESTAMP(3),
  "redeemedBookingId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GiftCardServiceItem_pkey" PRIMARY KEY ("id")
);

INSERT INTO "GiftCardPurchaseServiceItem" (
  "id",
  "purchaseId",
  "serviceId",
  "serviceNameSnapshot",
  "servicePriceSnapshot",
  "serviceDurationSnapshot",
  "sortOrder"
)
SELECT
  concat('gcpsi_', replace(gen_random_uuid()::text, '-', '')),
  "id",
  "serviceId",
  COALESCE("serviceNameSnapshot", 'Selected Aera service'),
  COALESCE("servicePriceSnapshot", "amount"),
  COALESCE("serviceDurationSnapshot", 0),
  0
FROM "GiftCardPurchase"
WHERE "type" = 'SERVICE'
  AND "serviceNameSnapshot" IS NOT NULL;

INSERT INTO "GiftCardServiceItem" (
  "id",
  "giftCardId",
  "serviceId",
  "serviceNameSnapshot",
  "servicePriceSnapshot",
  "serviceDurationSnapshot",
  "sortOrder"
)
SELECT
  concat('gcsi_', replace(gen_random_uuid()::text, '-', '')),
  "id",
  "serviceId",
  COALESCE("serviceNameSnapshot", 'Selected Aera service'),
  COALESCE("servicePriceSnapshot", "initialAmount"),
  COALESCE("serviceDurationSnapshot", 0),
  0
FROM "GiftCard"
WHERE "type" = 'SERVICE'
  AND "serviceNameSnapshot" IS NOT NULL;

CREATE TABLE "EmailSmtpSetting" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL DEFAULT 'default',
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "host" TEXT,
  "port" INTEGER,
  "secure" BOOLEAN NOT NULL DEFAULT false,
  "username" TEXT,
  "encryptedPassword" TEXT,
  "fromName" TEXT,
  "fromEmail" TEXT,
  "replyToEmail" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "lastVerificationError" TEXT,
  "lastTestSentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmailSmtpSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransactionalEmailLog" (
  "id" TEXT NOT NULL,
  "kind" "TransactionalEmailKind" NOT NULL,
  "status" "TransactionalEmailStatus" NOT NULL DEFAULT 'PENDING',
  "recipient" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "lastAttemptAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "nextRetryAt" TIMESTAMP(3),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TransactionalEmailLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EmailSmtpSetting_key_key" ON "EmailSmtpSetting"("key");
CREATE INDEX "GiftCardPurchaseServiceItem_purchaseId_idx" ON "GiftCardPurchaseServiceItem"("purchaseId");
CREATE INDEX "GiftCardPurchaseServiceItem_serviceId_idx" ON "GiftCardPurchaseServiceItem"("serviceId");
CREATE INDEX "GiftCardServiceItem_giftCardId_idx" ON "GiftCardServiceItem"("giftCardId");
CREATE INDEX "GiftCardServiceItem_serviceId_idx" ON "GiftCardServiceItem"("serviceId");
CREATE INDEX "GiftCardServiceItem_redeemedAt_idx" ON "GiftCardServiceItem"("redeemedAt");
CREATE INDEX "TransactionalEmailLog_status_nextRetryAt_idx" ON "TransactionalEmailLog"("status", "nextRetryAt");
CREATE INDEX "TransactionalEmailLog_entityType_entityId_idx" ON "TransactionalEmailLog"("entityType", "entityId");
CREATE INDEX "TransactionalEmailLog_recipient_idx" ON "TransactionalEmailLog"("recipient");
CREATE INDEX "TransactionalEmailLog_createdAt_idx" ON "TransactionalEmailLog"("createdAt");

ALTER TABLE "GiftCardPurchaseServiceItem"
  ADD CONSTRAINT "GiftCardPurchaseServiceItem_purchaseId_fkey"
  FOREIGN KEY ("purchaseId") REFERENCES "GiftCardPurchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GiftCardPurchaseServiceItem"
  ADD CONSTRAINT "GiftCardPurchaseServiceItem_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GiftCardServiceItem"
  ADD CONSTRAINT "GiftCardServiceItem_giftCardId_fkey"
  FOREIGN KEY ("giftCardId") REFERENCES "GiftCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GiftCardServiceItem"
  ADD CONSTRAINT "GiftCardServiceItem_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
