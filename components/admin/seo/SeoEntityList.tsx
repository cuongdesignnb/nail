"use client";

export type SeoEntityListItem = {
  scopeKey: string;
  type: string;
  label: string;
  path: string;
};

export function SeoEntityList({
  entities,
  selected,
  onSelect,
}: {
  entities: SeoEntityListItem[];
  selected: string | null;
  onSelect: (scopeKey: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {entities.map((entity) => (
        <button
          key={entity.scopeKey}
          onClick={() => onSelect(entity.scopeKey)}
          className={`flex w-full flex-col border-b border-gray-100 px-4 py-3 text-left last:border-b-0 ${
            selected === entity.scopeKey ? "bg-[var(--admin-surface-muted)]" : "hover:bg-[var(--admin-surface-hover)]"
          }`}
        >
          <span className="text-sm font-semibold text-[var(--admin-ink)]">{entity.label}</span>
          <span className="text-xs text-[var(--admin-muted)]">{entity.type} · {entity.path}</span>
        </button>
      ))}
      {entities.length === 0 && <div className="p-4 text-sm text-[var(--admin-muted)]">No public entities found.</div>}
    </div>
  );
}

