'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type Member = {
  id: string;
  name: string;
  role: string;
  avatar: { mediaId?: string | null; src: string; alt: string; title?: string | null };
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
};

type ExpertsData = {
  eyebrow: string;
  title: string;
  members: Member[];
};

type Props = {
  data: ExpertsData;
  onChange: (data: ExpertsData) => void;
};

export function AboutExpertsSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<ExpertsData>) {
    onChange({ ...data, ...patch });
  }

  function updateMember(index: number, patch: Partial<Member>) {
    const members = [...data.members];
    members[index] = { ...members[index], ...patch };
    update({ members });
  }

  function updateSocials(index: number, socialPatch: Partial<NonNullable<Member['socials']>>) {
    const members = [...data.members];
    const socials = members[index].socials || {};
    members[index] = {
      ...members[index],
      socials: { ...socials, ...socialPatch },
    };
    update({ members });
  }

  function addMember() {
    update({
      members: [
        ...data.members,
        {
          id: crypto.randomUUID(),
          name: '',
          role: '',
          avatar: { src: '', alt: '' },
          socials: { instagram: '', facebook: '', tiktok: '' },
        },
      ],
    });
  }

  function removeMember(index: number) {
    update({ members: data.members.filter((_, i) => i !== index) });
  }

  function moveMember(index: number, direction: 'up' | 'down') {
    const members = [...data.members];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < members.length) {
      const temp = members[index];
      members[index] = members[targetIndex];
      members[targetIndex] = temp;
      update({ members });
    }
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
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Team Members</label>
        {data.members.map((member, i) => (
          <div key={member.id} className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Member {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveMember(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveMember(i, 'down')}
                  disabled={i === data.members.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Name</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(i, { name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Role</label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => updateMember(i, { role: e.target.value })}
                  placeholder="e.g. Master Nail Technician"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <MediaPickerField
              label="Avatar Image"
              value={member.avatar ?? null}
              alt={member.avatar?.alt ?? ''}
              onChange={(avatar) => updateMember(i, { avatar: avatar ?? { mediaId: null, src: '', alt: '' } })}
              onAltChange={(alt) => updateMember(i, { avatar: { ...member.avatar, alt } })}
              folder="team"
            />

            <div className="bg-white p-3 rounded-lg border border-gray-150 space-y-3">
              <span className="block text-xs font-semibold text-gray-500">Social Media Links (Optional)</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={member.socials?.instagram ?? ''}
                    onChange={(e) => updateSocials(i, { instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={member.socials?.facebook ?? ''}
                    onChange={(e) => updateSocials(i, { facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">TikTok URL</label>
                  <input
                    type="text"
                    value={member.socials?.tiktok ?? ''}
                    onChange={(e) => updateSocials(i, { tiktok: e.target.value })}
                    placeholder="https://tiktok.com/..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addMember}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition animate-fade-in"
      >
        <Plus size={16} /> Add Team Member
      </button>
    </div>
  );
}
