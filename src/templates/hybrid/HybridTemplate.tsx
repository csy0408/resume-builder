import type { TemplateRendererProps } from '../../types/resume';

export default function HybridTemplate({ content, config }: TemplateRendererProps) {
  return (
    <div className="max-w-[800px] mx-auto" style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: config.colors.background }}>
      <header className="text-center py-8" style={{ backgroundColor: config.colors.primary, color: '#fff' }}>
        <h1 className="text-3xl font-bold">{content.basic.name || '姓名'}</h1>
        <div className="flex justify-center gap-6 mt-3 text-xs opacity-70">
          {[content.basic.phone, content.basic.email, content.basic.location].filter(Boolean).join('  ·  ')}
        </div>
      </header>
      <div className="flex">
        <main className="flex-1 p-8">
          <section>
            <h2 className="text-lg font-bold uppercase mb-4" style={{ color: config.colors.primary }}>经历</h2>
            {content.experiences.map((exp, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.projectName} — <span className="font-normal text-sm">{exp.role}</span></h3>
                  <span className="text-xs text-gray-400">{exp.date}</span>
                </div>
                <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
                <div className="flex gap-2 mt-2">
                  {exp.techStack.map((t) => (
                    <span key={t} className="text-xs text-gray-500">#{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>
        <aside className="w-[200px] p-6 border-l border-gray-100 flex-shrink-0">
          {content.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">技能</h3>
              {content.skills.map((s) => (
                <span key={s} className="inline-block text-xs px-2 py-1 bg-white rounded border border-gray-200 mr-1 mb-1">{s}</span>
              ))}
            </div>
          )}
          {content.education.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">教育</h3>
              {content.education.map((edu, i) => (
                <div key={i} className="text-xs mb-2">
                  <p className="font-bold">{edu.school}</p>
                  <p className="text-gray-500">{edu.major} · {edu.degree}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
