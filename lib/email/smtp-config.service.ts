import { z } from "zod";
import { prisma } from "@/lib/db";
import { decryptSmtpSecret, encryptSmtpSecret, sanitizeMailError } from "./smtp-crypto";
import { createSmtpTransporter } from "./smtp-transporter";
import type { PublicSmtpSettings, RuntimeSmtpConfig } from "./mail.types";

const DEFAULT_FROM_NAME = "Aera Nail Lounge";
const DEFAULT_FROM_EMAIL = "hello@aeranailounge.com";

export const smtpSettingsSchema = z.object({
  enabled: z.boolean(),
  host: z.string().trim().max(255).optional().nullable(),
  port: z.coerce.number().int().min(1).max(65535).optional().nullable(),
  secure: z.boolean(),
  username: z.string().trim().max(255).optional().nullable(),
  password: z.string().max(500).optional(),
  fromName: z.string().trim().max(120).optional().nullable(),
  fromEmail: z.string().trim().email().max(160).optional().nullable(),
  replyToEmail: z.string().trim().email().max(160).optional().nullable().or(z.literal("")),
});

function envConfig(): RuntimeSmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const fromEmail = process.env.SMTP_FROM_EMAIL;
  if (!host || !fromEmail) return null;
  return {
    enabled: true,
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    username: process.env.SMTP_USER || undefined,
    password: process.env.SMTP_PASSWORD || undefined,
    fromName: process.env.SMTP_FROM_NAME || DEFAULT_FROM_NAME,
    fromEmail,
    replyToEmail: process.env.SMTP_REPLY_TO || fromEmail,
    verified: true,
  };
}

function serialize(setting: {
  enabled: boolean;
  host: string | null;
  port: number | null;
  secure: boolean;
  username: string | null;
  encryptedPassword: string | null;
  fromName: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;
  verifiedAt: Date | null;
  lastVerificationError: string | null;
  lastTestSentAt?: Date | null;
}): PublicSmtpSettings {
  return {
    enabled: setting.enabled,
    host: setting.host,
    port: setting.port,
    secure: setting.secure,
    username: setting.username,
    hasPassword: Boolean(setting.encryptedPassword),
    fromName: setting.fromName,
    fromEmail: setting.fromEmail,
    replyToEmail: setting.replyToEmail,
    verifiedAt: setting.verifiedAt?.toISOString() || null,
    lastVerificationError: setting.lastVerificationError,
    lastTestSentAt: setting.lastTestSentAt?.toISOString() || null,
  };
}

export async function getPublicSmtpSettings(): Promise<PublicSmtpSettings> {
  try {
    const setting = await prisma.emailSmtpSetting.upsert({
      where: { key: "default" },
      update: {},
      create: { key: "default" },
    });
    return serialize(setting);
  } catch {
    const env = envConfig();
    return {
      enabled: Boolean(env),
      host: env?.host || null,
      port: env?.port || null,
      secure: env?.secure || false,
      username: env?.username || null,
      hasPassword: Boolean(env?.password),
      fromName: env?.fromName || null,
      fromEmail: env?.fromEmail || null,
      replyToEmail: env?.replyToEmail || null,
      verifiedAt: env ? new Date(0).toISOString() : null,
      lastVerificationError: null,
      lastTestSentAt: null,
    };
  }
}

export async function getRuntimeSmtpConfig(requireVerified = true): Promise<RuntimeSmtpConfig | null> {
  try {
    const setting = await prisma.emailSmtpSetting.findUnique({ where: { key: "default" } });
    if (setting?.enabled && setting.host && setting.port && setting.fromEmail) {
      if (requireVerified && !setting.verifiedAt) return null;
      return {
        enabled: setting.enabled,
        host: setting.host,
        port: setting.port,
        secure: setting.secure,
        username: setting.username || undefined,
        password: decryptSmtpSecret(setting.encryptedPassword),
        fromName: setting.fromName || DEFAULT_FROM_NAME,
        fromEmail: setting.fromEmail,
        replyToEmail: setting.replyToEmail || setting.fromEmail,
        verified: Boolean(setting.verifiedAt),
      };
    }
  } catch {
    // Fall through to env fallback. This keeps build/dev resilient before DB migration.
  }
  const env = envConfig();
  if (!env) return null;
  if (requireVerified && !env.verified) return null;
  return env;
}

export async function isTransactionalEmailReady() {
  return Boolean(await getRuntimeSmtpConfig(true));
}

export async function saveSmtpSettings(input: z.infer<typeof smtpSettingsSchema>) {
  const parsed = smtpSettingsSchema.parse(input);
  const data = {
    enabled: parsed.enabled,
    host: parsed.host || null,
    port: parsed.port || null,
    secure: parsed.secure,
    username: parsed.username || null,
    fromName: parsed.fromName || null,
    fromEmail: parsed.fromEmail || null,
    replyToEmail: parsed.replyToEmail || null,
    ...(parsed.password ? { encryptedPassword: encryptSmtpSecret(parsed.password) } : {}),
    verifiedAt: null,
    lastVerificationError: null,
  };
  const setting = await prisma.emailSmtpSetting.upsert({
    where: { key: "default" },
    update: data,
    create: { key: "default", ...data },
  });
  return serialize(setting);
}

export async function verifySmtpConnection() {
  const config = await getRuntimeSmtpConfig(false);
  if (!config?.enabled) throw new Error("SMTP is not configured.");
  try {
    await createSmtpTransporter(config).verify();
    const setting = await prisma.emailSmtpSetting.update({
      where: { key: "default" },
      data: { verifiedAt: new Date(), lastVerificationError: null },
    });
    return serialize(setting);
  } catch (error) {
    const safe = sanitizeMailError(error);
    await prisma.emailSmtpSetting.update({
      where: { key: "default" },
      data: { verifiedAt: null, lastVerificationError: safe },
    }).catch(() => undefined);
    throw new Error(safe);
  }
}
