'use client';

type TrendingStoriesData = {
  sectionTitle: string;
};

type Props = { data: TrendingStoriesData; onChange: (data: TrendingStoriesData) => void };

export function BlogTrendingStoriesSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<TrendingStoriesData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Section Title</label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => update({ sectionTitle: e.target.value })}
          placeholder="Trending Stories"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
        <p className="text-xs text-gray-400 mt-1">Trending posts are calculated automatically — this controls the section heading</p>
      </div>
    </div>
  );
}
