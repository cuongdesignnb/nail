'use client';

import { Plus, Trash2 } from 'lucide-react';

type PackagesPreviewData = {
  eyebrow: string;
  title: string;
  description: string;
  featuredPackageIds: string[];
};

type Props = { data: PackagesPreviewData; onChange: (data: PackagesPreviewData) => void };

export function HomePackagesPreviewSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<PackagesPreviewData>) {
    onChange({ ...data, ...patch });
  }

  function addPackageId() {
    update({ featuredPackageIds: [...data.featuredPackageIds, ''] });
  }

  function updatePackageId(index: number, value: string) {
    const ids = [...data.featuredPackageIds];
    ids[index] = value;
    update({ featuredPackageIds: ids });
  }

  function removePackageId(index: number) {
    update({ featuredPackageIds: data.featuredPackageIds.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
        <input
          type="text"
          value={data.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
          placeholder="Our Packages"
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
        <label className="block text-sm font-medium text-[#23212a] mb-1">Featured Package IDs</label>
        <p className="text-xs text-gray-400 mt-1 mb-2">Add package IDs to feature on the homepage</p>
        <div className="space-y-2">
          {data.featuredPackageIds.map((id, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => updatePackageId(i, e.target.value)}
                placeholder="package-id"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <button onClick={() => removePackageId(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addPackageId}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
        >
          <Plus size={16} /> Add Package ID
        </button>
      </div>
    </div>
  );
}
