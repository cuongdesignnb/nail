import { redirect } from "next/navigation";

const validPageKeys = [
  "home",
  "about",
  "services",
  "gallery",
  "packages",
  "promotions",
  "contact",
  "blog",
  "global",
];

export default function LegacyContentSettingsPage({
  searchParams,
}: {
  searchParams: { pageKey?: string };
}) {
  const pageKey = searchParams.pageKey;
  if (pageKey && validPageKeys.includes(pageKey)) {
    redirect(`/admin/content/${pageKey}`);
  }
  redirect("/admin/content");
}
