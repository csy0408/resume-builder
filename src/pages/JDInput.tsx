import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJD, matchJD } from '../services/claude';
import { useProfileStore } from '../store/profileStore';
import type { JdAnalysis, MatchResult } from '../types/jd';

export default function JDInput() {
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const [jdText, setJdText] = useState('');
  const [jdResult, setJdResult] = useState<JdAnalysis | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!jdText.trim()) { setError('请输入 JD 内容'); return; }
    setLoading('parse'); setError(''); setMatchResult(null);
    try {
      const r = await parseJD(jdText);
      setJdResult(r);
    } catch (e) { setError((e as Error).message); }
    setLoading('');
  };

  const handleMatch = async () => {
    if (!jdResult) return;
    setLoading('match'); setError('');
    try {
      const profileForMatch = {
        basic: profile.basic,
        education: profile.education,
        experiences: profile.experiences.map(e => ({
          id: e.id, projectName: e.projectName, role: e.role,
          techStack: e.techStack, baseDescription: e.baseDescription,
          variants: e.variants.map(v => ({ id: v.id, label: v.label, keywords: v.keywords })),
        })),
        skills: profile.skills,
      };
      const r = await matchJD(profileForMatch, jdResult);
      setMatchResult(r);
    } catch (e) { setError((e as Error).message); }
    setLoading('');
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">JD 智能匹配</h2>
      <p className="text-sm text-gray-400 mb-6">粘贴岗位 JD → AI 解析需求 → 匹配你的经历 → 生成定制简历</p>

      {/* JD Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={8}
          placeholder="在此粘贴岗位 JD（职位描述）全文..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
        />
        <button
          onClick={handleParse}
          disabled={loading === 'parse' || !jdText.trim()}
          className="mt-3 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading === 'parse' ? '解析中...' : '🔍 解析 JD'}
        </button>
        {error && <div className="mt-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-500">{error}</div>}
      </div>

      {/* JD Result */}
      {jdResult && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-3">JD 分析结果</h3>
          <p className="text-sm font-medium">{jdResult.title}{jdResult.company ? ` — ${jdResult.company}` : ''}</p>
          <p className="text-xs text-gray-500 mt-1">{jdResult.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {jdResult.techStack.map(t => (
              <span key={t} className="text-xs px-2 py-1 bg-[var(--color-bg)] rounded text-gray-700">{t}</span>
            ))}
          </div>
          <div className="mt-3 space-y-1">
            {jdResult.requirements.filter(r => r.importance === 'required').map((r, i) => (
              <div key={i} className="text-sm flex items-center gap-2">
                <span className="text-red-400">●</span> {r.keyword}
                {r.yearsRequired && <span className="text-xs text-gray-400">{r.yearsRequired}年+</span>}
              </div>
            ))}
            {jdResult.requirements.filter(r => r.importance === 'preferred').map((r, i) => (
              <div key={i} className="text-sm flex items-center gap-2">
                <span className="text-yellow-400">○</span> {r.keyword}
              </div>
            ))}
          </div>
          <button
            onClick={handleMatch}
            disabled={loading === 'match'}
            className="mt-4 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading === 'match' ? '匹配中...' : '🎯 开始匹配'}
          </button>
        </div>
      )}

      {/* Match Result */}
      {matchResult && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-4">匹配结果</h3>

          {/* Score */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center" style={{ borderColor: matchResult.score >= 60 ? '#27AE60' : '#E67E22' }}>
              <span className="text-2xl font-bold" style={{ color: matchResult.score >= 60 ? '#27AE60' : '#E67E22' }}>{matchResult.score}</span>
            </div>
            <div>
              <p className="font-bold text-lg">匹配度 {matchResult.score}%</p>
              <p className="text-sm text-gray-400">匹配 {matchResult.selectedExperiences.length} 段经历</p>
            </div>
          </div>

          {/* Matched Experiences */}
          <div className="mb-4">
            <h4 className="font-bold text-sm text-gray-500 mb-2">推荐使用的经历</h4>
            {matchResult.selectedExperiences.map((se) => {
              const exp = profile.experiences.find(e => e.id === se.experienceId);
              const variant = se.variantId ? exp?.variants.find(v => v.id === se.variantId) : null;
              return exp ? (
                <div key={se.experienceId} className="flex items-center justify-between py-2 border-b border-gray-50 text-sm">
                  <span>{exp.projectName}</span>
                  <div className="flex items-center gap-3">
                    {variant && <span className="text-xs text-[var(--color-primary)]">变体: {variant.label}</span>}
                    <span className="text-xs text-gray-400">相关度 {Math.round(se.relevance * 100)}%</span>
                  </div>
                </div>
              ) : null;
            })}
          </div>

          {/* Gaps */}
          {matchResult.gaps.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-sm text-orange-500 mb-2">待补充（差距分析）</h4>
              {matchResult.gaps.map((g, i) => (
                <div key={i} className="mb-2 text-sm">
                  <span className="text-orange-500 font-medium">{g.keyword}</span>
                  {g.suggestion && <span className="text-gray-500 ml-2">— {g.suggestion}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {matchResult.suggestions.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-gray-500 mb-2">优化建议</h4>
              {matchResult.suggestions.map((s, i) => (
                <p key={i} className="text-sm text-gray-600 mb-1">{i + 1}. {s}</p>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/editor')}
            className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
          >
            去编辑器生成简历 →
          </button>
        </div>
      )}
    </div>
  );
}
