import { z } from "zod";
import { prisma } from "@/lib/db";
import { decryptSmtpSecret, encryptSmtpSecret, sanitizeMailError, smtpErrorCode } from "./smtp-crypto";
import { createSmtpTransporter } from "./smtp-transporter";
import type { PublicSmtpSettings, RuntimeSmtpConfig, SmtpEncryptionMode } from "./mail.types";

const DEFAULT_FROM_NAME = "Aera Nail Lounge";
const DEFAULT_FROM_EMAIL = "hello@aeranailounge.com";
const SETTING_KEY = "default";

const encryptionModeSchema = z.enum(["STARTTLS", "TLS", "NONE"]);

export const smtpSettingsSchema = z.object({
  enabled: z.boolean(),
  host: z.string().trim().max(255).optional().nullable(),
  port: z.coerce.number().int().min(1).max(65535).optional().nullable(),
  secure: z.boolean().optional(),
  encryptionMode: encryptionModeSchema.optional(),
  username: z.string().trim().max(255).optional().nullable(),
  password: z.string().max(500).optional(),
  fromName: z.string().trim().max(120).optional().nullable(),
  fromEmail: z.string().trim().email().max(160).optional().nullable().or(z.literal("")),
  replyToEmail: z.string().trim().email().max(160).optional().nullable().or(z.literal("")),
}).superRefine((value, ctx) => {
  if (!value.enabled) return;
  if (!value.host) ctx.addIssue({ code: "custom", path: ["host"], message: "SMTP Host is required when email delivery is enabled." });
  if (!value.port) ctx.addIssue({ code: "custom", path: ["port"], message: "SMTP Port is required when email delivery is enabled." });
  if (!value.username) ctx.addIssue({ code: "custom", path: ["username"], message: "SMTP Username is required when email delivery is enabled." });
  if (!value.fromEmail) ctx.addIssue({ code: "custom", path: ["fromEmail"], message: "From Email is required when email delivery is enabled." });
});

type SmtpSettingRecord = {
  enabled: boolean;
  host: string | null;
  port: number | null;
  secure: boolean;
  smtpEncryptionMode?: string | null;
  username: string | null;
  encryptedPassword: string | null;
  fromName: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;
  verifiedAt: Date | null;
  lastVerificationError: string | null;
  lastTestSentAt?: Date | null;
};

function normalizeHost(raw: string | null | undefined) {
  const withoutProtocol = String(raw || "")
    .trim()
    .replace(/^(smtp|smtps|https?):\/\//i, "")
    .replace(/\/.*$/, "");
  const bracketedIpv6 = withoutProtocol.match(/^\[([^\]]+)\](?::(\d+))?$/);
  if (bracketedIpv6) return { host: bracketedIpv6[1], port: bracketedIpv6[2] ? Number(bracketedIpv6[2]) : undefined };
  const parts = withoutProtocol.split(":");
  if (parts.length === 2 && /^\d+$/.test(parts[1])) return { host: parts[0], port: Number(parts[1]) };
  return { host: withoutProtocol, port: undefined };
}

function encryptionFromLegacy(secure?: boolean | null): SmtpEncryptionMode {
  return secure ? "TLS" : "STARTTLS";
}

function normalizeMode(mode: unknown, secure?: boolean | null): SmtpEncryptionMode {
  const value = String(mode || "").toUpperCase();
  if (value === "TLS" || value === "SSL" || value === "SSL/TLS") return "TLS";
  if (value === "NONE") return "NONE";
  if (value === "STARTTLS") return "STARTTLS";
  return encryptionFromLegacy(secure);
}

function secureFromMode(mode: SmtpEncryptionMode) {
  return mode === "TLS";
}

function requireTlsFromMode(mode: SmtpEncryptionMode) {
  return mode === "STARTTLS";
}

function normalizeDraft(input: z.infer<typeof smtpSettingsSchema>) {
  const parsed = smtpSettingsSchema.parse(input);
  const hostParts = normalizeHost(parsed.host);
  const encryptionMode = normalizeMode(parsed.encryptionMode, parsed.secure);
  const port = parsed.port || hostParts.port || (encryptionMode === "TLS" ? 465 : 587);
  const host = hostParts.host || null;
  const username = parsed.username?.trim() || null;
  const fromEmail = parsed.fromEmail?.trim() || null;
  if (parsed.enabled && encryptionMode === "NONE" && process.env.NODE_ENV === "production") {
    const error = new Error("SMTP encryption mode NONE is only allowed for local development.");
    (error as Error & { code?: string }).code = "SMTP_INVALID_CONFIG";
    throw error;
  }
  return {
    enabled: parsed.enabled,
    host,
    port,
    secure: secureFromMode(encryptionMode),
    smtpEncryptionMode: encryptionMode,
    username,
    fromName: parsed.fromName?.trim() || DEFAULT_FROM_NAME,
    fromEmail,
    replyToEmail: parsed.replyToEmail?.trim() || null,
    password: parsed.password || "",
  };
}

function modeFromRecord(setting: SmtpSettingRecord): SmtpEncryptionMode {
  return normalizeMode(setting.smtpEncryptionMode, setting.secure);
}

function serialize(setting: SmtpSettingRecord): PublicSmtpSettings {
  const encryptionMode = modeFromRecord(setting);
  return {
    enabled: setting.enabled,
    host: setting.host,
    port: setting.port,
    secure: secureFromMode(encryptionMode),
    encryptionMode,
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

function envConfig(): RuntimeSmtpConfig | null {
  const hostParts = normalizeHost(process.env.SMTP_HOST);
  const fromEmail = process.env.SMTP_FROM_EMAIL;
  if (!hostParts.host || !fromEmail) return null;
  const encryptionMode = normalizeMode(process.env.SMTP_ENCRYPTION_MODE, String(process.env.SMTP_SECURE || "false") === "true");
  return {
    enabled: true,
    host: hostParts.host,
    port: Number(process.env.SMTP_PORT || hostParts.port || (encryptionMode === "TLS" ? 465 : 587)),
    secure: secureFromMode(encryptionMode),
    encryptionMode,
    requireTLS: requireTlsFromMode(encryptionMode),
    username: process.env.SMTP_USER || undefined,
    password: process.env.SMTP_PASSWORD || undefined,
    fromName: process.env.SMTP_FROM_NAME || DEFAULT_FROM_NAME,
    fromEmail,
    replyToEmail: process.env.SMTP_REPLY_TO || fromEmail,
    verified: true,
  };
}

function runtimeFromDraft(draft: ReturnType<typeof normalizeDraft>, password: string): RuntimeSmtpConfig | null {
  if (!draft.enabled || !draft.host || !draft.port || !draft.fromEmail) return null;
  return {
    enabled: draft.enabled,
    host: draft.host,
    port: draft.port,
    secure: draft.secure,
    encryptionMode: draft.smtpEncryptionMode,
    requireTLS: requireTlsFromMode(draft.smtpEncryptionMode),
    username: draft.username || undefined,
    password,
    fromName: draft.fromName || DEFAULT_FROM_NAME,
    fromEmail: draft.fromEmail,
    replyToEmail: draft.replyToEmail || draft.fromEmail,
    verified: false,
  };
}

function warningForConfig(config: RuntimeSmtpConfig) {
  if (config.encryptionMode === "STARTTLS" && config.port === 465) {
    return "STARTTLS usually uses port 587. Port 465 usually requires SSL/TLS.";
  }
  if (config.encryptionMode === "TLS" && config.port === 587) {
    return "SSL/TLS usually uses port 465. Port 587 usually requires STARTTLS.";
  }
  return null;
}

async function savedSetting() {
  return prisma.emailSmtpSetting.upsert({
    where: { key: SETTING_KEY },
    update: {},
    create: { key: SETTING_KEY },
  });
}

export async function getPublicSmtpSettings(): Promise<PublicSmtpSettings> {
  try {
    return serialize(await savedSetting());
  } catch {
    const env = envConfig();
    return {
      enabled: Boolean(env),
      host: env?.host || null,
      port: env?.port || null,
      secure: env?.secure || false,
      encryptionMode: env?.encryptionMode || "STARTTLS",
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
    const setting = await prisma.emailSmtpSetting.findUnique({ where: { key: SETTING_KEY } });
    if (setting?.enabled && setting.host && setting.port && setting.fromEmail) {
      if (requireVerified && !setting.verifiedAt) return null;
      const encryptionMode = modeFromRecord(setting);
      return {
        enabled: setting.enabled,
        host: setting.host,
        port: setting.port,
        secure: secureFromMode(encryptionMode),
        encryptionMode,
        requireTLS: requireTlsFromMode(encryptionMode),
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
  const draft = normalizeDraft(input);
  const existing = await savedSetting();
  if (draft.enabled && !draft.password && !existing.encryptedPassword) {
    throw new Error("Enter an SMTP password before saving enabled email delivery.");
  }
  const data = {
    enabled: draft.enabled,
    host: draft.host,
    port: draft.port,
    secure: draft.secure,
    smtpEncryptionMode: draft.smtpEncryptionMode,
    username: draft.username,
    fromName: draft.fromName,
    fromEmail: draft.fromEmail,
    replyToEmail: draft.replyToEmail,
    ...(draft.password ? { encryptedPassword: encryptSmtpSecret(draft.password) } : {}),
    verifiedAt: null,
    lastVerificationError: null,
  };
  const setting = await prisma.emailSmtpSetting.update({ where: { key: SETTING_KEY }, data });
  return serialize(setting);
}

export async function verifySmtpConnection(input: z.infer<typeof smtpSettingsSchema>) {
  const draft = normalizeDraft(input);
  const existing = await savedSetting();
  const password = draft.password || decryptSmtpSecret(existing.encryptedPassword);
  if (!password) {
    const safe = "Enter an SMTP password before testing the connection.";
    await prisma.emailSmtpSetting.update({
      where: { key: SETTING_KEY },
      data: {
        enabled: draft.enabled,
        host: draft.host,
        port: draft.port,
        secure: draft.secure,
        smtpEncryptionMode: draft.smtpEncryptionMode,
        username: draft.username,
        fromName: draft.fromName,
        fromEmail: draft.fromEmail,
        replyToEmail: draft.replyToEmail,
        verifiedAt: null,
        lastVerificationError: safe,
      },
    }).catch(() => undefined);
    const error = new Error(safe);
    (error as Error & { code?: string }).code = "SMTP_PASSWORD_REQUIRED";
    throw error;
  }
  const config = runtimeFromDraft(draft, password);
  if (!config) {
    const error = new Error("SMTP settings are incomplete. Check host, port, sender email and credentials.");
    (error as Error & { code?: string }).code = "SMTP_INVALID_CONFIG";
    throw error;
  }
  const warning = warningForConfig(config);
  if (warning) {
    const error = new Error(warning);
    (error as Error & { code?: string }).code = "SMTP_INVALID_CONFIG";
    throw error;
  }

  try {
    await createSmtpTransporter(config).verify();
    const setting = await prisma.emailSmtpSetting.update({
      where: { key: SETTING_KEY },
      data: {
        enabled: true,
        host: draft.host,
        port: draft.port,
        secure: draft.secure,
        smtpEncryptionMode: draft.smtpEncryptionMode,
        username: draft.username,
        fromName: draft.fromName,
        fromEmail: draft.fromEmail,
        replyToEmail: draft.replyToEmail,
        ...(draft.password ? { encryptedPassword: encryptSmtpSecret(draft.password) } : {}),
        verifiedAt: new Date(),
        lastVerificationError: null,
      },
    });
    return serialize(setting);
  } catch (error) {
    const safe = sanitizeMailError(error);
    await prisma.emailSmtpSetting.update({
      where: { key: SETTING_KEY },
      data: {
        enabled: draft.enabled,
        host: draft.host,
        port: draft.port,
        secure: draft.secure,
        smtpEncryptionMode: draft.smtpEncryptionMode,
        username: draft.username,
        fromName: draft.fromName,
        fromEmail: draft.fromEmail,
        replyToEmail: draft.replyToEmail,
        verifiedAt: null,
        lastVerificationError: safe,
      },
    }).catch(() => undefined);
    const safeError = new Error(safe);
    (safeError as Error & { code?: string }).code = smtpErrorCode(error);
    throw safeError;
  }
}
