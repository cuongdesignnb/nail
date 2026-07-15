'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type PackageOccasion = {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  icon?: string;
};

type OccasionsData = {
  title: string;
  items: PackageOccasion[];
};

type Props = {
  data: OccasionsData;
  onChange: (data: OccasionsData) => void;
};

export function PackagesOccasionsSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<OccasionsData>) {
    onChange({ ...data, ...patch });
  }

  function updateItem(index: number, patch: Partial<PackageOccasion>) {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    update({ items });
  }

  function addItem() {
    update({
      items: [
        ...data.items,
        { id: crypto.randomUUID(), title: '', description: '', image: '', imageAlt: '', icon: '' },
      ],
    });
  }

  // Remove Item
  function removeItem(index: number) {
    update({ items: data.items.filter((_, i) => i !== index) });
  }

  // Move Item (up/down)
  function moveItem(index: number, direction: 'up' | 'down') {
    const items = [...data.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < items.length) {
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      update({ items });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Section Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Occasions List</label>
        {data.items.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Occasion {i + 1}
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
                  disabled={i === data.items.length - 1}
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
                <label className="block text-xs font-medium text-[#23212a] mb-1">Title</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="e.g. Bridal & Wedding Parties"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Icon / Category (Optional)</label>
                <input
                  type="text"
                  value={item.icon ?? ''}
                  onChange={(e) => updateItem(i, { icon: e.target.value })}
                  placeholder="e.g. heart"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Description</label>
              <textarea
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                placeholder="Describe this occasion..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[60px]"
              />
            </div>

            <MediaPickerField
              valueMode="url"
              label="Occasion Image"
              value={item.image ?? ''}
              alt={item.imageAlt ?? ''}
              onChange={(src) => updateItem(i, { image: src || "" })}
              onAltChange={(alt) => updateItem(i, { imageAlt: alt })}
              folder="occasions"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Occasion Item
      </button>
    </div>
  );
}
