'use client';

import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type BrandData = {
  name: string;
  logo: { mediaId?: string | null; src: string; alt: string; title?: string | null };
  tagline: string;
};

type Props = { data: BrandData; onChange: (data: BrandData) => void };

export function GlobalBrandSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<BrandData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Brand Name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Aera Nail Lounge"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">Logo</p>
        <MediaPickerField
          valueMode="reference"
          label="Logo"
          value={data.logo ?? null}
          onChange={(logo) => update({ logo: logo ?? { mediaId: null, src: '', alt: 'Aera Nail Lounge logo' } })}
          folder="branding"
          aspectRatio="1/1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Tagline</label>
        <input
          type="text"
          value={data.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          placeholder="Luxury Nail Care Experience"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>
    </div>
  );
}
