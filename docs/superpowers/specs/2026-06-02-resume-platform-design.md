# 简历制作平台 — 设计规格书

> 版本: v1.0 | 日期: 2026-06-02 | 状态: 已确认

---

## 一、项目概述

面向开发者的智能简历制作平台。用户通过三种方式录入经历（AI 扫描项目 / 上传简历解析 / 手动填写），AI 根据目标岗位 JD 精确匹配经历并生成定制化简历。支持多模板、在线编辑、PDF/Word 导出。

**核心差异化**：同一经历可维护多个「变体描述」，针对不同岗位自动切换不同侧重点。

---

## 二、技术架构

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 前端框架 | React 18 + Vite | 组件化、生态丰富、社区活跃 |
| 部署 | GitHub Pages | 免费、静态托管、自动 CI/CD |
| 存储 | localStorage + JSON 导出 | 零后端、数据用户自控 |
| AI | Claude API (Anthropic SDK) | 语义匹配质量最高 |
| API Key | 用户自带为主，平台可选提供 | 免费运营 + 灵活切换 |
| 开源 | MIT License, GitHub 公开 | 社区贡献 |

---

## 三、数据模型

### 3.1 用户 Profile（localStorage 存储）

```typescript
interface UserProfile {
  basic: {
    name: string;
    photo?: string;        // base64, 可选
    phone: string;
    email: string;
    location: string;
    github?: string;
    website?: string;
  };
  education: Education[];   // 学校/专业/学历/时间/GPA
  experiences: Experience[]; // 核心数据
  skills: Skill[];          // 编程语言/工具/证书/语言
  updatedAt: string;
}

interface Experience {
  id: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate?: string;
  techStack: string[];
  // 基础描述
  baseDescription: string;
  // 变体描述 — 核心差异化功能
  variants: ExperienceVariant[];
  // 来源标记
  source: 'ai-scan' | 'resume-parse' | 'manual';
  sourcePath?: string;     // AI 扫描时的项目路径
  verified: boolean;       // 用户是否已确认
}

interface ExperienceVariant {
  id: string;
  label: string;           // 如"信号处理""嵌入式""管理"
  description: string;     // 该变体的描述
  keywords: string[];      // 目标岗位关键词
  language: 'zh' | 'en';
}
```

### 3.2 简历版本

```typescript
interface ResumeVersion {
  id: string;
  jobTitle: string;        // 目标岗位
  jdText: string;          // 原始 JD
  templateId: string;      // 使用的模板
  matchScore: number;      // 匹配度 (0-100)
  selectedExperiences: string[]; // 选中的经历 ID
  selectedVariants: Record<string, string>; // 经历ID → 变体ID
  content: ResumeContent;  // 最终简历内容
  language: 'zh' | 'en';
  createdAt: string;
}
```

---

## 四、功能模块

### Phase 1: 基础平台（MVP）
- [ ] 项目脚手架（React + Vite + TypeScript）
- [ ] Profile 管理（基本信息 + 手动录入经历）
- [ ] localStorage 持久化 + JSON 导出/导入
- [ ] 简历模板（3 套）+ 在线编辑器
- [ ] PDF 导出

### Phase 2: AI 能力
- [ ] Claude API 集成
- [ ] 项目自动扫描（读取 CLAUDE.md / 代码文件）
- [ ] 简历解析（上传 PDF/Word → AI 提取）
- [ ] JD 解析（粘贴文本/URL）
- [ ] JD 匹配 + 定制简历生成

### Phase 3: 经历变体 + 增强
- [ ] 经历变体管理（CRUD）
- [ ] AI 自动生成经历变体
- [ ] 匹配度打分 + 差距分析
- [ ] Word 导出

### Phase 4: 高级功能
- [ ] AI 写作助手（润色/扩写/语气调整）
- [ ] A/B 双版本简历对比
- [ ] 中英文切换
- [ ] 版本历史 & 对比
- [ ] 主题颜色切换

---

## 五、UI 设计原则

- **淡蓝色主色调**（#2E86AB），颜色可切换
- **三步引导流程**：录入经历 → 粘贴 JD → 生成简历
- **卡片式布局**，信息分区明确
- **AI 操作均有加载状态和结果预览**
- **所有 AI 生成内容有「AI 生成」标记 + 编辑按钮**
- **响应式设计**，桌面端为主，移动端可查看

---

## 六、路由设计

```
/                   → 首页（引导页）
/profile            → 经历管理（三种录入方式）
/profile/scan       → AI 扫描项目
/profile/upload     → 上传简历解析
/profile/manual     → 手动填写
/jd                 → JD 输入 & 解析
/match              → 匹配结果 & 选择变体
/editor             → 简历编辑器
/preview            → 预览 & 导出
/settings           → API Key、主题、数据管理
```

---

## 七、文件结构

```
简历制作/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/          # 页面组件
│   ├── hooks/          # 自定义 hooks
│   ├── services/       # AI API、导出服务
│   ├── store/          # 状态管理
│   ├── templates/      # 简历模板
│   ├── types/          # TypeScript 类型
│   └── utils/          # 工具函数
├── docs/               # 项目文档
│   ├── requirements.md
│   ├── tech-specs.md
│   └── superpowers/specs/
├── devlog/             # 开发日志
├── public/             # 静态资源
└── CLAUDE.md           # Claude 指引
```

---

*本文档由需求讨论生成，已获用户确认。*
