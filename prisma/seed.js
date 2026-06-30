const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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

  console.log("Seed completed: admin@aeranailounge.com / AeraAdmin123!");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
