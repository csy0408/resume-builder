import { Link } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';

export default function Home() {
  const { profile } = useProfileStore();
  const hasContent = profile.basic.name || profile.experiences.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold text-[var(--color-primary-dark)] mb-4">
        Resume Builder
      </h1>
      <p className="text-gray-500 text-lg mb-2">
        AI 驱动的智能简历制作平台
      </p>
      <p className="text-gray-400 text-sm mb-8">
        录入经历 · AI 匹配 JD · 生成定制简历
      </p>

      {hasContent && (
        <div className="text-sm text-gray-400 mb-4">
          已录入 {profile.experiences.length} 段经历
        </div>
      )}

      <nav className="flex gap-4">
        <Link
          to="/profile"
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          {hasContent ? '管理经历' : '开始制作'}
        </Link>
        <Link
          to="/editor"
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          预览简历
        </Link>
        <Link
          to="/settings"
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          设置
        </Link>
      </nav>
    </div>
  );
}
