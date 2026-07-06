import crypto from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_RE = /^AERA-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

function key() {
  const secret =
    process.env.GIFT_CARD_CODE_SECRET ||
    process.env.PAYPAL_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    process.env.JWT_SECRET ||
    "aera-local-development-gift-card-secret";
  return crypto.createHash("sha256").update(secret).digest();
}

export function generateGiftCardCode() {
  const chars = Array.from({ length: 12 }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]);
  return `AERA-${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8, 12).join("")}`;
}

export function normalizeGiftCardCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function isGiftCardCodeFormat(code: string) {
  return CODE_RE.test(normalizeGiftCardCode(code));
}

export function hashGiftCardCode(code: string) {
  return crypto.createHmac("sha256", key()).update(normalizeGiftCardCode(code)).digest("hex");
}

export function encryptGiftCardCode(code: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(normalizeGiftCardCode(code), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptGiftCardCode(ciphertext: string) {
  const [ivRaw, tagRaw, dataRaw] = ciphertext.split(".");
  if (!ivRaw || !tagRaw || !dataRaw) throw new Error("Invalid gift card ciphertext.");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataRaw, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function codeSuffix(code: string) {
  return normalizeGiftCardCode(code).slice(-4);
}

export function maskGiftCardCode(suffix: string) {
  return `AERA-****-****-${suffix}`;
}
