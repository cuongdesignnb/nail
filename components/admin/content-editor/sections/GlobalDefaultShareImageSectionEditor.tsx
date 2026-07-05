'use client';

import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type DefaultShareImage = {
  mediaId?: string | null;
  src: string;
  alt: string;
  title?: string | null;
};

type Props = {
  data: DefaultShareImage;
  onChange: (data: DefaultShareImage) => void;
};

export function GlobalDefaultShareImageSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<DefaultShareImage>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
        <label className="block text-sm font-semibold text-[#23212a] mb-2">Default Social Share Image (OG Image)</label>
        <p className="text-xs text-gray-500 mb-2">
          This image will be displayed on social media platforms when links to your website are shared, if a specific page image is not provided. Recommended size is 1200x630 pixels.
        </p>
        <MediaPickerField
          label="Default Share Image"
          value={data ?? null}
          alt={data.alt ?? ''}
          onChange={(image) => onChange(image ?? { mediaId: null, src: '', alt: '' })}
          onAltChange={(alt) => update({ alt })}
          folder="brand"
        />
      </div>
    </div>
  );
}
