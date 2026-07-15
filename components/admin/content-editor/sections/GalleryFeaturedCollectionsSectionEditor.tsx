'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type CollectionItem = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  imageAlt?: string;
  designCount: number;
};

type Props = {
  data: CollectionItem[];
  onChange: (data: CollectionItem[]) => void;
};

export function GalleryFeaturedCollectionsSectionEditor({ data = [], onChange }: Props) {
  function update(newData: CollectionItem[]) {
    onChange(newData);
  }

  function updateCollection(index: number, patch: Partial<CollectionItem>) {
    const items = [...data];
    items[index] = { ...items[index], ...patch };
    update(items);
  }

  function addCollection() {
    update([
      ...data,
      {
        id: crypto.randomUUID(),
        title: '',
        slug: '',
        description: '',
        image: '',
        imageAlt: '',
        designCount: 0,
      },
    ]);
  }

  function removeCollection(index: number) {
    update(data.filter((_, i) => i !== index));
  }

  function moveCollection(index: number, direction: 'up' | 'down') {
    const items = [...data];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < items.length) {
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      update(items);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((collection, i) => (
          <div key={collection.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Collection {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveCollection(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveCollection(i, 'down')}
                  disabled={i === data.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeCollection(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Collection Title</label>
                <input
                  type="text"
                  value={collection.title}
                  onChange={(e) => updateCollection(i, { title: e.target.value })}
                  placeholder="e.g. Bridal Elegance"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Slug</label>
                <input
                  type="text"
                  value={collection.slug}
                  onChange={(e) => updateCollection(i, { slug: e.target.value })}
                  placeholder="e.g. bridal-elegance"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Design Count</label>
                <input
                  type="number"
                  min={0}
                  value={collection.designCount}
                  onChange={(e) => updateCollection(i, { designCount: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Description (Optional)</label>
              <textarea
                value={collection.description ?? ''}
                onChange={(e) => updateCollection(i, { description: e.target.value })}
                placeholder="Brief description for this collection..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[60px]"
              />
            </div>

            <MediaPickerField
              valueMode="url"
              label="Collection Image"
              value={collection.image}
              alt={collection.imageAlt ?? ''}
              onChange={(src) => updateCollection(i, { image: src || "" })}
              onAltChange={(alt) => updateCollection(i, { imageAlt: alt })}
              folder="gallery"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCollection}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Collection
      </button>
    </div>
  );
}
