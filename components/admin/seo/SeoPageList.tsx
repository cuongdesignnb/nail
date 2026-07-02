'use client';

import { Search, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

interface PageItem {
  scopeKey: string;
  pageKey: string;
  label: string;
  path: string;
}

interface SeoPageListProps {
  pages: PageItem[];
  selectedKey: string;
  onSelect: (scopeKey: string) => void;
  configuredKeys?: Set<string>;
}

export function SeoPageList({ pages, selectedKey, onSelect, configuredKeys = new Set() }: SeoPageListProps) {
  const [search, setSearch] = useState('');

  const filtered = pages.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Search */}
      <div className="border-b border-gray-200 p-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-aera-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-aera-ink placeholder:text-aera-muted/50 focus:border-aera-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Page list */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {filtered.map((page) => {
          const isSelected = page.scopeKey === selectedKey;
          const isConfigured = configuredKeys.has(page.scopeKey);

          return (
            <button
              key={page.scopeKey}
              onClick={() => onSelect(page.scopeKey)}
              className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 ${
                isSelected
                  ? 'bg-aera-champagne/50 border-l-2 border-l-aera-accent'
                  : 'hover:bg-aera-champagne/30'
              }`}
            >
              {isConfigured ? (
                <CheckCircle2 size={16} className="shrink-0 text-green-500" />
              ) : (
                <Circle size={16} className="shrink-0 text-gray-300" />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-aera-ink truncate">{page.label}</div>
                <div className="text-xs text-aera-muted truncate">{page.path}</div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-4 text-center text-sm text-aera-muted">No pages found</div>
        )}
      </div>
    </div>
  );
}
