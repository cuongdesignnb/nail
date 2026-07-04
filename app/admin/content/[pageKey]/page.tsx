import { notFound } from "next/navigation";
import { isValidPageKey } from "@/lib/content/content-registry";
import { PageContentEditor } from "@/components/admin/content-editor/PageContentEditor";

export default function ContentEditorPage({
  params,
}: {
  params: { pageKey: string };
}) {
  if (!isValidPageKey(params.pageKey)) notFound();
  return <PageContentEditor pageKey={params.pageKey} />;
}
