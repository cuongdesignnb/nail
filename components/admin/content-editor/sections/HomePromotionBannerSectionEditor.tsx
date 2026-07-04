'use client';

import { Plus, Trash2 } from 'lucide-react';

type PromotionBannerData = {
  isVisible: boolean;
  title: string;
  description: string;
  code: string;
  button: { label: string; href: string };
  featuredPromotionIds: string[];
};

type Props = { data: PromotionBannerData; onChange: (data: PromotionBannerData) => void };

export function HomePromotionBannerSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<PromotionBannerData>) {
    onChange({ ...data, ...patch });
  }

  function addPromoId() {
    update({ featuredPromotionIds: [...data.featuredPromotionIds, ''] });
  }

  function updatePromoId(index: number, value: string) {
    const ids = [...data.featuredPromotionIds];
    ids[index] = value;
    update({ featuredPromotionIds: ids });
  }

  function removePromoId(index: number) {
    update({ featuredPromotionIds: data.featuredPromotionIds.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bannerVisible"
          checked={data.isVisible}
          onChange={(e) => update({ isVisible: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="bannerVisible" className="text-sm font-medium text-[#23212a]">
          Show Promotion Banner
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Special Offer"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Promo Code</label>
        <input
          type="text"
          value={data.code}
          onChange={(e) => update({ code: e.target.value })}
          placeholder="SUMMER2025"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
        <p className="text-xs text-gray-400 mt-1">Discount code displayed to visitors</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">Button</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Label</label>
            <input
              type="text"
              value={data.button?.label ?? ''}
              onChange={(e) => update({ button: { ...data.button, label: e.target.value } })}
              placeholder="View Promotions"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Link (href)</label>
            <input
              type="text"
              value={data.button?.href ?? ''}
              onChange={(e) => update({ button: { ...data.button, href: e.target.value } })}
              placeholder="/promotions"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Featured Promotion IDs</label>
        <p className="text-xs text-gray-400 mt-1 mb-2">Promotion IDs to highlight in the banner</p>
        <div className="space-y-2">
          {data.featuredPromotionIds.map((id, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => updatePromoId(i, e.target.value)}
                placeholder="promotion-id"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <button onClick={() => removePromoId(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addPromoId}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
        >
          <Plus size={16} /> Add Promotion ID
        </button>
      </div>
    </div>
  );
}
