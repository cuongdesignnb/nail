export function DraftStatusBadge({ hasChanges, publishedAt }: { hasChanges: boolean; publishedAt: string | null }) {
  if (!publishedAt) return <span className="draft-status not-published">Not published</span>;
  return <span className={`draft-status ${hasChanges ? "changed" : "published"}`}>{hasChanges ? "Draft changes" : "Published"}</span>;
}
