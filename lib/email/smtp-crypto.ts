import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function key() {
  const secret =
    process.env.APP_SECRETS_ENCRYPTION_KEY ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "local-development-email-secret";
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSmtpSecret(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptSmtpSecret(ciphertext: string | null | undefined) {
  if (!ciphertext) return "";
  const [ivRaw, tagRaw, dataRaw] = ciphertext.split(".");
  if (!ivRaw || !tagRaw || !dataRaw) throw new Error("Invalid SMTP secret ciphertext.");
  const decipher = crypto.createDecipheriv(ALGORITHM, key(), Buffer.from(ivRaw, "base64"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataRaw, "base64")), decipher.final()]).toString("utf8");
}

export function sanitizeMailError(error: unknown) {
  const err = error as { code?: string; responseCode?: number; command?: string; message?: string } | null;
  const code = String(err?.code || "").toUpperCase();
  const responseCode = Number(err?.responseCode || 0);
  const message = String(err?.message || error || "Unknown email error");
  const lower = message.toLowerCase();

  if (code === "SMTP_PASSWORD_REQUIRED") return "Enter an SMTP password before testing the connection.";
  if (code === "SMTP_INVALID_CONFIG") return message;
  if (code === "EAUTH" || responseCode === 535 || lower.includes("invalid login") || lower.includes("authentication")) {
    return "Gmail rejected the SMTP login. Use a Google App Password and confirm 2-Step Verification is enabled for this Google account.";
  }
  if (code === "ETIMEDOUT" || lower.includes("timeout")) {
    return "SMTP connection timed out. Check whether the server can reach the configured SMTP port.";
  }
  if (code === "ECONNREFUSED") {
    return "SMTP server refused the connection. Check host, port and encryption mode.";
  }
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return "SMTP host could not be resolved. Check SMTP Host.";
  }
  if (code === "ESOCKET" || lower.includes("certificate") || lower.includes("tls") || lower.includes("ssl")) {
    return "SMTP TLS negotiation failed. Check encryption mode and port.";
  }

  return message.replace(/(password|pass|secret|token|apikey|api key)=?[^,\s]*/gi, "$1=[redacted]").slice(0, 500);
}

export function smtpErrorCode(error: unknown) {
  const message = sanitizeMailError(error);
  if (message.startsWith("Enter an SMTP password")) return "SMTP_PASSWORD_REQUIRED";
  if (message.startsWith("Gmail rejected")) return "SMTP_AUTH_FAILED";
  if (message.startsWith("SMTP connection timed out")) return "SMTP_TIMEOUT";
  if (message.startsWith("SMTP server refused")) return "SMTP_CONNECTION_REFUSED";
  if (message.startsWith("SMTP host could not")) return "SMTP_HOST_NOT_FOUND";
  if (message.startsWith("SMTP TLS negotiation")) return "SMTP_TLS_FAILED";
  return "SMTP_INVALID_CONFIG";
}
