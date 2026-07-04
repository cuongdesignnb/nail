'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';

type ScheduleItem = { id: string; days: string; hours: string };
type OpeningHoursData = {
  title: string;
  schedule: ScheduleItem[];
};

type Props = { data: OpeningHoursData; onChange: (data: OpeningHoursData) => void };

export function OpeningHoursSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<OpeningHoursData>) {
    onChange({ ...data, ...patch });
  }

  function updateItem(index: number, patch: Partial<ScheduleItem>) {
    const schedule = [...data.schedule];
    schedule[index] = { ...schedule[index], ...patch };
    update({ schedule });
  }

  function addItem() {
    update({
      schedule: [...data.schedule, { id: crypto.randomUUID(), days: '', hours: '' }],
    });
  }

  function removeItem(index: number) {
    update({ schedule: data.schedule.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Opening Hours"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div className="space-y-3">
        {data.schedule.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <GripVertical size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={item.days}
                onChange={(e) => updateItem(i, { days: e.target.value })}
                placeholder="Monday - Friday"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <input
                type="text"
                value={item.hours}
                onChange={(e) => updateItem(i, { hours: e.target.value })}
                placeholder="9:00 AM - 7:00 PM"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
              <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 p-1 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Schedule Row
      </button>
    </div>
  );
}
