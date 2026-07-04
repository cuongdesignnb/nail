import { redirect } from "next/navigation";

export default function LegacyServicesSettingsPage() {
  redirect("/admin/content/services");
}
