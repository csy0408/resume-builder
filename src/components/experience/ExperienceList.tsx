import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';
import ExperienceForm from './ExperienceForm';
import VariantEditor from './VariantEditor';

export default function ExperienceList() {
  const { profile, removeExperience } = useProfileStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)]">项目经历</h3>
        <div className="flex gap-2">
          <Link
            to="/profile/scan"
            className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] text-sm rounded-lg hover:bg-[var(--color-bg)]"
          >
            AI 扫描
          </Link>
          <button
            onClick={() => { setEditingId(null); setShowForm(true); }}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90"
          >
            + 添加经历
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <ExperienceForm
            experience={editingId ? profile.experiences.find((e) => e.id === editingId) : undefined}
            onClose={() => { setShowForm(false); setEditingId(null); }}
          />
        </div>
      )}

      {profile.experiences.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
          暂无经历，点击上方按钮添加
        </div>
      ) : (
        <div className="space-y-4">
          {profile.experiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[var(--color-primary-dark)]">{exp.projectName}</h4>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500">{exp.role}</span>
              </div>
              <p className="text-sm text-gray-600">{exp.baseDescription}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {exp.techStack.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-[var(--color-bg)] rounded text-gray-600">{t}</span>
                ))}
              </div>
              <VariantEditor experience={exp} />
              <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { setEditingId(exp.id); setShowForm(true); }}
                  className="text-xs text-[var(--color-primary)] hover:underline"
                >
                  编辑
                </button>
                <button
                  onClick={() => { if (confirm('确认删除？')) removeExperience(exp.id); }}
                  className="text-xs text-red-400 hover:underline"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
