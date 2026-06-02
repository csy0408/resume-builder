import type { TemplateRendererProps } from '../../types/resume';

export default function ClassicTemplate({ content, config }: TemplateRendererProps) {
  return (
    <div className="max-w-[800px] mx-auto bg-white p-10" style={{ fontFamily: 'Georgia, serif', color: config.colors.text }}>
      <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: config.colors.primary }}>
        <h1 className="text-3xl font-bold" style={{ color: config.colors.primary }}>{content.basic.name || '姓名'}</h1>
        <p className="text-sm mt-2 space-x-4" style={{ color: '#666' }}>
          {[content.basic.phone, content.basic.email, content.basic.location].filter(Boolean).join('  |  ')}
        </p>
        {[content.basic.github, content.basic.website].filter(Boolean).length > 0 && (
          <p className="text-xs mt-1 space-x-4" style={{ color: '#999' }}>
            {[content.basic.github, content.basic.website].filter(Boolean).join('  |  ')}
          </p>
        )}
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: config.colors.primary }}>经历</h2>
        {content.experiences.map((exp, i) => (
          <div key={i} className="mb-5">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-base">{exp.projectName}</h3>
              <span className="text-sm" style={{ color: '#999' }}>{exp.role} · {exp.date}</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {exp.techStack.map((t) => (
                <span key={t} className="text-xs italic" style={{ color: '#999' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {content.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: config.colors.primary }}>教育</h2>
          {content.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <span className="font-bold">{edu.school}</span> · {edu.major} · {edu.degree} · {edu.date}
            </div>
          ))}
        </section>
      )}

      {content.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: config.colors.primary }}>技能</h2>
          <div className="flex gap-2 flex-wrap">
            {content.skills.map((s) => (
              <span key={s} className="px-3 py-1 bg-gray-100 rounded text-sm">{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
