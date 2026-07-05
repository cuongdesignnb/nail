-- AlterTable
ALTER TABLE "BookingItem" ADD COLUMN     "serviceNameSnapshot" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "lastPaymentAt" TIMESTAMP(3),
ADD COLUMN     "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderConsent" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "failureCode" TEXT,
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "providerCaptureId" TEXT,
ADD COLUMN     "providerOrderId" TEXT,
ADD COLUMN     "providerPayerEmail" TEXT,
ADD COLUMN     "providerPayerId" TEXT,
ADD COLUMN     "providerPayerName" TEXT,
ADD COLUMN     "providerPayload" JSONB,
ADD COLUMN     "providerStatus" TEXT,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "refundAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "refundedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BookingAddonItem" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "addonId" TEXT,
    "addonNameSnapshot" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingAddonItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentGatewayConfig" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'paypal',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "environment" TEXT NOT NULL DEFAULT 'sandbox',
    "clientId" TEXT,
    "encryptedClientSecret" TEXT,
    "webhookId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "chargeMode" TEXT NOT NULL DEFAULT 'deposit',
    "depositPercentage" DECIMAL(65,30) NOT NULL DEFAULT 25,
    "bookingHoldMinutes" INTEGER NOT NULL DEFAULT 15,
    "autoConfirmAfterPayment" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentGatewayConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingCheckoutSession" (
    "id" TEXT NOT NULL,
    "publicToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "customerPayload" JSONB NOT NULL,
    "bookingPayload" JSONB NOT NULL,
    "quoteSnapshot" JSONB NOT NULL,
    "technicianId" TEXT,
    "scheduledStartAt" TIMESTAMP(3) NOT NULL,
    "scheduledEndAt" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "paymentAmount" DECIMAL(65,30) NOT NULL,
    "chargeMode" TEXT NOT NULL,
    "paypalOrderId" TEXT,
    "paypalCaptureId" TEXT,
    "paypalPayerId" TEXT,
    "paypalPayerEmail" TEXT,
    "paypalPayerName" TEXT,
    "bookingId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "idempotencyKey" TEXT,
    "failureCode" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingCheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentWebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL,
    "processingStatus" TEXT NOT NULL DEFAULT 'received',
    "providerOrderId" TEXT,
    "providerCaptureId" TEXT,
    "checkoutSessionId" TEXT,
    "payload" JSONB NOT NULL,
    "processingError" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingAddonItem_bookingId_idx" ON "BookingAddonItem"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentGatewayConfig_provider_key" ON "PaymentGatewayConfig"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "BookingCheckoutSession_publicToken_key" ON "BookingCheckoutSession"("publicToken");

-- CreateIndex
CREATE UNIQUE INDEX "BookingCheckoutSession_paypalOrderId_key" ON "BookingCheckoutSession"("paypalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingCheckoutSession_paypalCaptureId_key" ON "BookingCheckoutSession"("paypalCaptureId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingCheckoutSession_bookingId_key" ON "BookingCheckoutSession"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingCheckoutSession_idempotencyKey_key" ON "BookingCheckoutSession"("idempotencyKey");

-- CreateIndex
CREATE INDEX "BookingCheckoutSession_status_idx" ON "BookingCheckoutSession"("status");

-- CreateIndex
CREATE INDEX "BookingCheckoutSession_technicianId_scheduledStartAt_schedu_idx" ON "BookingCheckoutSession"("technicianId", "scheduledStartAt", "scheduledEndAt");

-- CreateIndex
CREATE INDEX "BookingCheckoutSession_expiresAt_idx" ON "BookingCheckoutSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentWebhookEvent_providerEventId_key" ON "PaymentWebhookEvent"("providerEventId");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_provider_idx" ON "PaymentWebhookEvent"("provider");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_eventType_idx" ON "PaymentWebhookEvent"("eventType");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_providerOrderId_idx" ON "PaymentWebhookEvent"("providerOrderId");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_providerCaptureId_idx" ON "PaymentWebhookEvent"("providerCaptureId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerOrderId_key" ON "Payment"("providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerCaptureId_key" ON "Payment"("providerCaptureId");

-- CreateIndex
CREATE INDEX "Payment_provider_idx" ON "Payment"("provider");

-- CreateIndex
CREATE INDEX "Payment_providerOrderId_idx" ON "Payment"("providerOrderId");

-- CreateIndex
CREATE INDEX "Payment_providerCaptureId_idx" ON "Payment"("providerCaptureId");

-- AddForeignKey
ALTER TABLE "BookingAddonItem" ADD CONSTRAINT "BookingAddonItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
