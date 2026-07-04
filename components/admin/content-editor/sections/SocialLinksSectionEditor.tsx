'use client';

type SocialLinksData = {
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
};

type Props = { data: SocialLinksData; onChange: (data: SocialLinksData) => void };

export function SocialLinksSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<SocialLinksData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Instagram URL</label>
        <input
          type="text"
          value={data.instagramUrl}
          onChange={(e) => update({ instagramUrl: e.target.value })}
          placeholder="https://instagram.com/aeranaillounge"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Facebook URL</label>
        <input
          type="text"
          value={data.facebookUrl}
          onChange={(e) => update({ facebookUrl: e.target.value })}
          placeholder="https://facebook.com/aeranaillounge"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">TikTok URL</label>
        <input
          type="text"
          value={data.tiktokUrl}
          onChange={(e) => update({ tiktokUrl: e.target.value })}
          placeholder="https://tiktok.com/@aeranaillounge"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>
    </div>
  );
}
