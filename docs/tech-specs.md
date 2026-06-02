# 技术规范

> 版本: v1.0 | 最后更新: 2026-06-02

---

## 技术栈

| 类别 | 选择 | 版本 |
|------|------|------|
| 框架 | React | ^18 |
| 构建 | Vite | ^5 |
| 语言 | TypeScript | ^5 |
| 路由 | React Router | ^6 |
| 状态管理 | Zustand | ^4 |
| 样式 | Tailwind CSS | ^3 |
| AI SDK | @anthropic-ai/sdk | ^0.30 |
| PDF 导出 | jsPDF + html2canvas | latest |
| Word 导出 | docx | ^8 |
| 富文本编辑 | Tiptap | ^2 |
| 代码规范 | ESLint + Prettier | latest |
| 测试 | Vitest + React Testing Library | latest |

---

## 编码规范

### 文件命名
- 组件文件：PascalCase（`ExperienceCard.tsx`）
- Hook 文件：camelCase + use 前缀（`useProfile.ts`）
- 工具函数：camelCase（`exportPdf.ts`）
- 类型定义：PascalCase（`types/experience.ts`）

### 组件规范
- 每个组件一个文件
- Props 使用 TypeScript interface 定义
- 导出方式：命名导出（`export function`），页组件用默认导出
- 不使用 React.FC，直接用函数声明

### 状态管理
- 全局状态用 Zustand store（Profile、Settings）
- 页面级状态用组件内部 useState/useReducer
- AI 调用状态统一用 `useAiService` hook

### API 调用
- 所有 Claude API 调用统一在 `services/claude.ts`
- 错误处理：统一 try-catch + toast 提示
- API Key 从 Zustand settings store 读取
- 请求前检查 Key 是否存在，无 Key 引导用户设置

---

## 目录结构

```
src/
├── components/
│   ├── common/           # 通用组件 (Button, Modal, Toast, Loading...)
│   ├── experience/       # 经历相关 (ExperienceCard, VariantEditor...)
│   ├── resume/           # 简历相关 (TemplateRenderer, Editor...)
│   └── layout/           # 布局 (Header, Sidebar, StepIndicator)
├── pages/
│   ├── Home.tsx
│   ├── Profile.tsx
│   ├── JDInput.tsx
│   ├── MatchResult.tsx
│   ├── Editor.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useProfile.ts     # Profile CRUD
│   ├── useAiService.ts   # AI 调用封装
│   ├── useExport.ts      # 导出逻辑
│   └── useLocalStorage.ts
├── services/
│   ├── claude.ts         # Claude API 封装
│   ├── export-pdf.ts     # PDF 导出
│   ├── export-word.ts    # Word 导出
│   └── resume-parser.ts  # 简历解析
├── store/
│   ├── profileStore.ts   # Profile 状态
│   └── settingsStore.ts  # 设置状态
├── templates/
│   ├── classic/          # 经典单栏
│   ├── modern/           # 现代双栏
│   └── hybrid/           # 混合布局
├── types/
│   ├── profile.ts
│   ├── resume.ts
│   └── jd.ts
├── utils/
│   ├── storage.ts
│   └── format.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 数据流

```
用户操作 → Zustand Store → React 组件渲染
                ↕
         localStorage（自动持久化）
                ↕
         JSON 文件（手动导出/导入）

AI 调用流：
用户触发 → useAiService → claude.ts → Anthropic API
                ↓
          解析响应 → 更新 Store → 展示结果
```

---

## 简历模板接口

所有模板必须实现：

```typescript
interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  render: (data: ResumeContent) => JSX.Element;
  // 模板支持的字段配置
  config: {
    showPhoto: boolean;
    sections: SectionConfig[];
    colors: ThemeColors;
  };
}
```

---

## 安全规范

- API Key **仅存 localStorage**，永不通过网络传输到第三方
- 不上传用户简历数据到任何服务器
- GitHub Pages 部署时不包含任何密钥
- 用户数据完全由用户自己控制（localStorage + JSON）
