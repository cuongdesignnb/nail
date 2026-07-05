import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const expected = [
  ["header-primary", "header_primary", 3],
  ["header-mobile", "header_mobile", 3],
  ["footer-company", "footer_company", 2],
  ["footer-services", "footer_services", 2],
  ["footer-explore", "footer_explore", 2],
  ["footer-legal", "footer_legal", 1],
  ["footer-social", "footer_social", 1],
] as const;

function items(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function walk(nodes: any[], visit: (item: any, depth: number) => void, depth = 1) {
  for (const node of nodes) {
    visit(node, depth);
    walk(Array.isArray(node.children) ? node.children : [], visit, depth + 1);
  }
}

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

async function main() {
  const menus = await prisma.navigationMenu.findMany();
  const settings = await prisma.navigationMenuSetting.findUnique({ where: { key: "default" } });
  assert(settings, "NavigationMenuSetting default row is missing.");
  assert(["inherit_header_primary", "custom_menu"].includes(settings!.headerMobileMode), "Header Mobile mode is invalid.");
  if (settings!.headerMobileMode === "custom_menu") {
    assert(menus.some((menu) => menu.key === settings!.headerMobileMenuKey && menu.location === "header_mobile"), "Custom mobile menu is missing.");
  }

  for (const [key, location, maxDepth] of expected) {
    const menu = menus.find((entry) => entry.key === key && entry.location === location);
    assert(menu, `${location} menu is missing.`);
    const published = items(menu!.publishedItems);
    if (location === "header_primary") assert(published.length > 0, "Header Primary has no valid published data.");

    walk(published, (item, depth) => {
      assert(depth <= maxDepth, `${location} exceeds max depth ${maxDepth}.`);
      const href = String(item.href || "");
      assert(!href.startsWith("/admin"), `${location} links to admin route.`);
      assert(!href.startsWith("/api"), `${location} links to API route.`);
      assert(!/^\s*(javascript|data):/i.test(href), `${location} has unsafe href.`);
      if (location === "footer_legal") assert(!item.children?.length, "Footer Legal has child items.");
      if (location === "footer_social") {
        assert(!item.children?.length, "Footer Social has child items.");
        assert(["external", "mailto", "tel"].includes(item.type), "Footer Social has unsupported link type.");
        if (item.type === "external") assert(/^https?:\/\//.test(href), "Footer Social external link is invalid.");
      }
    });
  }

  const shellService = fs.readFileSync(path.join(process.cwd(), "lib/site-shell/public-shell.service.ts"), "utf8");
  const publicHeader = fs.readFileSync(path.join(process.cwd(), "components/public/shell/PublicHeader.tsx"), "utf8");
  const publicFooter = fs.readFileSync(path.join(process.cwd(), "components/public/shell/PublicFooter.tsx"), "utf8");
  assert(shellService.includes("getPublishedPrimaryMenu"), "Public shell service does not use Header Primary Menu Manager data.");
  assert(shellService.includes("getPublishedMobileMenu"), "Public shell service does not use Header Mobile Menu Manager data.");
  assert(shellService.includes("getPublishedFooterCompanyMenu"), "Public shell service does not use Footer Company Menu Manager data.");
  assert(shellService.includes("getPublishedFooterServicesMenu"), "Public shell service does not use Footer Services Menu Manager data.");
  assert(shellService.includes("getPublishedFooterExploreMenu"), "Public shell service does not use Footer Explore Menu Manager data.");
  assert(shellService.includes("getPublishedFooterLegalMenu"), "Public shell service does not use Footer Legal Menu Manager data.");
  assert(shellService.includes("getPublishedFooterSocialMenu"), "Public shell service does not use Footer Social Menu Manager data.");
  assert(publicHeader.includes("data.header.primaryMenu"), "Current public Header does not render shell primary menu data.");
  assert(publicHeader.includes("data.header.mobileMenu"), "Current public Header does not render shell mobile menu data.");
  assert(publicFooter.includes("footer.companyMenu"), "Current public Footer does not render shell footer menu data.");
  assert(!publicFooter.includes("quickLinks ="), "Static Footer navigation array remains in PublicFooter.");

  console.log("Navigation menu verification passed.");
  console.log("Header Primary validated.");
  console.log("Header Mobile configuration validated.");
  console.log("Footer Company validated.");
  console.log("Footer Services validated.");
  console.log("Footer Explore validated.");
  console.log("Footer Legal validated.");
  console.log("Footer Social validated.");
  console.log("No invalid published links found.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
