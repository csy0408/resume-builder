import Anthropic from '@anthropic-ai/sdk';

type AiEngine = 'claude' | 'deepseek';

function getEngine(): AiEngine {
  return (localStorage.getItem('resume-builder-ai-engine') as AiEngine) || 'deepseek';
}

function getKey(): string {
  const engine = getEngine();
  const key =
    engine === 'deepseek'
      ? localStorage.getItem('resume-builder-deepseek-key')
      : localStorage.getItem('resume-builder-api-key');
  if (!key) throw new Error(`请先在设置页面配置 ${engine === 'deepseek' ? 'DeepSeek' : 'Claude'} API Key`);
  return key;
}

async function chat(system: string, user: string, maxTokens = 2048): Promise<string> {
  const engine = getEngine();
  const key = getKey();

  if (engine === 'deepseek') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120000); // 2 min timeout
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
      throw new Error((err as { error?: { message?: string } }).error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // Claude
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return msg.content[0]?.type === 'text' ? msg.content[0].text : '';
}

// ---- Project Scanner ----
interface ScanResult {
  projectName: string;
  role: string;
  techStack: string[];
  baseDescription: string;
  variants: { label: string; description: string; keywords: string[] }[];
}

export async function scanProject(files: { name: string; content: string }[]): Promise<ScanResult[]> {
  const fileList = files
    .map((f) => `### ${f.name}\n\`\`\`\n${f.content.slice(0, 3000)}\n\`\`\``)
    .join('\n\n');
  const text = await chat(
    '你是技术简历专家。从项目文件中提取开发经历，返回 JSON 数组。每个经历包含 projectName, role, techStack, baseDescription, variants（不同岗位侧重点的变体，如前端/后端/算法）。只返回 JSON，不要其他文字。',
    `分析以下项目文件，提取可作为简历素材的开发经历:\n\n${fileList}`,
  );
  return JSON.parse(extractJson(text));
}

// ---- Resume Parser ----
export async function parseResume(text: string): Promise<{
  basic: { name: string; phone: string; email: string; location: string; github?: string };
  education: { school: string; major: string; degree: string; startDate: string; endDate?: string }[];
  experiences: { projectName: string; role: string; startDate: string; endDate?: string; techStack: string[]; baseDescription: string }[];
  skills: { category: string; name: string }[];
}> {
  const result = await chat(
    '你是简历解析专家。从简历文本中提取结构化信息。返回 JSON，包含 basic（name,phone,email,location,github）、education（school,major,degree,startDate,endDate）、experiences（projectName,role,startDate,endDate,techStack,baseDescription）、skills（category,name）。只返回 JSON。',
    `解析以下简历:\n\n${text}`,
  );
  return JSON.parse(extractJson(result));
}

// ---- JD Parser ----
export async function parseJD(jdText: string): Promise<{
  title: string;
  company?: string;
  techStack: string[];
  requirements: {
    category: 'skill' | 'experience' | 'education' | 'soft-skill';
    keyword: string;
    importance: 'required' | 'preferred';
    yearsRequired?: number;
  }[];
  summary: string;
}> {
  const result = await chat(
    '你是招聘需求分析专家。从岗位JD中提取结构化信息。返回 JSON，包含 title,company,techStack,requirements（数组，每项有 category/keyword/importance/yearsRequired）,summary。只返回 JSON。',
    `分析这个岗位JD:\n\n${jdText}`,
  );
  return JSON.parse(extractJson(result));
}

// ---- JD Matcher ----
export async function matchJD(
  profile: object,
  jdAnalysis: object,
): Promise<{
  selectedExperiences: { experienceId: string; variantId?: string; relevance: number }[];
  gaps: { keyword: string; suggestion: string }[];
  score: number;
  suggestions: string[];
}> {
  const result = await chat(
    '你是简历匹配专家。对比用户 Profile 和岗位 JD，选择最相关的经历和变体，给出匹配度评分和差距分析。返回 JSON：selectedExperiences(experienceId,variantId,relevance)、gaps(keyword,suggestion)、score(0-100)、suggestions。只返回 JSON。',
    `用户 Profile:\n${JSON.stringify(profile, null, 2)}\n\nJD 分析:\n${JSON.stringify(jdAnalysis, null, 2)}`,
  );
  return JSON.parse(extractJson(result));
}

// ---- Variant Generator ----
export async function generateVariants(
  experience: object,
  targetRoles: string[],
): Promise<{ label: string; description: string; keywords: string[] }[]> {
  const result = await chat(
    '你是技术简历写作专家。为同一段经历生成不同岗位侧重点的描述变体。返回 JSON 数组，每项包含 label, description, keywords。',
    `经历:\n${JSON.stringify(experience, null, 2)}\n\n目标岗位方向:\n${targetRoles.join(', ')}\n\n为每个方向生成对应的经历描述变体。只返回 JSON 数组。`,
  );
  return JSON.parse(extractJson(result));
}

// ---- Writing Assistant ----
export async function polishText(
  text: string,
  mode: 'polish' | 'star' | 'shorter' | 'longer' | 'technical' | 'management',
): Promise<string> {
  const modePrompts: Record<string, string> = {
    polish: '润色以下简历描述，使其更专业、更有影响力，保持原意',
    star: '用 STAR 法则（Situation-Task-Action-Result）重写以下描述，突出量化成果',
    shorter: '将以下描述精简到 2-3 句话，保留核心信息',
    longer: '将以下描述扩展，补充更多细节和量化成果',
    technical: '将以下描述调整为技术导向，强调技术选型和架构决策',
    management: '将以下描述调整为管理导向，强调团队领导和项目协调能力',
  };
  return chat(modePrompts[mode] || modePrompts.polish, text, 1024);
}

// ---- Helper ----
function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? match[0] : text;
}
