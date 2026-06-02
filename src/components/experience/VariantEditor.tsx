import { useState } from 'react';
import { useProfileStore } from '../../store/profileStore';
import TagInput from '../common/TagInput';
import type { Experience } from '../../types/profile';
import AiVariantGenerator from './AiVariantGenerator';

interface VariantEditorProps {
  experience: Experience;
}

export default function VariantEditor({ experience }: VariantEditorProps) {
  const { addVariant, removeVariant } = useProfileStore();
  const [showForm, setShowForm] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAdd = () => {
    if (!label.trim()) return;
    addVariant(experience.id, {
      id: '',
      label: label.trim(),
      description: description.trim(),
      keywords,
      language: 'zh',
    });
    setLabel('');
    setDescription('');
    setKeywords([]);
    setShowForm(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-bold text-gray-600">经历变体（同一经历，不同侧重点）</h5>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs text-[var(--color-primary)] hover:underline"
          >
            + 添加变体
          </button>
          <button onClick={() => setShowAiGenerator(true)} className="text-xs text-[var(--color-primary)] hover:underline">
            🤖 AI 生成
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[var(--color-bg)] rounded-lg p-4 mb-3 space-y-3">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="变体标签（如：前端、算法、嵌入式）"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="该变体的描述，匹配相关岗位时使用..."
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none resize-none"
          />
          <TagInput tags={keywords} onChange={setKeywords} placeholder="关键词（回车添加）" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs rounded">
              确认添加
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-gray-500">
              取消
            </button>
          </div>
        </div>
      )}

      {experience.variants.map((v) => (
        <div key={v.id} className="flex items-start justify-between bg-[var(--color-bg)] rounded-lg p-3 mb-2">
          <div className="flex-1">
            <span className="text-xs font-bold text-[var(--color-primary)]">{v.label}</span>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{v.description}</p>
            {v.keywords.length > 0 && (
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {v.keywords.map((k) => (
                  <span key={k} className="text-[10px] px-1.5 py-0.5 bg-white rounded text-gray-500">{k}</span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => removeVariant(experience.id, v.id)}
            className="text-xs text-gray-400 hover:text-red-500 ml-3 mt-1"
          >
            ×
          </button>
        </div>
      ))}

      {showAiGenerator && (
        <AiVariantGenerator experience={experience} onClose={() => setShowAiGenerator(false)} />
      )}
    </div>
  );
}
