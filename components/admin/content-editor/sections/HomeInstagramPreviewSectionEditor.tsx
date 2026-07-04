'use client';

type InstagramPreviewData = {
  eyebrow: string;
  title: string;
  instagramUrl: string;
  showSection: boolean;
};

type Props = { data: InstagramPreviewData; onChange: (data: InstagramPreviewData) => void };

export function HomeInstagramPreviewSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<InstagramPreviewData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showInstagram"
          checked={data.showSection}
          onChange={(e) => update({ showSection: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="showInstagram" className="text-sm font-medium text-[#23212a]">
          Show Instagram Section
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
          <input
            type="text"
            value={data.eyebrow}
            onChange={(e) => update({ eyebrow: e.target.value })}
            placeholder="Follow Us"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="@aeranaillounge"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Instagram URL</label>
        <input
          type="text"
          value={data.instagramUrl}
          onChange={(e) => update({ instagramUrl: e.target.value })}
          placeholder="https://instagram.com/aeranaillounge"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
        <p className="text-xs text-gray-400 mt-1">Full Instagram profile URL</p>
      </div>
    </div>
  );
}
