import { MenuEditorPage } from "@/components/admin/menus/MenuEditorPage";

export default function AdminMenuEditorRoute({ params }: { params: { key: string } }) {
  return <MenuEditorPage menuKey={params.key} />;
}
