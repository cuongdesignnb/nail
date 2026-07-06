'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Check, Plus, Minus } from 'lucide-react';

interface EntityOption {
  id: string;
  label: string;
  subtitle?: string;
  image?: string;
  status?: string;
}

interface SectionEntityPickerProps {
  label: string;
  entityType: 'service' | 'package' | 'technician' | 'promotion' | 'galleryCollection' | 'review' | 'blogPost';
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  multiple?: boolean;
  maxItems?: number;
  description?: string;
}

export function SectionEntityPicker({
  label,
  entityType,
  selectedIds = [],
  onChange,
  multiple = true,
  maxItems,
  description,
}: SectionEntityPickerProps) {
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/content/options?type=${entityType}`);
        if (!res.ok) {
          throw new Error('Failed to load options');
        }
        const json = await res.json();
        if (active) {
          setOptions(json.data || []);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Error loading dynamic options');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOptions();
    return () => {
      active = false;
    };
  }, [entityType]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.subtitle && opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelect = (id: string) => {
    if (multiple) {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((item) => item !== id));
      } else {
        if (maxItems && selectedIds.length >= maxItems) {
          return; // Max items reached
        }
        onChange([...selectedIds, id]);
      }
    } else {
      if (selectedIds.includes(id)) {
        onChange([]);
      } else {
        onChange([id]);
      }
    }
  };

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-neutral-800">
            {label}
          </label>
          {description && (
            <p className="text-xs text-neutral-500">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setPickerOpen(!pickerOpen)}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
        >
          {pickerOpen ? 'Close Selector' : `Choose ${entityType}s`}
        </button>
      </div>

      {/* Selected Items Summary list */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 py-1">
          {selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200/60"
            >
              {opt.image && (
                <img
                  src={opt.image}
                  alt=""
                  className="h-4 w-4 rounded-full object-cover"
                />
              )}
              {opt.label}
              <button
                type="button"
                onClick={() => toggleSelect(opt.id)}
                className="text-amber-600 hover:text-amber-800"
              >
                <Minus className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {selectedOptions.length === 0 && !pickerOpen && (
        <div className="rounded-md border border-dashed border-neutral-300 p-4 text-center">
          <p className="text-xs text-neutral-500">No {entityType}s selected yet.</p>
        </div>
      )}

      {/* Picker Modal / Dropdown area */}
      {pickerOpen && (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder={`Search ${entityType}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white pl-9 pr-4 py-2 text-sm outline-none transition-colors focus:border-[var(--admin-accent)]"
            />
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && filteredOptions.length === 0 && (
            <p className="text-center text-xs text-neutral-500 py-2">
              No matching options found.
            </p>
          )}

          {!loading && !error && filteredOptions.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
              {filteredOptions.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleSelect(opt.id)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-amber-50 hover:bg-amber-100/80'
                        : 'bg-white hover:bg-neutral-100/60 border border-neutral-200'
                    }`}
                  >
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">
                        {opt.label}
                      </p>
                      {opt.subtitle && (
                        <p className="text-xs text-neutral-500 truncate">
                          {opt.subtitle}
                        </p>
                      )}
                    </div>
                    {isSelected ? (
                      <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    ) : (
                      <Plus className="h-4 w-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
