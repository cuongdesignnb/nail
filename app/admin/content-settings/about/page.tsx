import { redirect } from "next/navigation";

export default function LegacyContentSettingsAboutPage() {
  redirect("/admin/content/about");
}
