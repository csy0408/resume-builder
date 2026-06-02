import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanProject, parseResume } from '../services/claude';
import { useProfileStore } from '../store/profileStore';
import type { Experience } from '../types/profile';

interface ScanResult {
  projectName: string;
  role: string;
  techStack: string[];
  baseDescription: string;
  variants: { label: string; description: string; keywords: string[] }[];
}

export default function AiScan() {
  const navigate = useNavigate();
  const { addExperience } = useProfileStore();
  const [fileList, setFileList] = useState<{ name: string; content: string }[]>([]);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'scan' | 'resume'>('scan');
  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<Awaited<ReturnType<typeof parseResume>> | null>(null);

  const handleResumeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    try {
      let text = '';
      if (file.name.endsWith('.pdf')) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: { str?: string }) => item.str || '').join(' ') + '\n';
        }
      } else if (file.name.endsWith('.docx')) {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        setError('不支持的文件格式，请上传 PDF、Word 或 TXT 文件');
        return;
      }
      setResumeText(text);
      setParseResult(null);
    } catch (e) {
      setError('文件读取失败: ' + (e as Error).message);
    }
  };

  const handleParse = async () => {
    if (!resumeText) { setError('请先上传简历文件'); return; }
    setParsing(true); setError('');
    try {
      const r = await parseResume(resumeText);
      setParseResult(r);
    } catch (e) {
      setError((e as Error).message);
    }
    setParsing(false);
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const loaded: { name: string; content: string }[] = [];
    for (const f of files) {
      if (f.name.match(/\.(md|txt|json|ts|tsx|js|jsx|py|m|yaml|yml|html|css)$/i)) {
        const content = await f.text();
        loaded.push({ name: f.name, content });
      }
    }
    setFileList(loaded);
    setError('');
  };

  const handleScan = async () => {
    if (fileList.length === 0) {
      setError('请先选择项目文件');
      return;
    }
    setScanning(true);
    setError('');
    try {
      const r = await scanProject(fileList);
      setResults(r);
      setChecked(new Set(r.map((_, i) => i)));
    } catch (e) {
      setError((e as Error).message);
    }
    setScanning(false);
  };

  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleImport = () => {
    results.forEach((r, i) => {
      if (checked.has(i)) {
        addExperience({
          id: '',
          projectName: r.projectName,
          role: r.role,
          startDate: '',
          endDate: '',
          techStack: r.techStack,
          baseDescription: r.baseDescription,
          variants: r.variants?.map((v) => ({
            id: '',
            label: v.label,
            description: v.description,
            keywords: v.keywords,
            language: 'zh' as const,
          })) || [],
          source: 'ai-scan' as const,
          verified: true,
        } as Experience);
      }
    });
    navigate('/profile');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-[var(--color-primary-dark)]">
          <button onClick={() => setMode('scan')} className={mode === 'scan' ? '' : 'text-gray-300 hover:text-gray-500'}>AI 项目扫描</button>
          <span className="mx-2 text-gray-300">|</span>
          <button onClick={() => setMode('resume')} className={mode === 'resume' ? '' : 'text-gray-300 hover:text-gray-500'}>上传简历解析</button>
        </h2>
      </div>

      {mode === 'scan' && (
        <div>
          <p className="text-sm text-gray-400 mb-6">
            选择项目中的关键文件（CLAUDE.md、package.json、源码等），AI 自动提取开发经历
          </p>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-600">选择项目文件</span>
          <input
            type="file"
            multiple
            onChange={handleFiles}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[var(--color-bg)] file:text-[var(--color-primary)] hover:file:bg-gray-200"
          />
        </label>

        {fileList.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">已选择 {fileList.length} 个文件：</p>
            <div className="flex flex-wrap gap-2">
              {fileList.map((f) => (
                <span
                  key={f.name}
                  className="text-xs px-2 py-1 bg-[var(--color-bg)] rounded text-gray-600"
                >
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={scanning || fileList.length === 0}
          className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scanning ? 'AI 分析中...' : '开始扫描'}
        </button>

        {error && (
          <div className="mt-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-500">
            {error}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--color-primary-dark)]">
              扫描结果 ({results.length} 段经历)
            </h3>
            <button
              onClick={() => setChecked(new Set(results.map((_, i) => i)))}
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              全选
            </button>
          </div>

          <div className="space-y-4">
            {results.map((r, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={() => toggleCheck(i)}
                    className="mt-1 accent-[var(--color-primary)]"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--color-primary-dark)]">{r.projectName}</h4>
                    <p className="text-xs text-gray-400 mb-1">
                      角色：{r.role} | 技术栈：{r.techStack.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">{r.baseDescription}</p>
                    {r.variants.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {r.variants.map((v) => (
                          <span
                            key={v.label}
                            className="text-xs px-2 py-0.5 bg-[var(--color-bg)] rounded text-[var(--color-primary)]"
                          >
                            {v.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleImport}
            className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
          >
            导入选中的经历 ({checked.size} 条)
          </button>
        </div>
      )}
        </div>
      )}

      {mode === 'resume' && (
        <div>
          <p className="text-sm text-gray-400 mb-6">上传已有的简历文件（PDF/Word/TXT），AI 自动提取信息并填充到 Profile</p>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleResumeFile} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[var(--color-bg)] file:text-[var(--color-primary)]" />

            {resumeText && (
              <div className="mt-4">
                <button onClick={handleParse} disabled={parsing} className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50">
                  {parsing ? 'AI 解析中...' : '🤖 开始解析'}
                </button>
              </div>
            )}
          </div>

          {parseResult && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--color-primary-dark)] mb-4">解析结果</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-gray-500 mb-1">基本信息</h4>
                  <p>姓名：{parseResult.basic.name} | 电话：{parseResult.basic.phone} | 邮箱：{parseResult.basic.email} | 地点：{parseResult.basic.location}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 mb-1">教育 ({parseResult.education.length})</h4>
                  {parseResult.education.map((edu, i) => (
                    <p key={i}>{edu.school} · {edu.major} · {edu.degree} ({edu.startDate} - {edu.endDate || '至今'})</p>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 mb-1">经历 ({parseResult.experiences.length})</h4>
                  {parseResult.experiences.map((exp, i) => (
                    <div key={i} className="mb-2">
                      <p className="font-medium">{exp.projectName} — {exp.role} ({exp.startDate} - {exp.endDate || '至今'})</p>
                      <p className="text-xs text-gray-400">技术栈：{exp.techStack.join(', ')}</p>
                      <p className="text-xs text-gray-500 mt-1">{exp.baseDescription}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-gray-500 mb-1">技能 ({parseResult.skills.length})</h4>
                  <p>{parseResult.skills.map(s => s.name).join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
