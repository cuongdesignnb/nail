'use client';

import { Plus, Trash2 } from 'lucide-react';

type EditorsPicksData = {
  sectionTitle: string;
  editorPickIds: string[];
};

type Props = { data: EditorsPicksData; onChange: (data: EditorsPicksData) => void };

export function BlogEditorsPicksSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<EditorsPicksData>) {
    onChange({ ...data, ...patch });
  }

  function addPickId() {
    update({ editorPickIds: [...data.editorPickIds, ''] });
  }

  function updatePickId(index: number, value: string) {
    const ids = [...data.editorPickIds];
    ids[index] = value;
    update({ editorPickIds: ids });
  }

  function removePickId(index: number) {
    update({ editorPickIds: data.editorPickIds.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Section Title</label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => update({ sectionTitle: e.target.value })}
          placeholder="Editor's Picks"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Editor Pick Post IDs</label>
        <p className="text-xs text-gray-400 mt-1 mb-2">Add blog post IDs for editor&apos;s picks</p>
        <div className="space-y-2">
          {data.editorPickIds.map((id, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => updatePickId(i, e.target.value)}
                placeholder="blog-post-id"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <button onClick={() => removePickId(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addPickId}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
        >
          <Plus size={16} /> Add Post ID
        </button>
      </div>
    </div>
  );
}
