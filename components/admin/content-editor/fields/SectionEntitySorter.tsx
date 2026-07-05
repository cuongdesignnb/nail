'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

interface EntityOption {
  id: string;
  label: string;
  subtitle?: string;
  image?: string;
}

interface SectionEntitySorterProps {
  label: string;
  entityType: 'service' | 'package' | 'technician' | 'promotion' | 'galleryCollection' | 'review' | 'blogPost';
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  description?: string;
}

export function SectionEntitySorter({
  label,
  entityType,
  selectedIds = [],
  onChange,
  description,
}: SectionEntitySorterProps) {
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/content/options?type=${entityType}`);
        if (res.ok) {
          const json = await res.json();
          if (active) {
            setOptions(json.data || []);
          }
        }
      } catch (err) {
        console.error('Error fetching options in sorter:', err);
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

  // Order selected items based on selectedIds sequence
  const sortedSelected = selectedIds
    .map((id) => options.find((opt) => opt.id === id))
    .filter((opt): opt is EntityOption => !!opt);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIds = [...selectedIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newIds.length) return;

    // Swap elements
    const temp = newIds[index];
    newIds[index] = newIds[targetIndex];
    newIds[targetIndex] = temp;

    onChange(newIds);
  };

  if (selectedIds.length <= 1) {
    return null; // No need to sort 0 or 1 item
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-semibold text-neutral-800">
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-neutral-500 py-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading sortable list...
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white divide-y divide-neutral-100 shadow-sm">
          {sortedSelected.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-semibold text-neutral-400 w-4">
                  {idx + 1}
                </span>
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {item.label}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-neutral-500 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, 'up')}
                  className="p-1 rounded text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Move Up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === sortedSelected.length - 1}
                  onClick={() => moveItem(idx, 'down')}
                  className="p-1 rounded text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
