'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';
import { asArray } from '@/lib/utils/array';

type InspirationItem = {
  id: string;
  title?: string;
  image: string;
  imageAlt?: string;
  tag?: string;
};

type Props = {
  data: InspirationItem[];
  onChange: (data: InspirationItem[]) => void;
};

export function ServicesDesignInspirationSectionEditor({ data = [], onChange }: Props) {
  const items = asArray<InspirationItem>(data);

  function update(newData: InspirationItem[]) {
    onChange(newData);
  }

  function updateItem(index: number, patch: Partial<InspirationItem>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    update(next);
  }

  function addItem() {
    update([
      ...items,
      {
        id: crypto.randomUUID(),
        title: '',
        image: '',
        imageAlt: '',
        tag: '',
      },
    ]);
  }

  function removeItem(index: number) {
    update(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: 'up' | 'down') {
    const next = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < next.length) {
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      update(next);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Inspiration {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveItem(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(i, 'down')}
                  disabled={i === items.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Title (Optional)</label>
                <input
                  type="text"
                  value={item.title ?? ''}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="e.g. Classic French Manicure"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Tag (Optional)</label>
                <input
                  type="text"
                  value={item.tag ?? ''}
                  onChange={(e) => updateItem(i, { tag: e.target.value })}
                  placeholder="e.g. Wedding, Summer"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <MediaPickerField
              valueMode="url"
              label="Inspiration Image"
              value={item.image}
              alt={item.imageAlt ?? ''}
              onChange={(src) => updateItem(i, { image: src || "" })}
              onAltChange={(alt) => updateItem(i, { imageAlt: alt })}
              folder="gallery"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition animate-fade-in"
      >
        <Plus size={16} /> Add Inspiration Item
      </button>
    </div>
  );
}
