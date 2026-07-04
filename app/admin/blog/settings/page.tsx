import { redirect } from "next/navigation";

export default function LegacyBlogSettingsPage() {
  redirect("/admin/content/blog");
}
