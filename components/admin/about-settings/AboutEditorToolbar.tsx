import Link from "next/link";
import { DraftStatusBadge } from "./DraftStatusBadge";

export function AboutEditorToolbar({
  loading,
  hasChanges,
  updatedAt,
  publishedAt,
  onSave,
  onPublish,
  onDiscard,
  onRestore
}: {
  loading: boolean;
  hasChanges: boolean;
  updatedAt: string | null;
  publishedAt: string | null;
  onSave: () => void;
  onPublish: () => void;
  onDiscard: () => void;
  onRestore: () => void;
}) {
  return (
    <aside className="about-editor-toolbar">
      <DraftStatusBadge hasChanges={hasChanges} publishedAt={publishedAt} />
      <p>Last saved<br /><b>{updatedAt ? new Date(updatedAt).toLocaleString() : "Never"}</b></p>
      <p>Last published<br /><b>{publishedAt ? new Date(publishedAt).toLocaleString() : "Not published"}</b></p>
      <button className="primary-btn" disabled={loading} onClick={onSave}>{loading ? "Saving..." : "Save Draft"}</button>
      <Link className="secondary-btn" href="/admin/settings/about/preview">Preview Draft</Link>
      <button className="primary-btn" disabled={loading} onClick={onPublish}>Publish Changes</button>
      <button className="secondary-btn" disabled={loading} onClick={onDiscard}>Discard Changes</button>
      <button className="secondary-btn" disabled={loading} onClick={onRestore}>Restore Default Content</button>
      <Link className="text-link" href="/admin/settings">Back to Settings</Link>
    </aside>
  );
}
