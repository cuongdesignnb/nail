import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

async function main() {
  const email = process.env.BOOTSTRAP_OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_OWNER_PASSWORD;

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error("BOOTSTRAP_OWNER_EMAIL must be a valid email.");
  }

  if (!password || password.length < 20) {
    throw new Error("BOOTSTRAP_OWNER_PASSWORD must be at least 20 characters.");
  }

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("[INFO] Existing admin users found. Bootstrap skipped.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const name = email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  await prisma.user.create({
    data: {
      email,
      name: name || "Owner",
      role: "Owner",
      password: passwordHash,
    },
  });

  console.log("[OK] Initial Owner account inserted.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Bootstrap failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
