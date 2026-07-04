'use client';

import { Plus, Trash2 } from 'lucide-react';

type FeaturedPromotionsData = {
  title: string;
  featuredPromotionIds: string[];
  showAll: boolean;
};

type Props = { data: FeaturedPromotionsData; onChange: (data: FeaturedPromotionsData) => void };

export function FeaturedPromotionsSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<FeaturedPromotionsData>) {
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
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Featured Promotions"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Featured Promotion IDs</label>
        <p className="text-xs text-gray-400 mt-1 mb-2">Add promotion IDs to feature</p>
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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showAllPromos"
          checked={data.showAll}
          onChange={(e) => update({ showAll: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="showAllPromos" className="text-sm font-medium text-[#23212a]">
          Show all promotions (ignore featured list)
        </label>
      </div>
    </div>
  );
}
