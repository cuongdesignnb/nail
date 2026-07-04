'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';

type TestimonialItem = {
  id: string;
  name: string;
  role?: string;
  avatar?: { src: string; alt: string };
  rating: number;
  quote: string;
};

type TestimonialsData = {
  eyebrow: string;
  title: string;
  items: TestimonialItem[];
};

type Props = { data: TestimonialsData; onChange: (data: TestimonialsData) => void };

export function TestimonialsSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<TestimonialsData>) {
    onChange({ ...data, ...patch });
  }

  function updateItem(index: number, patch: Partial<TestimonialItem>) {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    update({ items });
  }

  function addItem() {
    update({
      items: [...data.items, { id: crypto.randomUUID(), name: '', role: '', rating: 5, quote: '' }],
    });
  }

  function removeItem(index: number) {
    update({ items: data.items.filter((_, i) => i !== index) });
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
            placeholder="What Our Clients Say"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Client Testimonials"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div className="space-y-3">
        {data.items.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Testimonial {i + 1}
              </div>
              <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#23212a] mb-1">Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(i, { name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#23212a] mb-1">Role</label>
                <input
                  type="text"
                  value={item.role ?? ''}
                  onChange={(e) => updateItem(i, { role: e.target.value })}
                  placeholder="Regular Client"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#23212a] mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={item.avatar?.src ?? ''}
                  onChange={(e) => updateItem(i, { avatar: { src: e.target.value, alt: item.avatar?.alt ?? item.name } })}
                  placeholder="/images/avatar.jpg"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#23212a] mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={item.rating}
                  onChange={(e) => updateItem(i, { rating: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#23212a] mb-1">Quote</label>
              <textarea
                value={item.quote}
                onChange={(e) => updateItem(i, { quote: e.target.value })}
                placeholder="What the client said..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Testimonial
      </button>
    </div>
  );
}
