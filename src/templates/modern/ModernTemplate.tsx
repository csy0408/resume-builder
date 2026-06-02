import type { TemplateRendererProps } from '../../types/resume';

export default function ModernTemplate({ content, config }: TemplateRendererProps) {
  return (
    <div className="max-w-[800px] mx-auto flex bg-white" style={{ fontFamily: 'system-ui, sans-serif', color: config.colors.text }}>
      <aside className="w-[220px] p-6 flex-shrink-0" style={{ backgroundColor: config.colors.primary, color: '#fff' }}>
        {content.basic.photo && (
          <img src={content.basic.photo} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/30" />
        )}
        <h1 className="text-xl font-bold mb-4">{content.basic.name || '姓名'}</h1>
        <div className="space-y-2 text-sm text-white/80 mb-6">
          {content.basic.phone && <p>📱 {content.basic.phone}</p>}
          {content.basic.email && <p>✉️ {content.basic.email}</p>}
          {content.basic.location && <p>📍 {content.basic.location}</p>}
          {content.basic.github && <p>🔗 {content.basic.github}</p>}
        </div>
        {content.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-white/20 pb-1">技能</h3>
            <div className="space-y-1">
              {content.skills.map((s) => (
                <p key={s} className="text-xs text-white/70">{s}</p>
              ))}
            </div>
          </div>
        )}
        {content.education.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-white/20 pb-1">教育</h3>
            {content.education.map((edu, i) => (
              <div key={i} className="mb-2 text-xs text-white/70">
                <p className="font-bold text-white/90">{edu.school}</p>
                <p>{edu.major} · {edu.degree}</p>
                <p>{edu.date}</p>
              </div>
            ))}
          </div>
        )}
      </aside>
      <main className="flex-1 p-8">
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: config.colors.primary }}>
            <span className="w-1 h-5 inline-block rounded" style={{ backgroundColor: config.colors.accent }} />
            项目经历
          </h2>
          {content.experiences.map((exp, i) => (
            <div key={i} className="mb-5 pl-4 border-l-2" style={{ borderColor: config.colors.accent }}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold">{exp.projectName}</h3>
                <span className="text-xs text-gray-400">{exp.date}</span>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: config.colors.primary }}>{exp.role}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {exp.techStack.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full text-white/90" style={{ backgroundColor: config.colors.accent }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
