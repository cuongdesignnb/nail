'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type ImageConfig = {
  mediaId?: string | null;
  src: string;
  alt: string;
  title?: string | null;
};

type ButtonConfig = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

type PackageBenefit = {
  id: string;
  icon?: string;
  title: string;
  description: string;
};

type PackagesBenefitsData = {
  eyebrow: string;
  title: string;
  description: string;
  image: ImageConfig;
  button: ButtonConfig;
  items: PackageBenefit[];
};

type Props = {
  data: PackagesBenefitsData;
  onChange: (data: PackagesBenefitsData) => void;
};

export function PackagesBenefitsSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<PackagesBenefitsData>) {
    onChange({ ...data, ...patch });
  }

  function updateItem(index: number, patch: Partial<PackageBenefit>) {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    update({ items });
  }

  function addItem() {
    update({
      items: [
        ...data.items,
        { id: crypto.randomUUID(), icon: 'check-circle', title: '', description: '' },
      ],
    });
  }

  function removeItem(index: number) {
    update({ items: data.items.filter((_, i) => i !== index) });
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
          <input
            type="text"
            value={data.eyebrow}
            onChange={(e) => update({ eyebrow: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[80px]"
        />
      </div>

      <MediaPickerField
        label="Benefits Section Image"
        value={data.image ?? null}
        alt={data.image?.alt ?? ''}
        onChange={(image) => update({ image: image ?? { mediaId: null, src: '', alt: '' } })}
        onAltChange={(alt) => update({ image: { ...data.image, alt } })}
        folder="packages"
      />

      <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
        <label className="block text-sm font-semibold text-[#23212a]">Call to Action Button</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Button Label</label>
            <input
              type="text"
              value={data.button?.label ?? ''}
              onChange={(e) => update({ button: { ...data.button, label: e.target.value } })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Button Href</label>
            <input
              type="text"
              value={data.button?.href ?? ''}
              onChange={(e) => update({ button: { ...data.button, href: e.target.value } })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Benefits Items</label>
        {data.items.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Benefit {i + 1}
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
                  placeholder="e.g. Free Upgrades"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Icon (Lucide name)</label>
                <input
                  type="text"
                  value={item.icon ?? ''}
                  onChange={(e) => updateItem(i, { icon: e.target.value })}
                  placeholder="e.g. star"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Description</label>
              <textarea
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                placeholder="Benefit description..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Benefit Item
      </button>
    </div>
  );
}
