import { useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { exportAsJson, importFromJson } from '../utils/storage';
import type { UserProfile } from '../types/profile';

export default function Settings() {
  const { profile, importProfile, resetProfile } = useProfileStore();
  const [message, setMessage] = useState('');

  const handleExport = () => {
    exportAsJson(profile, `resume-profile-${new Date().toISOString().slice(0, 10)}.json`);
    setMessage('导出成功');
  };

  const handleImport = async () => {
    try {
      const data = await importFromJson<UserProfile>();
      importProfile(data);
      setMessage('导入成功');
    } catch (e) {
      setMessage('导入失败: ' + (e as Error).message);
    }
  };

  const handleReset = () => {
    if (confirm('确认清空所有数据？此操作不可恢复。')) {
      resetProfile();
      setMessage('数据已清空');
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-6">设置</h2>

      <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-4">数据管理</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-sm">导出数据 (JSON)</p>
              <p className="text-xs text-gray-400 mt-0.5">将所有经历和信息导出为 JSON 文件备份</p>
            </div>
            <button onClick={handleExport} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              导出
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-sm">导入数据 (JSON)</p>
              <p className="text-xs text-gray-400 mt-0.5">从之前导出的 JSON 文件恢复数据</p>
            </div>
            <button onClick={handleImport} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              导入
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm text-red-500">清空所有数据</p>
              <p className="text-xs text-gray-400 mt-0.5">删除所有个人信息和经历，不可恢复</p>
            </div>
            <button onClick={handleReset} className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50">
              清空
            </button>
          </div>
        </div>
        {message && (
          <div className="mt-4 px-3 py-2 bg-[var(--color-bg)] rounded text-sm text-gray-600">{message}</div>
        )}
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-2">关于</h3>
        <p className="text-sm text-gray-500">Resume Builder v0.1.0 — AI 驱动的智能简历制作平台</p>
        <p className="text-xs text-gray-400 mt-1">数据仅存储在你的浏览器本地，不会上传到任何服务器。</p>
      </section>
    </div>
  );
}
