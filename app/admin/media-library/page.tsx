import { redirect } from "next/navigation";

export default function LegacyMediaLibraryPage() {
  redirect("/admin/media");
}
