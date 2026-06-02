import { useState } from 'react';
import { polishText } from '../../services/claude';

type Mode = 'polish' | 'star' | 'shorter' | 'longer' | 'technical' | 'management';

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'polish', label: '润色优化', desc: '使描述更专业、更有影响力' },
  { key: 'star', label: 'STAR 法则', desc: '按 Situation-Task-Action-Result 重写' },
  { key: 'shorter', label: '精简', desc: '压缩到 2-3 句话' },
  { key: 'longer', label: '扩展', desc: '补充细节和量化成果' },
  { key: 'technical', label: '技术导向', desc: '强调技术选型和架构' },
  { key: 'management', label: '管理导向', desc: '强调团队领导和协调' },
];

interface Props {
  initialText: string;
  onApply: (text: string) => void;
  onClose: () => void;
}

export default function WritingAssistant({ initialText, onApply, onClose }: Props) {
  const [input, setInput] = useState(initialText);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('polish');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePolish = async () => {
    if (!input.trim()) { setError('请输入文本'); return; }
    setLoading(true); setError('');
    try {
      const result = await polishText(input, mode);
      setOutput(result);
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--color-primary-dark)]">AI 写作助手</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {/* Mode selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setOutput(''); }}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                mode === m.key
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={m.desc}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-3">{MODES.find(m => m.key === mode)?.desc}</p>

        {/* Input */}
        <label className="block text-sm text-gray-500 mb-1">原始文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none mb-3"
        />

        <button
          onClick={handlePolish}
          disabled={loading}
          className="w-full py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50 mb-4"
        >
          {loading ? 'AI 处理中...' : '✨ 开始优化'}
        </button>

        {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-500">{error}</div>}

        {/* Output */}
        {output && (
          <div>
            <label className="block text-sm text-gray-500 mb-1">优化结果</label>
            <div className="p-4 bg-[var(--color-bg)] rounded-lg text-sm whitespace-pre-wrap mb-3">{output}</div>
            <div className="flex gap-3">
              <button
                onClick={() => { onApply(output); onClose(); }}
                className="flex-1 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
              >
                应用并替换
              </button>
              <button
                onClick={() => setInput(output)}
                className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50"
              >
                继续编辑
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
