'use client';

import { SectionEntityPicker } from '../fields/SectionEntityPicker';
import { SectionEntitySorter } from '../fields/SectionEntitySorter';

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

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-1">Eyebrow</label>
        <input
          type="text"
          value={data.eyebrow || ''}
          onChange={(e) => update({ eyebrow: e.target.value })}
          placeholder="Our Packages"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:border-aera-accent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-1">Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:border-aera-accent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-1">Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:border-aera-accent transition min-h-[100px]"
        />
      </div>

      <div className="border-t border-neutral-200/60 pt-4 space-y-4">
        <SectionEntityPicker
          label="Featured Packages"
          entityType="package"
          selectedIds={data.featuredPackageIds || []}
          onChange={(ids) => update({ featuredPackageIds: ids })}
          description="Select which packages to showcase on the homepage"
        />

        <SectionEntitySorter
          label="Reorder Featured Packages"
          entityType="package"
          selectedIds={data.featuredPackageIds || []}
          onChange={(ids) => update({ featuredPackageIds: ids })}
          description="Drag or click arrows to order them as they will appear"
        />
      </div>
    </div>
  );
}

