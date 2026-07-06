"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface MediaFolder {
  id: string;
  name: string;
  slug: string;
}

interface MediaFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  folder: string;
  onFolderChange: (value: string) => void;
  folders: MediaFolder[];
  sort: string;
  onSortChange: (value: string) => void;
  total?: number;
}

export function MediaFilterBar({
  search,
  onSearchChange,
  folder,
  onFolderChange,
  folders,
  sort,
  onSortChange,
  total,
}: MediaFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl p-3 border border-[var(--admin-border)]/40 shadow-sm">
      {/* Search */}
      <div className="relative flex-grow min-w-[200px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-placeholder)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search images..."
          className="w-full rounded-lg border border-[var(--admin-border-strong)] pl-9 pr-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors"
        />
      </div>

      {/* Folder filter */}
      <div className="flex items-center gap-1.5">
        <SlidersHorizontal size={13} className="text-[var(--admin-muted)]" />
        <select
          value={folder}
          onChange={(e) => onFolderChange(e.target.value)}
          className="rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors cursor-pointer"
        >
          <option value="">All Folders</option>
          {folders.map((f) => (
            <option key={f.id} value={f.slug}>
              {f.name}
            </option>
          ))}
          {folders.length === 0 && <option value="uploads">Uploads</option>}
        </select>
      </div>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-xs outline-none focus:border-[var(--admin-accent)] bg-white transition-colors cursor-pointer"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name A–Z</option>
        <option value="size">Largest First</option>
      </select>

      {/* Count */}
      {total !== undefined && (
        <span className="text-[11px] text-[var(--admin-muted)] ml-auto">
          {total} {total === 1 ? "asset" : "assets"}
        </span>
      )}
    </div>
  );
}

export default MediaFilterBar;
