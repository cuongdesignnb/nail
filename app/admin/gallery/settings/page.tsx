import { redirect } from "next/navigation";

export default function LegacyGallerySettingsPage() {
  redirect("/admin/content/gallery");
}
