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
  const message = error instanceof Error ? error.message : String(error || "Unknown email error");
  return message.replace(/(password|pass|secret|token|apikey|api key)=?[^,\s]*/gi, "$1=[redacted]").slice(0, 500);
}
