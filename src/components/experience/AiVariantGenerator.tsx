import { useState } from 'react';
import { generateVariants } from '../../services/claude';
import { useProfileStore } from '../../store/profileStore';
import type { Experience } from '../../types/profile';

interface Props {
  experience: Experience;
  onClose: () => void;
}

export default function AiVariantGenerator({ experience, onClose }: Props) {
  const { addVariant } = useProfileStore();
  const [roles, setRoles] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<{ label: string; description: string; keywords: string[] }[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    const roleList = roles.split(/[,，\s]+/).filter(Boolean);
    if (roleList.length === 0) { setError('请输入至少一个岗位方向'); return; }
    setLoading(true); setError('');
    try {
      const result = await generateVariants({
        projectName: experience.projectName,
        role: experience.role,
        baseDescription: experience.baseDescription,
        techStack: experience.techStack,
      }, roleList);
      setGenerated(result);
      setChecked(new Set(result.map((_, i) => i)));
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  };

  const toggleCheck = (i: number) => {
    setChecked(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; });
  };

  const handleImport = () => {
    generated.forEach((v, i) => {
      if (checked.has(i)) {
        addVariant(experience.id, { id: '', label: v.label, description: v.description, keywords: v.keywords, language: 'zh' });
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--color-primary-dark)]">AI 生成变体</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">为「{experience.projectName}」生成不同岗位侧重点的描述变体</p>

        <label className="block text-sm text-gray-500 mb-1">目标岗位方向（用逗号分隔）</label>
        <input
          type="text"
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
          placeholder="如：前端开发, 后端开发, 算法工程师"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] mb-3"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50 mb-4"
        >
          {loading ? 'AI 生成中...' : '🤖 生成变体'}
        </button>

        {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-500">{error}</div>}

        {generated.length > 0 && (
          <div>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {generated.map((v, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={checked.has(i)} onChange={() => toggleCheck(i)} className="mt-0.5 accent-[var(--color-primary)]" />
                    <div>
                      <span className="text-sm font-bold text-[var(--color-primary)]">{v.label}</span>
                      <p className="text-xs text-gray-600 mt-1">{v.description}</p>
                      <div className="flex gap-1 mt-1.5">
                        {v.keywords.map(k => <span key={k} className="text-[10px] px-1.5 py-0.5 bg-[var(--color-bg)] rounded text-gray-500">{k}</span>)}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <button onClick={handleImport} className="w-full py-2.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">
              导入选中的变体 ({checked.size} 个)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
