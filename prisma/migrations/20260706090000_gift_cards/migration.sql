-- Gift Cards module and pay-at-salon booking defaults
CREATE TYPE "GiftCardType" AS ENUM ('AMOUNT', 'SERVICE');
CREATE TYPE "GiftCardStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'ISSUED', 'PARTIALLY_REDEEMED', 'REDEEMED', 'EXPIRED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "GiftCardTransactionType" AS ENUM ('ISSUE', 'REDEEM', 'ADJUSTMENT', 'VOID', 'REFUND', 'EXPIRE', 'RESERVATION', 'RELEASE_RESERVATION');
CREATE TYPE "GiftCardEmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

ALTER TABLE "Booking"
  ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'PAY_AT_SALON',
  ADD COLUMN "giftCardId" TEXT,
  ADD COLUMN "giftCardReservedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;

CREATE TABLE "GiftCardPurchase" (
  "id" TEXT NOT NULL,
  "orderNumber" TEXT NOT NULL,
  "type" "GiftCardType" NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "purchaserName" TEXT NOT NULL,
  "purchaserEmail" TEXT NOT NULL,
  "recipientName" TEXT NOT NULL,
  "recipientEmail" TEXT NOT NULL,
  "senderName" TEXT NOT NULL,
  "senderEmail" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "serviceId" TEXT,
  "serviceNameSnapshot" TEXT,
  "servicePriceSnapshot" DECIMAL(65,30),
  "serviceDurationSnapshot" INTEGER,
  "paypalOrderId" TEXT,
  "paypalCaptureId" TEXT,
  "paypalStatus" TEXT,
  "status" "GiftCardStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GiftCardPurchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GiftCard" (
  "id" TEXT NOT NULL,
  "purchaseId" TEXT NOT NULL,
  "type" "GiftCardType" NOT NULL,
  "codeHash" TEXT NOT NULL,
  "codeCiphertext" TEXT NOT NULL,
  "codeSuffix" TEXT NOT NULL,
  "initialAmount" DECIMAL(65,30) NOT NULL,
  "remainingBalance" DECIMAL(65,30) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "serviceId" TEXT,
  "serviceNameSnapshot" TEXT,
  "servicePriceSnapshot" DECIMAL(65,30),
  "serviceDurationSnapshot" INTEGER,
  "recipientName" TEXT NOT NULL,
  "recipientEmail" TEXT NOT NULL,
  "senderName" TEXT NOT NULL,
  "senderEmail" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "GiftCardStatus" NOT NULL DEFAULT 'ISSUED',
  "issuedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "emailStatus" "GiftCardEmailStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GiftCardTransaction" (
  "id" TEXT NOT NULL,
  "giftCardId" TEXT NOT NULL,
  "type" "GiftCardTransactionType" NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "bookingId" TEXT,
  "performedByUserId" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GiftCardTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GiftCardSetting" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL DEFAULT 'default',
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amountPresetValues" JSONB NOT NULL,
  "minCustomAmount" INTEGER NOT NULL DEFAULT 25,
  "maxCustomAmount" INTEGER NOT NULL DEFAULT 500,
  "allowCustomAmount" BOOLEAN NOT NULL DEFAULT true,
  "expirationEnabled" BOOLEAN NOT NULL DEFAULT false,
  "giftCardsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GiftCardSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GiftCardTemplate" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "palette" JSONB,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GiftCardTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GiftCardPurchase_orderNumber_key" ON "GiftCardPurchase"("orderNumber");
CREATE UNIQUE INDEX "GiftCardPurchase_paypalOrderId_key" ON "GiftCardPurchase"("paypalOrderId");
CREATE UNIQUE INDEX "GiftCardPurchase_paypalCaptureId_key" ON "GiftCardPurchase"("paypalCaptureId");
CREATE INDEX "GiftCardPurchase_status_idx" ON "GiftCardPurchase"("status");
CREATE INDEX "GiftCardPurchase_recipientEmail_idx" ON "GiftCardPurchase"("recipientEmail");
CREATE INDEX "GiftCardPurchase_purchaserEmail_idx" ON "GiftCardPurchase"("purchaserEmail");
CREATE INDEX "GiftCardPurchase_createdAt_idx" ON "GiftCardPurchase"("createdAt");
CREATE INDEX "GiftCardPurchase_serviceId_idx" ON "GiftCardPurchase"("serviceId");

CREATE UNIQUE INDEX "GiftCard_purchaseId_key" ON "GiftCard"("purchaseId");
CREATE UNIQUE INDEX "GiftCard_codeHash_key" ON "GiftCard"("codeHash");
CREATE INDEX "GiftCard_status_idx" ON "GiftCard"("status");
CREATE INDEX "GiftCard_recipientEmail_idx" ON "GiftCard"("recipientEmail");
CREATE INDEX "GiftCard_senderEmail_idx" ON "GiftCard"("senderEmail");
CREATE INDEX "GiftCard_createdAt_idx" ON "GiftCard"("createdAt");
CREATE INDEX "GiftCard_expiresAt_idx" ON "GiftCard"("expiresAt");
CREATE INDEX "GiftCard_serviceId_idx" ON "GiftCard"("serviceId");

CREATE INDEX "GiftCardTransaction_giftCardId_idx" ON "GiftCardTransaction"("giftCardId");
CREATE INDEX "GiftCardTransaction_bookingId_idx" ON "GiftCardTransaction"("bookingId");
CREATE INDEX "GiftCardTransaction_type_idx" ON "GiftCardTransaction"("type");
CREATE INDEX "GiftCardTransaction_createdAt_idx" ON "GiftCardTransaction"("createdAt");
CREATE UNIQUE INDEX "GiftCardSetting_key_key" ON "GiftCardSetting"("key");

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "GiftCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GiftCardPurchase" ADD CONSTRAINT "GiftCardPurchase_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GiftCard" ADD CONSTRAINT "GiftCard_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "GiftCardPurchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GiftCard" ADD CONSTRAINT "GiftCard_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GiftCardTransaction" ADD CONSTRAINT "GiftCardTransaction_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "GiftCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GiftCardTransaction" ADD CONSTRAINT "GiftCardTransaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
