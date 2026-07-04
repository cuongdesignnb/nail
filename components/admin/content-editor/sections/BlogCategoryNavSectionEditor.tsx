'use client';

type CategoryNavData = {
  showCategoryNav: boolean;
  title: string;
};

type Props = { data: CategoryNavData; onChange: (data: CategoryNavData) => void };

export function BlogCategoryNavSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<CategoryNavData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showCategoryNav"
          checked={data.showCategoryNav}
          onChange={(e) => update({ showCategoryNav: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="showCategoryNav" className="text-sm font-medium text-[#23212a]">
          Show Category Navigation
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Browse by Category"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
        <p className="text-xs text-gray-400 mt-1">Categories are loaded from blog posts automatically</p>
      </div>
    </div>
  );
}
