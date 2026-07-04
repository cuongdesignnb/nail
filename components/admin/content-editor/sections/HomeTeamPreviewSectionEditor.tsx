'use client';

import { Plus, Trash2 } from 'lucide-react';

type TeamPreviewData = {
  eyebrow: string;
  title: string;
  featuredTechnicianIds: string[];
};

type Props = { data: TeamPreviewData; onChange: (data: TeamPreviewData) => void };

export function HomeTeamPreviewSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<TeamPreviewData>) {
    onChange({ ...data, ...patch });
  }

  function addTechId() {
    update({ featuredTechnicianIds: [...data.featuredTechnicianIds, ''] });
  }

  function updateTechId(index: number, value: string) {
    const ids = [...data.featuredTechnicianIds];
    ids[index] = value;
    update({ featuredTechnicianIds: ids });
  }

  function removeTechId(index: number) {
    update({ featuredTechnicianIds: data.featuredTechnicianIds.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
          <input
            type="text"
            value={data.eyebrow}
            onChange={(e) => update({ eyebrow: e.target.value })}
            placeholder="Our Team"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Meet Our Expert Technicians"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Featured Technician IDs</label>
        <p className="text-xs text-gray-400 mt-1 mb-2">Add technician IDs to feature on the homepage</p>
        <div className="space-y-2">
          {data.featuredTechnicianIds.map((id, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => updateTechId(i, e.target.value)}
                placeholder="technician-id"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <button onClick={() => removeTechId(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addTechId}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
        >
          <Plus size={16} /> Add Technician ID
        </button>
      </div>
    </div>
  );
}
