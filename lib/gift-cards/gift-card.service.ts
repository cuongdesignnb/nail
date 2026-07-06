import crypto from "crypto";
import { GiftCardStatus, GiftCardTransactionType, GiftCardType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPublicPayPalConfig } from "@/lib/payments/paypal/paypal.config";
import { createPayPalOrder, capturePayPalOrder } from "@/lib/payments/paypal/paypal.orders";
import { cleanGiftCardMessage } from "./gift-card-validation";
import { codeSuffix, encryptGiftCardCode, generateGiftCardCode, hashGiftCardCode, isGiftCardCodeFormat, maskGiftCardCode } from "./gift-card-code";
import { sendGiftCardEmails } from "./gift-card-email";

const DEFAULT_PRESETS = [25, 50, 75, 100, 125, 150, 200, 250];

function asNumber(value: Prisma.Decimal | number | null | undefined) {
  return Number(value ?? 0);
}

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

async function orderNumber() {
  return `AERA-GC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function getGiftCardSettings() {
  return prisma.giftCardSetting.upsert({
    where: { key: "default" },
    update: {},
    create: {
      key: "default",
      currency: "USD",
      amountPresetValues: DEFAULT_PRESETS,
      minCustomAmount: 25,
      maxCustomAmount: 500,
      allowCustomAmount: true,
      expirationEnabled: false,
      giftCardsEnabled: true,
    },
  });
}

export async function getGiftCardCatalog() {
  const [settings, categories, paypal] = await Promise.all([
    getGiftCardSettings(),
    prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        services: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: { id: true, name: true, shortDescription: true, duration: true, durationMinutes: true, price: true, categoryId: true },
        },
      },
    }),
    getPublicPayPalConfig(),
  ]);

  return {
    settings: {
      currency: settings.currency,
      amountPresetValues: Array.isArray(settings.amountPresetValues) ? settings.amountPresetValues as number[] : DEFAULT_PRESETS,
      minCustomAmount: settings.minCustomAmount,
      maxCustomAmount: settings.maxCustomAmount,
      allowCustomAmount: settings.allowCustomAmount,
      giftCardsEnabled: settings.giftCardsEnabled,
    },
    categories: categories.map((category) => ({
      ...category,
      services: category.services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.shortDescription,
        durationMinutes: service.durationMinutes ?? service.duration,
        price: asNumber(service.price),
        categoryId: service.categoryId,
      })),
    })).filter((category) => category.services.length > 0),
    paypal: {
      enabled: paypal.enabled,
      clientId: paypal.clientId,
      currency: paypal.currency || settings.currency,
    },
  };
}

export async function createGiftCardPurchase(input: {
  type: "AMOUNT" | "SERVICE";
  amount?: number;
  serviceId?: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message: string;
}) {
  const settings = await getGiftCardSettings();
  if (!settings.giftCardsEnabled) throw new Error("Gift Cards are currently unavailable.");

  let amount = input.amount ?? 0;
  let service: Awaited<ReturnType<typeof prisma.service.findUnique>> | null = null;
  if (input.type === "SERVICE") {
    if (!input.serviceId) throw new Error("Please select a service.");
    service = await prisma.service.findUnique({ where: { id: input.serviceId }, include: { category: true } });
    if (!service || !service.isActive) throw new Error("Selected service is unavailable.");
    amount = asNumber(service.price);
  }

  if (input.type === "AMOUNT") {
    if (!Number.isInteger(amount) || amount < settings.minCustomAmount || amount > settings.maxCustomAmount) {
      throw new Error(`Gift Card amount must be between ${money(settings.minCustomAmount, settings.currency)} and ${money(settings.maxCustomAmount, settings.currency)}.`);
    }
  }

  return prisma.giftCardPurchase.create({
    data: {
      orderNumber: await orderNumber(),
      type: input.type as GiftCardType,
      amount,
      currency: settings.currency,
      purchaserName: input.senderName,
      purchaserEmail: input.senderEmail,
      recipientName: input.recipientName,
      recipientEmail: input.recipientEmail,
      senderName: input.senderName,
      senderEmail: input.senderEmail,
      message: cleanGiftCardMessage(input.message),
      serviceId: service?.id,
      serviceNameSnapshot: service?.name,
      servicePriceSnapshot: service ? service.price : null,
      serviceDurationSnapshot: service ? service.durationMinutes ?? service.duration : null,
      status: GiftCardStatus.PENDING_PAYMENT,
    },
  });
}

export async function createGiftCardPayPalOrder(purchaseId: string) {
  const [purchase, paypal] = await Promise.all([
    prisma.giftCardPurchase.findUnique({ where: { id: purchaseId } }),
    getPublicPayPalConfig(),
  ]);
  if (!purchase) throw new Error("Gift Card purchase was not found.");
  if (!paypal.enabled || !paypal.clientId) throw new Error("Online Gift Card payments are currently unavailable. Please contact the salon for assistance.");
  if (purchase.status !== GiftCardStatus.PENDING_PAYMENT) throw new Error("This Gift Card purchase is no longer payable.");
  if (purchase.paypalOrderId) return purchase.paypalOrderId;

  const order = await createPayPalOrder({
    sessionId: purchase.id,
    publicToken: purchase.orderNumber,
    amount: asNumber(purchase.amount),
    currency: purchase.currency,
    description: "Aera Nail Lounge Gift Card",
    idempotencyKey: `gift-card-${purchase.id}`,
  });
  await prisma.giftCardPurchase.update({ where: { id: purchase.id }, data: { paypalOrderId: order.id, paypalStatus: order.status } });
  return order.id;
}

async function createUniqueGiftCardCode(tx: Prisma.TransactionClient) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateGiftCardCode();
    const codeHash = hashGiftCardCode(code);
    const existing = await tx.giftCard.findUnique({ where: { codeHash } });
    if (!existing) return { code, codeHash };
  }
  throw new Error("Unable to generate a unique Gift Card code.");
}

export async function issueGiftCardForPurchase(purchaseId: string, capture?: { captureId?: string | null; status?: string; amount?: number; currency?: string }) {
  const card = await prisma.$transaction(async (tx) => {
    const purchase = await tx.giftCardPurchase.findUnique({ where: { id: purchaseId }, include: { giftCard: true } });
    if (!purchase) throw new Error("Gift Card purchase was not found.");
    if (purchase.giftCard) return purchase.giftCard;
    if (capture) {
      if (capture.status !== "COMPLETED") throw new Error("PayPal payment is not completed.");
      if (capture.currency !== purchase.currency || Math.round((capture.amount || 0) * 100) !== Math.round(asNumber(purchase.amount) * 100)) {
        throw new Error("PayPal payment amount could not be verified.");
      }
    }
    const { code, codeHash } = await createUniqueGiftCardCode(tx);
    await tx.giftCardPurchase.update({
      where: { id: purchase.id },
      data: {
        paypalCaptureId: capture?.captureId || purchase.paypalCaptureId,
        paypalStatus: capture?.status || purchase.paypalStatus || "COMPLETED",
        status: GiftCardStatus.PAID,
        paidAt: new Date(),
      },
    });
    const giftCard = await tx.giftCard.create({
      data: {
        purchaseId: purchase.id,
        type: purchase.type,
        codeHash,
        codeCiphertext: encryptGiftCardCode(code),
        codeSuffix: codeSuffix(code),
        initialAmount: purchase.amount,
        remainingBalance: purchase.type === GiftCardType.SERVICE ? 0 : purchase.amount,
        currency: purchase.currency,
        serviceId: purchase.serviceId,
        serviceNameSnapshot: purchase.serviceNameSnapshot,
        servicePriceSnapshot: purchase.servicePriceSnapshot,
        serviceDurationSnapshot: purchase.serviceDurationSnapshot,
        recipientName: purchase.recipientName,
        recipientEmail: purchase.recipientEmail,
        senderName: purchase.senderName,
        senderEmail: purchase.senderEmail,
        message: purchase.message,
        status: GiftCardStatus.ISSUED,
        issuedAt: new Date(),
      },
    });
    await tx.giftCardTransaction.create({
      data: { giftCardId: giftCard.id, type: GiftCardTransactionType.ISSUE, amount: purchase.amount, note: `Issued from purchase ${purchase.orderNumber}` },
    });
    return giftCard;
  });

  const withPurchase = await prisma.giftCard.findUniqueOrThrow({ where: { id: card.id }, include: { purchase: true } });
  try {
    await sendGiftCardEmails(withPurchase);
    return prisma.giftCard.update({ where: { id: card.id }, data: { emailStatus: "SENT", sentAt: new Date() } });
  } catch (error) {
    await prisma.giftCard.update({ where: { id: card.id }, data: { emailStatus: "FAILED" } });
    console.error("Gift Card email failed:", error instanceof Error ? error.message : error);
    return withPurchase;
  }
}

export async function captureGiftCardPayPalOrder(purchaseId: string, paypalOrderId: string) {
  const purchase = await prisma.giftCardPurchase.findUnique({ where: { id: purchaseId } });
  if (!purchase || purchase.paypalOrderId !== paypalOrderId) throw new Error("Gift Card PayPal order could not be verified.");
  const capture = await capturePayPalOrder(paypalOrderId, `gift-card-capture-${purchase.id}`);
  const card = await issueGiftCardForPurchase(purchase.id, {
    captureId: capture.captureId,
    status: capture.status,
    amount: capture.amount,
    currency: capture.currency,
  });
  return { giftCardId: card.id, orderNumber: purchase.orderNumber };
}

export async function checkGiftCardBalance(input: { code: string; recipientEmail: string }) {
  if (!isGiftCardCodeFormat(input.code)) throw new Error("Invalid Gift Card code.");
  const card = await prisma.giftCard.findUnique({
    where: { codeHash: hashGiftCardCode(input.code) },
    select: {
      recipientEmail: true,
      status: true,
      type: true,
      initialAmount: true,
      remainingBalance: true,
      currency: true,
      serviceNameSnapshot: true,
      codeSuffix: true,
      expiresAt: true,
    },
  });
  if (!card || card.recipientEmail.toLowerCase() !== input.recipientEmail.toLowerCase()) {
    throw new Error("Gift Card was not found for this recipient.");
  }
  return {
    code: maskGiftCardCode(card.codeSuffix),
    status: card.status,
    type: card.type,
    value: asNumber(card.initialAmount),
    remainingBalance: asNumber(card.remainingBalance),
    currency: card.currency,
    serviceName: card.serviceNameSnapshot,
    expiresAt: card.expiresAt,
  };
}

export async function listAdminGiftCards(query: { search?: string; type?: string; status?: string; emailStatus?: string }) {
  const where: Prisma.GiftCardWhereInput = {
    type: query.type ? query.type as GiftCardType : undefined,
    status: query.status ? query.status as GiftCardStatus : undefined,
    emailStatus: query.emailStatus ? query.emailStatus as any : undefined,
    OR: query.search ? [
      { recipientName: { contains: query.search, mode: "insensitive" } },
      { recipientEmail: { contains: query.search, mode: "insensitive" } },
      { senderName: { contains: query.search, mode: "insensitive" } },
      { senderEmail: { contains: query.search, mode: "insensitive" } },
      { codeSuffix: { contains: query.search, mode: "insensitive" } },
      { purchase: { orderNumber: { contains: query.search, mode: "insensitive" } } },
    ] : undefined,
  };
  const [cards, salesToday, active, redeemedThisMonth, pendingEmail] = await Promise.all([
    prisma.giftCard.findMany({ where, include: { purchase: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.giftCardPurchase.aggregate({
      where: { paidAt: { gte: new Date(new Date().toDateString()) }, status: { in: [GiftCardStatus.PAID, GiftCardStatus.ISSUED] } },
      _sum: { amount: true },
    }),
    prisma.giftCard.aggregate({ where: { status: { in: [GiftCardStatus.ISSUED, GiftCardStatus.PARTIALLY_REDEEMED] }, type: GiftCardType.AMOUNT }, _sum: { remainingBalance: true } }),
    prisma.giftCardTransaction.aggregate({ where: { type: GiftCardTransactionType.REDEEM, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }, _sum: { amount: true } }),
    prisma.giftCard.count({ where: { emailStatus: { in: ["PENDING", "FAILED"] } } }),
  ]);
  return {
    kpis: {
      salesToday: asNumber(salesToday._sum.amount),
      activeBalance: asNumber(active._sum.remainingBalance),
      redeemedThisMonth: asNumber(redeemedThisMonth._sum.amount),
      pendingEmail,
    },
    cards: cards.map((card) => ({
      id: card.id,
      code: maskGiftCardCode(card.codeSuffix),
      type: card.type,
      recipient: `${card.recipientName} (${card.recipientEmail})`,
      purchaser: `${card.senderName} (${card.senderEmail})`,
      value: card.type === "SERVICE" ? card.serviceNameSnapshot || money(asNumber(card.initialAmount), card.currency) : money(asNumber(card.initialAmount), card.currency),
      remainingBalance: money(asNumber(card.remainingBalance), card.currency),
      status: card.status,
      emailStatus: card.emailStatus,
      createdAt: card.createdAt.toISOString(),
      orderNumber: card.purchase.orderNumber,
    })),
  };
}

export async function getAdminGiftCard(id: string) {
  return prisma.giftCard.findUnique({
    where: { id },
    include: { purchase: true, transactions: { orderBy: { createdAt: "desc" } }, bookings: { select: { id: true, bookingCode: true, status: true, scheduledStartAt: true } } },
  });
}

export async function redeemGiftCard(id: string, amountInput?: number, note?: string, bookingId?: string) {
  return prisma.$transaction(async (tx) => {
    const card = await tx.giftCard.findUnique({ where: { id } });
    if (!card) throw new Error("Gift Card not found.");
    if (!["ISSUED", "PARTIALLY_REDEEMED"].includes(card.status)) throw new Error("Gift Card cannot be redeemed.");
    const amount = card.type === GiftCardType.SERVICE ? asNumber(card.initialAmount) : Number(amountInput || 0);
    if (amount <= 0) throw new Error("Redeem amount must be greater than zero.");
    if (card.type === GiftCardType.AMOUNT && amount > asNumber(card.remainingBalance)) throw new Error("Cannot redeem more than the remaining balance.");
    const nextBalance = card.type === GiftCardType.SERVICE ? 0 : asNumber(card.remainingBalance) - amount;
    const nextStatus = nextBalance <= 0 ? GiftCardStatus.REDEEMED : GiftCardStatus.PARTIALLY_REDEEMED;
    const updated = await tx.giftCard.update({ where: { id }, data: { remainingBalance: nextBalance, status: nextStatus } });
    await tx.giftCardTransaction.create({ data: { giftCardId: id, type: GiftCardTransactionType.REDEEM, amount, bookingId, note } });
    return updated;
  });
}

export async function adjustGiftCardBalance(id: string, amount: number, note?: string) {
  return prisma.$transaction(async (tx) => {
    const card = await tx.giftCard.findUnique({ where: { id } });
    if (!card) throw new Error("Gift Card not found.");
    const nextBalance = asNumber(card.remainingBalance) + amount;
    if (nextBalance < 0) throw new Error("Adjustment cannot make balance negative.");
    const updated = await tx.giftCard.update({
      where: { id },
      data: { remainingBalance: nextBalance, status: nextBalance <= 0 ? GiftCardStatus.REDEEMED : GiftCardStatus.PARTIALLY_REDEEMED },
    });
    await tx.giftCardTransaction.create({ data: { giftCardId: id, type: GiftCardTransactionType.ADJUSTMENT, amount, note } });
    return updated;
  });
}

export async function voidGiftCard(id: string, note?: string) {
  return prisma.$transaction(async (tx) => {
    const card = await tx.giftCard.update({ where: { id }, data: { status: GiftCardStatus.CANCELLED } });
    await tx.giftCardTransaction.create({ data: { giftCardId: id, type: GiftCardTransactionType.VOID, amount: 0, note } });
    return card;
  });
}

export async function resendGiftCardEmail(id: string) {
  const card = await prisma.giftCard.findUniqueOrThrow({ where: { id }, include: { purchase: true } });
  await sendGiftCardEmails(card);
  return prisma.giftCard.update({ where: { id }, data: { emailStatus: "SENT", sentAt: new Date() } });
}
