'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { asArray, isRecord } from '@/lib/utils/array';

type StepItem = { id: string; step: string; icon: string; title: string; description: string };
type StepsData = { eyebrow: string; title: string; steps: StepItem[] };
type Props = { data: StepsData; onChange: (data: StepsData) => void };

export function ProcessStepsSectionEditor({ data, onChange }: Props) {
  const isArrayMode = Array.isArray(data);
  const safeData: StepsData = {
    eyebrow: isRecord(data) && typeof data.eyebrow === 'string' ? data.eyebrow : '',
    title: isRecord(data) && typeof data.title === 'string' ? data.title : '',
    steps: asArray<StepItem>(isArrayMode ? data : isRecord(data) ? data.steps : []).map((step, index) => ({
      id: typeof step.id === 'string' ? step.id : crypto.randomUUID(),
      step: typeof step.step === 'string' ? step.step : String(index + 1).padStart(2, '0'),
      icon: typeof step.icon === 'string' ? step.icon : '',
      title: typeof step.title === 'string' ? step.title : '',
      description: typeof step.description === 'string' ? step.description : '',
    })),
  };

  function emit(next: StepsData) {
    onChange((isArrayMode ? next.steps : next) as StepsData);
  }

  function update(patch: Partial<StepsData>) {
    emit({ ...safeData, ...patch });
  }

  function updateStep(index: number, patch: Partial<StepItem>) {
    const steps = [...safeData.steps];
    steps[index] = { ...steps[index], ...patch };
    update({ steps });
  }

  function addStep() {
    update({
      steps: [...safeData.steps, { id: crypto.randomUUID(), step: '', icon: '', title: '', description: '' }],
    });
  }

  function removeStep(index: number) {
    update({ steps: safeData.steps.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isArrayMode && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
              <input
                type="text"
                value={safeData.eyebrow}
                onChange={(e) => update({ eyebrow: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
              <input
                type="text"
                value={safeData.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-3">
        {safeData.steps.map((step, i) => (
          <div key={step.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Step {i + 1}
              </div>
              <button onClick={() => removeStep(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#23212a] mb-1">Step Label</label>
                <input
                  type="text"
                  value={step.step}
                  onChange={(e) => updateStep(i, { step: e.target.value })}
                  placeholder="01"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#23212a] mb-1">Icon</label>
                <input
                  type="text"
                  value={step.icon}
                  onChange={(e) => updateStep(i, { icon: e.target.value })}
                  placeholder="Calendar"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
                <p className="text-xs text-gray-400 mt-1">Lucide icon name</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(i, { title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
              <textarea
                value={step.description}
                onChange={(e) => updateStep(i, { description: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addStep}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Step
      </button>
    </div>
  );
}
