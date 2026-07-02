const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("AeraAdmin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@aeranailounge.com" },
    update: {},
    create: {
      email: "admin@aeranailounge.com",
      name: "Sophia Tran",
      role: "Owner",
      password
    }
  });

  await prisma.promotion.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      title: "10% Off Your First Visit",
      amount: 10,
      type: "percentage",
      active: true,
      validUntil: new Date("2026-12-31")
    }
  });

  const aboutJsonPath = path.join(__dirname, "..", "data", "about.default.json");
  const defaultAboutContent = JSON.parse(fs.readFileSync(aboutJsonPath, "utf8"));
  await prisma.sitePageContent.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      slug: "about",
      draftContent: defaultAboutContent,
      publishedContent: defaultAboutContent,
      updatedBy: "seed",
      publishedBy: "seed",
      publishedAt: new Date()
    }
  });

  console.log("Seed completed: admin@aeranailounge.com / AeraAdmin123!");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
