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
};

type PackageReward = {
  id: string;
  title: string;
  description: string;
  points?: number;
  icon?: string;
  image?: string;
  imageAlt?: string;
  promoTitle?: string;
  promoValue?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

type RewardsData = {
  title: string;
  items: PackageReward[];
  promo: {
    title: string;
    value: string;
    description?: string;
    image?: ImageConfig;
    button: ButtonConfig;
  };
};

type Props = {
  data: RewardsData;
  onChange: (data: RewardsData) => void;
};

export function PackagesRewardsSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<RewardsData>) {
    onChange({ ...data, ...patch });
  }

  function updateItem(index: number, patch: Partial<PackageReward>) {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    update({ items });
  }

  function addItem() {
    update({
      items: [
        ...data.items,
        { id: crypto.randomUUID(), title: '', description: '', points: 0, icon: 'gem' },
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
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Section Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Rewards Items</label>
        {data.items.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Reward {i + 1}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#23212a] mb-1">Title</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="e.g. 10% Off Add-ons"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Points (Optional)</label>
                <input
                  type="number"
                  value={item.points ?? 0}
                  onChange={(e) => updateItem(i, { points: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Icon (Lucide name)</label>
                <input
                  type="text"
                  value={item.icon ?? ''}
                  onChange={(e) => updateItem(i, { icon: e.target.value })}
                  placeholder="e.g. percent, calendar, gift, gem"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(i, { description: e.target.value })}
                  placeholder="e.g. Save more on your favorite extra services."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Reward Item
      </button>

      {/* Promo Card Editor */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
        <label className="block text-sm font-semibold text-[#23212a]">Right: Join & Save Promo Card</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Promo Title</label>
            <input
              type="text"
              value={data.promo.title}
              onChange={(e) => update({ promo: { ...data.promo, title: e.target.value } })}
              placeholder="e.g. Join & Save"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Promo Value</label>
            <input
              type="text"
              value={data.promo.value}
              onChange={(e) => update({ promo: { ...data.promo, value: e.target.value } })}
              placeholder="e.g. 15% OFF"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#23212a] mb-1">Promo Description</label>
          <textarea
            value={data.promo.description ?? ''}
            onChange={(e) => update({ promo: { ...data.promo, description: e.target.value } })}
            placeholder="Promo description..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[60px]"
          />
        </div>

        <MediaPickerField
          label="Promo Image"
          value={data.promo.image ?? null}
          alt={data.promo.image?.alt ?? ''}
          onChange={(image) => update({ promo: { ...data.promo, image: image ?? { mediaId: null, src: '', alt: '' } } })}
          onAltChange={(alt) => update({ promo: { ...data.promo, image: { ...data.promo.image, src: data.promo.image?.src || '', alt: alt || '' } } })}
          folder="packages"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Button Label</label>
            <input
              type="text"
              value={data.promo.button.label}
              onChange={(e) => update({ promo: { ...data.promo, button: { ...data.promo.button, label: e.target.value } } })}
              placeholder="e.g. Become a Member"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Button Href</label>
            <input
              type="text"
              value={data.promo.button.href}
              onChange={(e) => update({ promo: { ...data.promo, button: { ...data.promo.button, href: e.target.value } } })}
              placeholder="e.g. /booking"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
