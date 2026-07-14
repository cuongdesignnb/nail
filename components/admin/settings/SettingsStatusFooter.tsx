import { humanizeGlobalIssuePath } from "@/lib/settings/settings-validation-errors";

type Props = {
  isDirty: boolean;
  saving: boolean;
  lastSavedAt: string | null;
  updatedBy: string | null;
  publicRevalidated: boolean;
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  conflict?: boolean;
  onReload?: () => void;
};

export function SettingsStatusFooter(props: Props) {
  const status = props.saving
    ? "Saving"
    : props.isDirty
      ? "Unsaved changes"
      : props.lastSavedAt
        ? "Saved and verified"
        : "Loaded";
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-4 py-3 text-[11px] text-[var(--admin-muted)]">
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        <span>Status: <b className="text-[var(--admin-ink)]">{status}</b></span>
        <span>Last saved: <b>{props.lastSavedAt ? new Date(props.lastSavedAt).toLocaleString() : "—"}</b></span>
        <span>Saved by: <b>{props.updatedBy || "—"}</b></span>
        <span>Public site refreshed: <b>{props.publicRevalidated ? "Yes" : "No"}</b></span>
      </div>
      {props.error && <p className="mt-2 text-red-600">{props.error}</p>}
      {props.error && props.fieldErrors && Object.keys(props.fieldErrors).length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-red-600">
          {Object.entries(props.fieldErrors).flatMap(([path, messages]) =>
            messages.map((message) => (
              <li key={`${path}:${message}`}>{humanizeGlobalIssuePath(path)} <span className="sr-only">{message}</span></li>
            )),
          )}
        </ul>
      )}
      {props.conflict && props.onReload && (
        <button type="button" onClick={props.onReload} className="mt-2 font-bold text-[var(--admin-accent)] underline">Reload latest values</button>
      )}
    </div>
  );
}
