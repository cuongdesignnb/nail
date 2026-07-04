'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';

type NavItem = { id: string; label: string; href: string };
type HeaderNavData = {
  items: NavItem[];
  cta: { label: string; href: string };
};

type Props = { data: HeaderNavData; onChange: (data: HeaderNavData) => void };

export function GlobalHeaderNavSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<HeaderNavData>) {
    onChange({ ...data, ...patch });
  }

  function updateItem(index: number, patch: Partial<NavItem>) {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    update({ items });
  }

  function addItem() {
    update({ items: [...data.items, { id: crypto.randomUUID(), label: '', href: '' }] });
  }

  function removeItem(index: number) {
    update({ items: data.items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Navigation Items</label>
        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                  <GripVertical size={14} className="text-gray-400" />
                  Item {i + 1}
                </div>
                <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#23212a] mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateItem(i, { label: e.target.value })}
                    placeholder="Services"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#23212a] mb-1">Link (href)</label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateItem(i, { href: e.target.value })}
                    placeholder="/services"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
        >
          <Plus size={16} /> Add Nav Item
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">CTA Button</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Label</label>
            <input
              type="text"
              value={data.cta?.label ?? ''}
              onChange={(e) => update({ cta: { ...data.cta, label: e.target.value } })}
              placeholder="Book Now"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Link (href)</label>
            <input
              type="text"
              value={data.cta?.href ?? ''}
              onChange={(e) => update({ cta: { ...data.cta, href: e.target.value } })}
              placeholder="/booking"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
