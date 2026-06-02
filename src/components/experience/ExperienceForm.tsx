import { useState, useEffect } from 'react';
import { useProfileStore } from '../../store/profileStore';
import TagInput from '../common/TagInput';
import type { Experience } from '../../types/profile';

interface ExperienceFormProps {
  experience?: Experience;
  onClose: () => void;
}

export default function ExperienceForm({ experience, onClose }: ExperienceFormProps) {
  const { addExperience, updateExperience } = useProfileStore();
  const isEdit = !!experience;

  const [form, setForm] = useState({
    projectName: '',
    role: '',
    startDate: '',
    endDate: '',
    techStack: [] as string[],
    baseDescription: '',
  });

  useEffect(() => {
    if (experience) {
      setForm({
        projectName: experience.projectName,
        role: experience.role,
        startDate: experience.startDate,
        endDate: experience.endDate || '',
        techStack: [...experience.techStack],
        baseDescription: experience.baseDescription,
      });
    }
  }, [experience]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName.trim()) return;

    if (isEdit) {
      updateExperience(experience!.id, { ...form, endDate: form.endDate || undefined });
    } else {
      addExperience({
        ...form,
        endDate: form.endDate || undefined,
        id: '',
        source: 'manual' as const,
        verified: true,
        variants: [],
      } as Experience);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">项目/公司名称 *</label>
          <input
            type="text"
            required
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="如：简历制作平台"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">角色</label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="如：前端开发"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">开始日期</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">结束日期（留空=至今）</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">技术栈</label>
        <TagInput tags={form.techStack} onChange={(tags) => setForm({ ...form, techStack: tags })} placeholder="输入后回车添加技术栈" />
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">基础描述</label>
        <textarea
          value={form.baseDescription}
          onChange={(e) => setForm({ ...form, baseDescription: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
          placeholder="描述你的职责和成果..."
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
          取消
        </button>
        <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90">
          {isEdit ? '保存' : '添加'}
        </button>
      </div>
    </form>
  );
}
