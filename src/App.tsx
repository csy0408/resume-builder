import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">{title}</h2>
        <p className="text-gray-400">开发中...</p>
        <a href="/" className="text-[var(--color-primary)] mt-4 inline-block hover:underline">
          ← 返回首页
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PlaceholderPage title="经历管理" />} />
        <Route path="/jd" element={<PlaceholderPage title="JD 匹配" />} />
        <Route path="/editor" element={<PlaceholderPage title="简历编辑" />} />
        <Route path="/settings" element={<PlaceholderPage title="设置" />} />
      </Routes>
    </BrowserRouter>
  );
}
