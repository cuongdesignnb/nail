import { redirect } from "next/navigation";

export default function LegacyPackageSettingsPage() {
  redirect("/admin/content/packages");
}
