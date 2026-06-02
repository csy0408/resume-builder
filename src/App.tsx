import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AiScan from './pages/AiScan';
import Editor from './pages/Editor';
import Settings from './pages/Settings';
import JDInput from './pages/JDInput';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">{title}</h2>
        <p className="text-gray-400">开发中...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/scan" element={<AiScan />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/jd" element={<JDInput />} />
      </Routes>
    </BrowserRouter>
  );
}
