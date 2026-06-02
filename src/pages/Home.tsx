export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-[var(--color-primary-dark)] mb-4">
        Resume Builder
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        AI 驱动的智能简历制作平台
      </p>
      <nav className="flex gap-4">
        <a href="/profile" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
          开始制作
        </a>
        <a href="/settings" className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          设置
        </a>
      </nav>
    </div>
  );
}
