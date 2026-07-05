"use client";

import { SeoEditorPanel } from "./SeoEditorPanel";

export function SeoEntityEditor({
  scopeKey,
  initialData,
  onSaved,
}: {
  scopeKey: string;
  initialData: any;
  onSaved: (data: any) => void;
}) {
  const pageKey = scopeKey.split(":")[0] || "entity";
  return (
    <SeoEditorPanel
      scopeKey={scopeKey}
      pageKey={pageKey}
      initialData={initialData}
      onSave={async (data) => {
        const res = await fetch(`/api/admin/seo/entities/${encodeURIComponent(scopeKey)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, pageKey }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Unable to save SEO metadata");
        onSaved(json.data);
      }}
    />
  );
}

