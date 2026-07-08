import crypto from "crypto";
import { prisma } from "@/lib/db";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function suffix(length = 4) {
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export async function generateUniqueVoucherCode(prefix: string) {
  const normalized = prefix.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 32) || "AERA";
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = `${normalized}-${suffix(attempt > 3 ? 5 : 4)}`;
    const existing = await prisma.voucherCode.findUnique({ where: { code } }).catch(() => null);
    if (!existing) return code;
  }
  throw new Error("Unable to generate a unique voucher code.");
}
