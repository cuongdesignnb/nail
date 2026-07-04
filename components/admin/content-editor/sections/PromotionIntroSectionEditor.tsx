'use client';

type PromotionIntroData = {
  eyebrow: string;
  title: string;
  description: string;
};

type Props = { data: PromotionIntroData; onChange: (data: PromotionIntroData) => void };

export function PromotionIntroSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<PromotionIntroData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
        <input
          type="text"
          value={data.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
          placeholder="Special Offers"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Current Promotions"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Introductory text for the promotions section"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>
    </div>
  );
}
