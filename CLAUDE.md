# 简历制作平台 — Resume Builder

> AI 驱动的智能简历制作平台，根据岗位 JD 精确匹配经历，生成定制化简历。

## 项目信息

- **类型**: Web 应用 (React SPA)
- **部署**: GitHub Pages（公开访问）
- **开源**: MIT License

## 核心文档路径

| 文档 | 路径 | 说明 |
|------|------|------|
| 设计规格书 | `docs/superpowers/specs/2026-06-02-resume-platform-design.md` | 完整产品设计 |
| 需求文档 | `docs/requirements.md` | 用户故事、功能优先级 |
| 技术规范 | `docs/tech-specs.md` | 技术栈、编码规范、目录结构 |
| 开发日志 | `devlog/` | 每日开发记录 |

## 开发约定

### 技术栈
- React 18 + Vite + TypeScript + Tailwind CSS
- 状态管理: Zustand
- AI: Claude API (@anthropic-ai/sdk)
- 导出: jsPDF + docx.js
- 富文本: Tiptap

### 核心原则
- **纯前端**：无后端服务器，数据存 localStorage
- **用户数据自控**：API Key 和简历数据均由用户自己管理
- **渐进开发**：P0(MVP) → P1(AI能力) → P2(增强)
- **一个组件一个文件**，命名导出
- **AI 调用统一在 `services/claude.ts`**

### 启动开发
```bash
cd D:/Claude/projects/简历制作
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run preview    # 预览构建结果
```

### 每次开发前
1. 阅读 `devlog/` 中最新的日志，了解上次进度
2. 阅读 `docs/requirements.md` 确认当前阶段目标
3. 遵循 `docs/tech-specs.md` 中的编码规范

### 每次开发后
1. 在 `devlog/` 中记录当日完成事项和待办事项
2. 更新 `docs/requirements.md` 中的功能状态（如有变化）

## 当前进度

- [x] Phase 0: 项目初始化（脚手架、配置）✅ 2026-06-02
- [ ] Phase 1: MVP（手动录入、模板、PDF导出）
- [ ] Phase 2: AI 集成（项目扫描、简历解析、JD匹配）
- [ ] Phase 3: 增强（经历变体、打分、Word导出）
- [ ] Phase 4: 高级（AI写作助手、中英文、版本对比）

## 线上地址

- **仓库**：https://github.com/csy0408/resume-builder
- **在线**：https://csy0408.github.io/resume-builder/

## Git Push 备忘

如果 HTTPS 超时，用：
```bash
GIT_SSL_NO_VERIFY=1 git -c http.version=HTTP/1.1 push origin main
```

> 详见 `docs/requirements.md` 功能优先级
