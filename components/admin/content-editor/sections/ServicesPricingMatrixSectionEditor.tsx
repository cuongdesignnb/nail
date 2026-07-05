'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { asArray, isRecord } from '@/lib/utils/array';

type PricingItem = {
  name: string;
  priceLabel: string;
};

type PricingCategory = {
  id: string;
  title: string;
  items: PricingItem[];
};

type PricingData = {
  categories: PricingCategory[];
};

type Props = {
  data: PricingData;
  onChange: (data: PricingData) => void;
};

export function ServicesPricingMatrixSectionEditor({ data, onChange }: Props) {
  const safeData: PricingData = {
    categories: asArray<PricingCategory>(
      isRecord(data) ? data.categories : []
    ).map((category) => ({
      ...category,
      items: asArray<PricingItem>(category.items),
    })),
  };

  function update(patch: Partial<PricingData>) {
    onChange({ ...safeData, ...patch });
  }

  // Categories
  function updateCategoryTitle(index: number, title: string) {
    const categories = [...safeData.categories];
    categories[index] = { ...categories[index], title };
    update({ categories });
  }

  function addCategory() {
    update({
      categories: [
        ...safeData.categories,
        { id: crypto.randomUUID(), title: '', items: [] },
      ],
    });
  }

  function removeCategory(index: number) {
    update({ categories: safeData.categories.filter((_, i) => i !== index) });
  }

  function moveCategory(index: number, direction: 'up' | 'down') {
    const categories = [...safeData.categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < categories.length) {
      const temp = categories[index];
      categories[index] = categories[targetIndex];
      categories[targetIndex] = temp;
      update({ categories });
    }
  }

  // Items within Category
  function updateItem(categoryIndex: number, itemIndex: number, patch: Partial<PricingItem>) {
    const categories = [...safeData.categories];
    const items = [...categories[categoryIndex].items];
    items[itemIndex] = { ...items[itemIndex], ...patch };
    categories[categoryIndex] = { ...categories[categoryIndex], items };
    update({ categories });
  }

  function addItem(categoryIndex: number) {
    const categories = [...safeData.categories];
    const items = [...categories[categoryIndex].items, { name: '', priceLabel: '' }];
    categories[categoryIndex] = { ...categories[categoryIndex], items };
    update({ categories });
  }

  function removeItem(categoryIndex: number, itemIndex: number) {
    const categories = [...safeData.categories];
    const items = categories[categoryIndex].items.filter((_, i) => i !== itemIndex);
    categories[categoryIndex] = { ...categories[categoryIndex], items };
    update({ categories });
  }

  function moveItem(categoryIndex: number, itemIndex: number, direction: 'up' | 'down') {
    const categories = [...safeData.categories];
    const items = [...categories[categoryIndex].items];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (targetIndex >= 0 && targetIndex < items.length) {
      const temp = items[itemIndex];
      items[itemIndex] = items[targetIndex];
      items[targetIndex] = temp;
      categories[categoryIndex] = { ...categories[categoryIndex], items };
      update({ categories });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-[#23212a]">Pricing Categories</label>
        {safeData.categories.map((category, catIdx) => (
          <div key={category.id} className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Category {catIdx + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveCategory(catIdx, 'up')}
                  disabled={catIdx === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(catIdx, 'down')}
                  disabled={catIdx === safeData.categories.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeCategory(catIdx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Category Title</label>
              <input
                type="text"
                value={category.title}
                onChange={(e) => updateCategoryTitle(catIdx, e.target.value)}
                placeholder="e.g. Nail Enhancements"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
            </div>

            {/* Nested Items */}
            <div className="bg-white p-4 rounded-lg border border-gray-150 space-y-3">
              <span className="block text-xs font-semibold text-gray-500">Pricing Items</span>
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex gap-2 items-center">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveItem(catIdx, itemIdx, 'up')}
                      disabled={itemIdx === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(catIdx, itemIdx, 'down')}
                      disabled={itemIdx === category.items.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(catIdx, itemIdx, { name: e.target.value })}
                      placeholder="Item Name (e.g. Acrylic Full Set)"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                    />
                    <input
                      type="text"
                      value={item.priceLabel}
                      onChange={(e) => updateItem(catIdx, itemIdx, { priceLabel: e.target.value })}
                      placeholder="Price Label (e.g. From $55)"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(catIdx, itemIdx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(catIdx)}
                className="flex items-center gap-1 text-xs font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
              >
                <Plus size={14} /> Add Pricing Item
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCategory}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Category
      </button>
    </div>
  );
}
