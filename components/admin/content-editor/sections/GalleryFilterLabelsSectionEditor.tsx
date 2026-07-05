'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

type TagItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type Props = {
  data: TagItem[];
  onChange: (data: TagItem[]) => void;
};

export function GalleryFilterLabelsSectionEditor({ data = [], onChange }: Props) {
  function update(newData: TagItem[]) {
    onChange(newData);
  }

  function updateTag(index: number, patch: Partial<TagItem>) {
    const items = [...data];
    items[index] = { ...items[index], ...patch };
    update(items);
  }

  function addTag() {
    update([
      ...data,
      {
        id: crypto.randomUUID(),
        name: '',
        slug: '',
        description: '',
      },
    ]);
  }

  function removeTag(index: number) {
    update(data.filter((_, i) => i !== index));
  }

  function moveTag(index: number, direction: 'up' | 'down') {
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
      <div className="space-y-3">
        {data.map((tag, i) => (
          <div key={tag.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Tag {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveTag(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveTag(i, 'down')}
                  disabled={i === data.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Tag Name</label>
                <input
                  type="text"
                  value={tag.name}
                  onChange={(e) => updateTag(i, { name: e.target.value })}
                  placeholder="e.g. Acrylic Art"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Slug</label>
                <input
                  type="text"
                  value={tag.slug}
                  onChange={(e) => updateTag(i, { slug: e.target.value })}
                  placeholder="e.g. acrylic-art"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Description (Optional)</label>
              <textarea
                value={tag.description ?? ''}
                onChange={(e) => updateTag(i, { description: e.target.value })}
                placeholder="Brief description for this label..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addTag}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Filter Label
      </button>
    </div>
  );
}
