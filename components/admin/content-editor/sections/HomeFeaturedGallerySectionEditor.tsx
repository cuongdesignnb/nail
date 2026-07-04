'use client';

import { Plus, Trash2 } from 'lucide-react';

type FeaturedGalleryData = {
  eyebrow: string;
  title: string;
  featuredItemIds: string[];
  showViewAll: boolean;
};

type Props = { data: FeaturedGalleryData; onChange: (data: FeaturedGalleryData) => void };

export function HomeFeaturedGallerySectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<FeaturedGalleryData>) {
    onChange({ ...data, ...patch });
  }

  function addItemId() {
    update({ featuredItemIds: [...data.featuredItemIds, ''] });
  }

  function updateItemId(index: number, value: string) {
    const ids = [...data.featuredItemIds];
    ids[index] = value;
    update({ featuredItemIds: ids });
  }

  function removeItemId(index: number) {
    update({ featuredItemIds: data.featuredItemIds.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
          <input
            type="text"
            value={data.eyebrow}
            onChange={(e) => update({ eyebrow: e.target.value })}
            placeholder="Our Work"
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
        <label className="block text-sm font-medium text-[#23212a] mb-1">Featured Gallery Item IDs</label>
        <p className="text-xs text-gray-400 mt-1 mb-2">Add gallery item IDs to feature</p>
        <div className="space-y-2">
          {data.featuredItemIds.map((id, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => updateItemId(i, e.target.value)}
                placeholder="gallery-item-id"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <button onClick={() => removeItemId(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItemId}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
        >
          <Plus size={16} /> Add Item ID
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="galleryShowViewAll"
          checked={data.showViewAll}
          onChange={(e) => update({ showViewAll: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="galleryShowViewAll" className="text-sm font-medium text-[#23212a]">
          Show &quot;View All&quot; link
        </label>
      </div>
    </div>
  );
}
