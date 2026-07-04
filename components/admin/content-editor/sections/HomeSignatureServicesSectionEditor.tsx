'use client';

import { Plus, Trash2 } from 'lucide-react';

type SignatureServicesData = {
  eyebrow: string;
  title: string;
  description: string;
  featuredServiceIds: string[];
  showViewAll: boolean;
};

type Props = { data: SignatureServicesData; onChange: (data: SignatureServicesData) => void };

export function HomeSignatureServicesSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<SignatureServicesData>) {
    onChange({ ...data, ...patch });
  }

  function addServiceId() {
    update({ featuredServiceIds: [...data.featuredServiceIds, ''] });
  }

  function updateServiceId(index: number, value: string) {
    const ids = [...data.featuredServiceIds];
    ids[index] = value;
    update({ featuredServiceIds: ids });
  }

  function removeServiceId(index: number) {
    update({ featuredServiceIds: data.featuredServiceIds.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
        <input
          type="text"
          value={data.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
          placeholder="Our Services"
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

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Featured Service IDs</label>
        <p className="text-xs text-gray-400 mt-1 mb-2">Add service IDs to feature on the homepage</p>
        <div className="space-y-2">
          {data.featuredServiceIds.map((id, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => updateServiceId(i, e.target.value)}
                placeholder="service-id"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <button onClick={() => removeServiceId(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addServiceId}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
        >
          <Plus size={16} /> Add Service ID
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showViewAll"
          checked={data.showViewAll}
          onChange={(e) => update({ showViewAll: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="showViewAll" className="text-sm font-medium text-[#23212a]">
          Show &quot;View All&quot; link
        </label>
      </div>
    </div>
  );
}
