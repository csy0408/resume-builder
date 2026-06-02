import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AiScan from './pages/AiScan';
import Editor from './pages/Editor';
import Settings from './pages/Settings';
import JDInput from './pages/JDInput';

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
