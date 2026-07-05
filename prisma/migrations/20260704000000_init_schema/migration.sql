-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Manager',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "reminderConsent" BOOLEAN NOT NULL DEFAULT true,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "totalSpent" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "lastVisitAt" TIMESTAMP(3),
    "lastPaymentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "durationMinutes" INTEGER,
    "durationLabel" TEXT,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "priceLabel" TEXT,
    "image" TEXT,
    "imageAlt" TEXT,
    "features" JSONB,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 5,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "technicianId" TEXT,
    "status" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "scheduledStartAt" TIMESTAMP(3) NOT NULL,
    "scheduledEndAt" TIMESTAMP(3) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "depositAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "internalNotes" TEXT,
    "checkedInAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "noShowAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingItem" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "serviceNameSnapshot" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "BookingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'manual',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "purpose" TEXT,
    "providerOrderId" TEXT,
    "providerCaptureId" TEXT,
    "providerPayerId" TEXT,
    "providerPayerEmail" TEXT,
    "providerPayerName" TEXT,
    "providerStatus" TEXT,
    "refundAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "refundedAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureReason" TEXT,
    "providerPayload" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "firstBookingOnly" BOOLEAN NOT NULL DEFAULT false,
    "validUntil" TIMESTAMP(3),
    "bannerImage" TEXT,
    "termsHtml" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "reorderLevel" INTEGER NOT NULL,
    "supplier" TEXT,
    "costPerUnit" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT,
    "tag" TEXT,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "performedBy" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SitePageContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "draftContent" JSONB NOT NULL,
    "publishedContent" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedBy" TEXT,
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SitePageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationMenu" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "draftItems" JSONB NOT NULL,
    "publishedItems" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedBy" TEXT,
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationMenuSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "headerMobileMode" TEXT NOT NULL DEFAULT 'inherit_header_primary',
    "headerMobileMenuKey" TEXT,
    "footerLayout" TEXT NOT NULL DEFAULT 'four_columns',
    "footerShowSocial" BOOLEAN NOT NULL DEFAULT true,
    "footerShowLegal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationMenuSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceAddon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "priceLabel" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "price" DECIMAL(65,30),
    "priceLabel" TEXT,
    "badge" TEXT,
    "features" JSONB,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceFaq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceFaq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceGalleryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT,
    "tag" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceGalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesPageSetting" (
    "id" TEXT NOT NULL,
    "heroEyebrow" TEXT,
    "heroTitle" TEXT,
    "heroHighlight" TEXT,
    "heroDescription" TEXT,
    "heroImage" TEXT,
    "heroImageAlt" TEXT,
    "primaryButtonLabel" TEXT,
    "primaryButtonHref" TEXT,
    "secondaryButtonLabel" TEXT,
    "secondaryButtonHref" TEXT,
    "whyChooseTitle" TEXT,
    "whyChooseDescription" TEXT,
    "whyChooseImage" TEXT,
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "ctaButtonLabel" TEXT,
    "ctaButtonHref" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesPageSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryPageSetting" (
    "id" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "heroEyebrow" TEXT,
    "heroTitle" TEXT,
    "heroHighlight" TEXT,
    "heroDescription" TEXT,
    "heroImage" TEXT,
    "heroImageAlt" TEXT,
    "primaryButtonLabel" TEXT,
    "primaryButtonHref" TEXT,
    "secondaryButtonLabel" TEXT,
    "secondaryButtonHref" TEXT,
    "whyEyebrow" TEXT,
    "whyTitle" TEXT,
    "whyDescription" TEXT,
    "whyImage" TEXT,
    "whyImageAlt" TEXT,
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "ctaButtonLabel" TEXT,
    "ctaButtonHref" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryPageSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryCollection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT,
    "designCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryTrend" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "imageAlt" TEXT,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryProcessStep" (
    "id" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryTestimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "avatarAlt" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "quote" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagePageSetting" (
    "id" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "heroEyebrow" TEXT,
    "heroTitle" TEXT,
    "heroHighlight" TEXT,
    "heroDescription" TEXT,
    "heroImage" TEXT,
    "heroImageAlt" TEXT,
    "primaryButtonLabel" TEXT,
    "primaryButtonHref" TEXT,
    "secondaryButtonLabel" TEXT,
    "secondaryButtonHref" TEXT,
    "benefitsEyebrow" TEXT,
    "benefitsTitle" TEXT,
    "benefitsDescription" TEXT,
    "benefitsImage" TEXT,
    "benefitsImageAlt" TEXT,
    "benefitsButtonLabel" TEXT,
    "benefitsButtonHref" TEXT,
    "comparisonTitle" TEXT,
    "rewardsTitle" TEXT,
    "occasionsTitle" TEXT,
    "processTitle" TEXT,
    "testimonialsTitle" TEXT,
    "faqTitle" TEXT,
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "ctaButtonLabel" TEXT,
    "ctaButtonHref" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagePageSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NailPackage" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "image" TEXT,
    "imageAlt" TEXT,
    "price" DECIMAL(65,30),
    "priceLabel" TEXT,
    "durationLabel" TEXT,
    "visitCountLabel" TEXT,
    "badge" TEXT,
    "features" JSONB,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NailPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageBenefit" (
    "id" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageComparisonFeature" (
    "id" TEXT NOT NULL,
    "featureName" TEXT NOT NULL,
    "essentialValue" TEXT,
    "signatureValue" TEXT,
    "premiumValue" TEXT,
    "vipValue" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageComparisonFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageReward" (
    "id" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "imageAlt" TEXT,
    "promoTitle" TEXT,
    "promoValue" TEXT,
    "buttonLabel" TEXT,
    "buttonHref" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageOccasion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "imageAlt" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageOccasion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageProcessStep" (
    "id" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageTestimonial" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "avatar" TEXT,
    "avatarAlt" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "quote" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageFaq" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageFaq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageContentBlock" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "blockKey" TEXT NOT NULL,
    "label" TEXT,
    "value" TEXT,
    "jsonValue" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPageSetting" (
    "id" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "heroEyebrow" TEXT,
    "heroTitle" TEXT,
    "heroHighlight" TEXT,
    "heroDescription" TEXT,
    "heroImage" TEXT,
    "heroImageAlt" TEXT,
    "primaryButtonLabel" TEXT,
    "primaryButtonHref" TEXT,
    "secondaryButtonLabel" TEXT,
    "secondaryButtonHref" TEXT,
    "latestTitle" TEXT,
    "browseTitle" TEXT,
    "editorsPickTitle" TEXT,
    "testimonialsTitle" TEXT,
    "sidebarCategoriesTitle" TEXT,
    "sidebarTrendingTitle" TEXT,
    "newsletterTitle" TEXT,
    "newsletterDescription" TEXT,
    "newsletterPlaceholder" TEXT,
    "newsletterButtonLabel" TEXT,
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "ctaButtonLabel" TEXT,
    "ctaButtonHref" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "hours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPageSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "imageAlt" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "contentJson" JSONB,
    "coverImage" TEXT,
    "coverImageAlt" TEXT,
    "coverMediaId" TEXT,
    "authorName" TEXT,
    "authorAvatar" TEXT,
    "authorRole" TEXT,
    "readTimeMinutes" INTEGER,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "isEditorsPick" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "faqs" JSONB,
    "products" JSONB,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiContentJobId" TEXT,
    "aiImagePrompt" TEXT,
    "generatedLanguage" TEXT,
    "generationVersion" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiProviderSetting" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "encryptedApiKey" TEXT,
    "apiKeyLastFour" TEXT,
    "apiKeyConfiguredAt" TIMESTAMP(3),
    "textModel" TEXT NOT NULL DEFAULT 'gpt-5.4-mini',
    "imageModel" TEXT NOT NULL DEFAULT 'gpt-image-2',
    "defaultOutputLanguage" TEXT NOT NULL DEFAULT 'en',
    "defaultArticleTone" TEXT NOT NULL DEFAULT 'luxury_editorial',
    "defaultArticleLength" INTEGER NOT NULL DEFAULT 1200,
    "defaultGenerateImage" BOOLEAN NOT NULL DEFAULT true,
    "defaultImageSize" TEXT NOT NULL DEFAULT '1536x1024',
    "defaultImageQuality" TEXT NOT NULL DEFAULT 'medium',
    "maxKeywordsPerBatch" INTEGER NOT NULL DEFAULT 30,
    "maxConcurrentJobs" INTEGER NOT NULL DEFAULT 1,
    "maxRetriesPerJob" INTEGER NOT NULL DEFAULT 2,
    "monthlyBudgetLimit" DECIMAL(65,30),
    "monthlyBudgetUsed" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "humanReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "autoScheduleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTestStatus" TEXT,
    "lastTestedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiProviderSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiContentBatch" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "rawKeywordInput" TEXT NOT NULL,
    "normalizedKeywords" JSONB NOT NULL,
    "outputLanguage" TEXT NOT NULL DEFAULT 'en',
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "generationMode" TEXT NOT NULL DEFAULT 'draft',
    "scheduleStartAt" TIMESTAMP(3),
    "scheduleIntervalHours" INTEGER,
    "timezone" TEXT,
    "generateImages" BOOLEAN NOT NULL DEFAULT true,
    "textModel" TEXT NOT NULL,
    "imageModel" TEXT,
    "requestedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiContentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiContentJob" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "normalizedKeyword" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 2,
    "scheduledPublishAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "lockedBy" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "textModel" TEXT NOT NULL,
    "imageModel" TEXT,
    "generateImage" BOOLEAN NOT NULL DEFAULT true,
    "requestSnapshot" JSONB,
    "articleSnapshot" JSONB,
    "imagePrompt" TEXT,
    "imageGenerationMeta" JSONB,
    "blogPostId" TEXT,
    "coverMediaId" TEXT,
    "providerResponseId" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "imageCount" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DECIMAL(65,30),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "retryAfter" TIMESTAMP(3),
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiContentJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiContentJobEvent" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiContentJobEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "originalMimeType" TEXT,
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "title" TEXT,
    "folder" TEXT,
    "storageKey" TEXT,
    "provider" TEXT DEFAULT 'local',
    "folderId" TEXT,
    "uploadedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaUsage" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "reason" TEXT,
    "performedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoMetadata" (
    "id" TEXT NOT NULL,
    "scopeKey" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "focusKeyphrase" TEXT,
    "canonicalPath" TEXT,
    "robots" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "ogImageMediaId" TEXT,
    "ogImageAlt" TEXT,
    "twitterCard" TEXT,
    "schemaJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoSiteSetting" (
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

-- CreateTable
CREATE TABLE "BusinessSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "timezone" TEXT NOT NULL DEFAULT 'America/Los_Angeles',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingCode_key" ON "Booking"("bookingCode");

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
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_sku_key" ON "InventoryItem"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryItem_slug_key" ON "GalleryItem"("slug");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "SitePageContent_slug_key" ON "SitePageContent"("slug");

-- CreateIndex
CREATE INDEX "SitePageContent_slug_idx" ON "SitePageContent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NavigationMenu_key_key" ON "NavigationMenu"("key");

-- CreateIndex
CREATE UNIQUE INDEX "NavigationMenu_location_key" ON "NavigationMenu"("location");

-- CreateIndex
CREATE INDEX "NavigationMenu_location_idx" ON "NavigationMenu"("location");

-- CreateIndex
CREATE UNIQUE INDEX "NavigationMenuSetting_key_key" ON "NavigationMenuSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_slug_key" ON "GalleryCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCollection_slug_key" ON "GalleryCollection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryTrend_slug_key" ON "GalleryTrend"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageCategory_slug_key" ON "PackageCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NailPackage_slug_key" ON "NailPackage"("slug");

-- CreateIndex
CREATE INDEX "PageTestimonial_pageKey_idx" ON "PageTestimonial"("pageKey");

-- CreateIndex
CREATE INDEX "PageFaq_pageKey_idx" ON "PageFaq"("pageKey");

-- CreateIndex
CREATE INDEX "PageContentBlock_pageKey_idx" ON "PageContentBlock"("pageKey");

-- CreateIndex
CREATE INDEX "PageContentBlock_sectionKey_idx" ON "PageContentBlock"("sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_aiContentJobId_key" ON "BlogPost"("aiContentJobId");

-- CreateIndex
CREATE UNIQUE INDEX "AiProviderSetting_provider_key" ON "AiProviderSetting"("provider");

-- CreateIndex
CREATE INDEX "AiContentBatch_status_idx" ON "AiContentBatch"("status");

-- CreateIndex
CREATE INDEX "AiContentBatch_createdAt_idx" ON "AiContentBatch"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiContentJob_blogPostId_key" ON "AiContentJob"("blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "AiContentJob_idempotencyKey_key" ON "AiContentJob"("idempotencyKey");

-- CreateIndex
CREATE INDEX "AiContentJob_status_scheduledPublishAt_idx" ON "AiContentJob"("status", "scheduledPublishAt");

-- CreateIndex
CREATE INDEX "AiContentJob_keyword_idx" ON "AiContentJob"("keyword");

-- CreateIndex
CREATE INDEX "AiContentJob_blogPostId_idx" ON "AiContentJob"("blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "AiContentJob_batchId_normalizedKeyword_key" ON "AiContentJob"("batchId", "normalizedKeyword");

-- CreateIndex
CREATE INDEX "AiContentJobEvent_jobId_createdAt_idx" ON "AiContentJobEvent"("jobId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MediaFolder_slug_key" ON "MediaFolder"("slug");

-- CreateIndex
CREATE INDEX "MediaFolder_parentId_idx" ON "MediaFolder"("parentId");

-- CreateIndex
CREATE INDEX "MediaAsset_folderId_idx" ON "MediaAsset"("folderId");

-- CreateIndex
CREATE INDEX "MediaAsset_isDeleted_idx" ON "MediaAsset"("isDeleted");

-- CreateIndex
CREATE INDEX "MediaUsage_mediaId_idx" ON "MediaUsage"("mediaId");

-- CreateIndex
CREATE INDEX "MediaUsage_entityType_entityId_idx" ON "MediaUsage"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaUsage_mediaId_entityType_entityId_fieldKey_key" ON "MediaUsage"("mediaId", "entityType", "entityId", "fieldKey");

-- CreateIndex
CREATE INDEX "InventoryMovement_inventoryItemId_idx" ON "InventoryMovement"("inventoryItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SeoMetadata_scopeKey_key" ON "SeoMetadata"("scopeKey");

-- CreateIndex
CREATE INDEX "SeoMetadata_pageKey_idx" ON "SeoMetadata"("pageKey");

-- CreateIndex
CREATE UNIQUE INDEX "SeoSiteSetting_key_key" ON "SeoSiteSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSetting_key_key" ON "BusinessSetting"("key");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddonItem" ADD CONSTRAINT "BookingAddonItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryItem" ADD CONSTRAINT "GalleryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GalleryCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NailPackage" ADD CONSTRAINT "NailPackage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackageCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiContentJob" ADD CONSTRAINT "AiContentJob_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "AiContentBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiContentJobEvent" ADD CONSTRAINT "AiContentJobEvent_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiContentJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "MediaFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaUsage" ADD CONSTRAINT "MediaUsage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
