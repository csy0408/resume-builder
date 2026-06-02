import { useState, useMemo, useRef } from 'react';
import { exportPdf } from '../services/export-pdf';
import { useProfileStore } from '../store/profileStore';
import { TEMPLATES, getTemplateConfig } from '../templates';
import WritingAssistant from '../components/experience/WritingAssistant';
import ClassicTemplate from '../templates/classic/ClassicTemplate';
import ModernTemplate from '../templates/modern/ModernTemplate';
import HybridTemplate from '../templates/hybrid/HybridTemplate';
import type { ResumeContent, TemplateConfig, TemplateComponent } from '../types/resume';

const TEMPLATE_MAP: Record<string, TemplateComponent> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  hybrid: HybridTemplate,
};

function TemplateRenderer({
  templateId,
  content,
  config,
}: {
  templateId: string;
  content: ResumeContent;
  config: TemplateConfig;
}) {
  const Comp = TEMPLATE_MAP[templateId];
  if (!Comp) return <div>模板加载失败</div>;
  return <Comp content={content} config={config} />;
}

export default function Editor() {
  const { profile } = useProfileStore();
  const [templateId, setTemplateId] = useState('modern');
  const [selectedExps, setSelectedExps] = useState<Set<string>>(
    new Set(profile.experiences.map((e) => e.id)),
  );
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [writingTarget, setWritingTarget] = useState('');
  const [showWriting, setShowWriting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    await exportPdf(previewRef.current, 'resume.pdf');
  };

  const config = useMemo(() => getTemplateConfig(templateId), [templateId]);

  const toggleExp = (id: string) => {
    setSelectedExps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resumeContent: ResumeContent = useMemo(
    () => ({
      basic: profile.basic,
      education: profile.education.map((e) => ({
        school: e.school,
        major: e.major,
        degree: e.degree,
        date: `${e.startDate}${e.endDate ? ' - ' + e.endDate : ''}`,
      })),
      experiences: profile.experiences
        .filter((e) => selectedExps.has(e.id))
        .map((e) => {
          const variantId = selectedVariants[e.id];
          const variant = variantId ? e.variants.find((v) => v.id === variantId) : null;
          return {
            projectName: e.projectName,
            role: e.role,
            date: `${e.startDate}${e.endDate ? ' - ' + e.endDate : ''}`,
            description: variant?.description || e.baseDescription,
            techStack: e.techStack,
          };
        }),
      skills: profile.skills.map((s) => s.name),
    }),
    [profile, selectedExps, selectedVariants],
  );

  if (!config) return <div>模板加载失败</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)]">简历预览 & 编辑</h2>
        <div className="flex items-center gap-3">
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => { setWritingTarget(''); setShowWriting(true); }}
            className="px-3 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50"
          >
            写作助手
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90"
          >
            导出 PDF
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="w-[260px] flex-shrink-0 space-y-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 mb-3">选择经历</h3>
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="py-2 border-b border-gray-50 last:border-0">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedExps.has(exp.id)}
                    onChange={() => toggleExp(exp.id)}
                    className="mt-1 accent-[var(--color-primary)]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exp.projectName}</p>
                    {exp.variants.length > 0 && selectedExps.has(exp.id) && (
                      <select
                        value={selectedVariants[exp.id] || ''}
                        onChange={(e) =>
                          setSelectedVariants({ ...selectedVariants, [exp.id]: e.target.value })
                        }
                        className="mt-1 text-xs px-2 py-1 border border-gray-200 rounded w-full"
                      >
                        <option value="">基础描述</option>
                        {exp.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>
              </div>
            ))}
            {profile.experiences.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">暂无经历，请先录入</p>
            )}
          </div>
        </aside>

        <div ref={previewRef} className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="scale-[0.85] origin-top-left w-[118%]">
            <TemplateRenderer templateId={templateId} content={resumeContent} config={config} />
          </div>
        </div>
      </div>

      {showWriting && (
        <WritingAssistant
          initialText={writingTarget}
          onApply={(_newText) => {
            setShowWriting(false);
          }}
          onClose={() => setShowWriting(false)}
        />
      )}
    </div>
  );
}
