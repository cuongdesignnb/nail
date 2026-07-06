import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MenuItem = {
  id: string;
  label: string;
  href: string;
  type: string;
  target: string;
  isEnabled: boolean;
  children: MenuItem[];
};

const giftCardsItem: MenuItem = {
  id: "nav-gift-cards",
  label: "Gift Cards",
  href: "/gift-cards",
  type: "internal",
  target: "_self",
  isEnabled: true,
  children: [],
};

function addItem(items: unknown, item: MenuItem, afterId?: string) {
  const list = Array.isArray(items) ? [...items as MenuItem[]] : [];
  if (list.some((entry) => entry.href === item.href || entry.id === item.id)) return list;
  const afterIndex = afterId ? list.findIndex((entry) => entry.id === afterId) : -1;
  if (afterIndex >= 0) list.splice(afterIndex + 1, 0, item);
  else list.push(item);
  return list;
}

async function updateMenu(key: string, item: MenuItem, afterId?: string) {
  const menu = await prisma.navigationMenu.findUnique({ where: { key } });
  if (!menu) return;
  const draftItems = addItem(menu.draftItems, item, afterId);
  const publishedItems = addItem(menu.publishedItems, item, afterId);
  await prisma.navigationMenu.update({
    where: { key },
    data: { draftItems, publishedItems },
  });
}

async function main() {
  await updateMenu("header-primary", giftCardsItem, "nav-packages");
  await updateMenu("footer-explore", { ...giftCardsItem, id: "footer-explore-gift-cards" }, "footer-explore-promotions");
  await updateMenu("footer-legal", {
    id: "footer-legal-gift-cards",
    label: "Gift Card Terms",
    href: "/gift-cards/terms",
    type: "internal",
    target: "_self",
    isEnabled: true,
    children: [],
  });
  console.log("Gift Cards navigation migration complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
