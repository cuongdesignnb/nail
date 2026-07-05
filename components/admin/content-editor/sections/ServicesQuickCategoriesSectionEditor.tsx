'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { asArray } from '@/lib/utils/array';

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
};

type Props = {
  data: Category[];
  onChange: (data: Category[]) => void;
};

export function ServicesQuickCategoriesSectionEditor({ data = [], onChange }: Props) {
  const items = asArray<Category>(data);

  function update(newData: Category[]) {
    onChange(newData);
  }

  function updateItem(index: number, patch: Partial<Category>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    update(next);
  }

  function addItem() {
    update([
      ...items,
      {
        id: crypto.randomUUID(),
        name: '',
        slug: '',
        description: '',
        icon: '',
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
      <div className="space-y-3">
        {items.map((category, i) => (
          <div key={category.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Category {i + 1}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Name</label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateItem(i, { name: e.target.value })}
                  placeholder="e.g. Manicures"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Slug</label>
                <input
                  type="text"
                  value={category.slug}
                  onChange={(e) => updateItem(i, { slug: e.target.value })}
                  placeholder="e.g. manicures"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Icon (Optional)</label>
                <input
                  type="text"
                  value={category.icon ?? ''}
                  onChange={(e) => updateItem(i, { icon: e.target.value })}
                  placeholder="e.g. spark"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Description (Optional)</label>
              <textarea
                value={category.description ?? ''}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                placeholder="Brief category description..."
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
        <Plus size={16} /> Add Category
      </button>
    </div>
  );
}
