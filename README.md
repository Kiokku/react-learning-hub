# React 18 Source Study

一个以“亲手实现 + 行为测试 + 闭卷复述”为核心的 React 源码学习工作台。

本仓库以 React 18 的实现机制为主线，补充 React 19/19.2 的关键差异，目标不是看完课程，而是建立能够实现、验证和讲清楚的 React 心智模型，并形成高级前端面试中的 React 专项能力。

> 本仓库保存学习路线、笔记、进度和可视化 Hub；mini React 的实现与测试应放在独立仓库中。原因见 [`docs/adr/0001-separate-learning-and-implementation-repositories.md`](./docs/adr/0001-separate-learning-and-implementation-repositories.md)。

## 你会学到什么

- JSX、ReactElement 与 JSX Runtime。
- Fiber、Reconciler、双缓存树与 render/commit 主链路。
- `useState`、`useEffect`、`useRef`、Context 等常用能力的核心模型。
- Diff、事件系统、Lane、调度、并发更新、Suspense 与性能优化。
- React 19/19.2 中 `use`、Actions、`useActionState`、`useOptimistic`、`useFormStatus`、ref as prop、`useEffectEvent` 和 `<Activity />` 的关键差异。
- 将实现过程压缩为可验证的测试和可复述的面试回答。

完整范围以 [`roadmap.md`](./roadmap.md) 为准。当前路线共 16 个阶段、49 个机制级 Lesson。

## 阅读顺序

第一次使用时，建议严格按下列顺序阅读：

| 顺序 | 文件 | 用途 |
| --- | --- | --- |
| 1 | [`MISSION.md`](./MISSION.md) | 确认目标、完成标准、时间约束和非目标 |
| 2 | [`CONTEXT.md`](./CONTEXT.md) | 统一“阶段掌握”“Lesson”“实现日”等术语，避免把看完误认为掌握 |
| 3 | [`roadmap.md`](./roadmap.md) | 了解 16 个阶段的依赖顺序、Lesson、实现产出和面试输出 |
| 4 | [`RESOURCES.md`](./RESOURCES.md) | 确认课程主线、React 官方源码和文档等证据来源 |
| 5 | [`daily-workflow.md`](./daily-workflow.md) | 按理解日、实现日和阶段验收执行学习闭环 |
| 6 | [`templates/notebooklm-learning-template.md`](./templates/notebooklm-learning-template.md) | 在一个 NotebookLM Notebook 中迭代学习课程来源 |
| 7 | [`prompts.md`](./prompts.md) | 使用 `teach`、代码 Review、面试追问和差异分析 Prompt |
| 8 | [`lesson-progress.md`](./lesson-progress.md) | 更新 Lesson 状态和对应证据 |
| 9 | [`progress-tracker.md`](./progress-tracker.md) | 更新阶段状态、每日记录和双周复盘 |
| 10 | [`interview-question-bank.md`](./interview-question-bank.md) | 阶段验收和最终模拟面试 |

只想快速了解项目时，可以先打开 [`learning-hub.html`](./learning-hub.html)，再回到 `MISSION.md` 和 `roadmap.md`。

## 开始学习

### 1. 准备两个仓库

建议使用并列目录：

```text
Projects/
├── react18-source-study/  # 本仓库：路线、笔记、进度和 Hub
└── mini-react18/          # 独立仓库：实现、测试、Demo 和公开文档
```

实现仓库可以按自己的技术栈初始化。本仓库只通过 commit、测试结果或 Demo 链接记录实现证据，不复制完整实现代码。

### 2. 选择课程主线

默认课程主线记录在 [`RESOURCES.md`](./RESOURCES.md)，当前使用付费课程《从0实现 React18》。课程链接只用于已购买用户访问；仓库不应提交下载视频、课程讲义、登录信息或其他受版权保护的私有内容。

你可以用自己的书籍、视频或文章系列替换课程主线，替换方法见[自定义课程主线](#自定义课程主线)。React 官方源码和官方文档仍应作为行为与版本边界的最终核对来源。

### 3. 从当前 Lesson 开始

查看 `lesson-progress.md` 中第一个不是“已完成”的 Lesson，然后在支持本地文件读取的 Agent 中执行：

```text
使用 teach 开始 roadmap 阶段 0。
请读取当前学习记录，诊断我的已有理解，并只生成下一个机制级 Lesson。
```

`teach` 应按阶段使用，但每次只推进一个机制级 Lesson。NotebookLM 负责基于课程来源做带引用的总结和问答，`teach` 负责诊断、测试设计、闭卷实现引导、纠偏与面试追问。

### 4. 执行两日学习闭环

每个 Lesson 通常分为两天：

1. **理解日（60 分钟）**：课前预测 → 诊断 → 课程学习 → 闭卷画图与复述 → Quiz → 写出测试目标。
2. **实现日（最长 90 分钟）**：先写失败测试 → 不看课程完成最小实现 → 运行测试 → 对照课程和官方资料 → 记录偏差 → 输出面试回答。

详细时间分配见 [`daily-workflow.md`](./daily-workflow.md)。不要让 Agent 在理解设计之前直接生成 Reconciler、Hooks、Diff、Lane 或 Suspense 的完整实现。

### 5. 更新证据，而不是只打勾

学习结束后更新：

- `lesson-progress.md`：Lesson 状态、NotebookLM 来源、笔记和实现证据。
- `progress-tracker.md`：阶段状态、日期、掌握度、每日记录和双周复盘。
- `notes/`：练习、伪代码、错误假设、实现差异和面试回答。
- `learning-records/`：通过阶段验收后形成的稳定理解。

Lesson 状态只能按 `未开始 → 理解中 → 实现中 → 已完成` 推进。阶段全部 Lesson 完成后仍是“待验收”；只有闭卷实现、关键行为测试和两轮追问全部通过，才是“已掌握”。

## React Learning Hub

Hub 是仓库内容的只读总览，数据来自 Markdown 文件，不在浏览器中维护另一份学习进度。

### 本地生成

要求：Node.js 22 或更高版本。

```bash
node scripts/build-learning-hub.mjs
```

生成后直接打开 `learning-hub.html`，或启动本地静态服务器：

```bash
python3 -m http.server 4174
```

然后访问 `http://127.0.0.1:4174/learning-hub.html`。每次修改路线、资源或进度后都应重新生成 Hub。

## 自定义课程主线

课程主线可以替换，但学习目标不应跟着某门课程的章节编排漂移。默认策略是保留 `roadmap.md` 的机制依赖和 Lesson ID，把新资源章节重新映射到现有 Lesson；新资源缺失的内容由 React 官方源码或文档补齐，多出的内容标记为可选扩展。

为使 Hub 正确识别主线链接，`RESOURCES.md` 中主课程资源的链接标题必须以 `课程：` 开头，例如：

```markdown
- [课程：你的 React 源码课程](https://example.com/course)
  说明课程版本、章节范围、访问条件及其在路线中的职责。
```

将下面的 Prompt 交给能够读取本仓库文件的 Agent，并补齐方括号内容：

```text
你是 React 源码课程设计者。请基于当前仓库，为我把个人学习资源替换为新的课程主线。

先读取并遵守：
- MISSION.md
- CONTEXT.md
- RESOURCES.md
- roadmap.md
- daily-workflow.md
- lesson-progress.md
- progress-tracker.md
- scripts/build-learning-hub.mjs

我的资源：
- 资源名称：[名称]
- 类型：[视频课程 / 书籍 / 文章系列 / 其他]
- URL 或本地目录：[地址]
- 目标 React 版本：[版本]
- 目录或章节清单：[粘贴完整目录]
- 每周可用时间：[时间]
- 已掌握内容：[内容]

设计目标：
1. 保持 React 18 核心机制的实现主线，并保留 React 19/19.2 差异阶段。
2. 除非我明确要求改变学习范围，否则保留现有阶段顺序和 Sxx-Lxx Lesson ID。
3. 将每个资源章节映射到一个或多个 Lesson；一个 Lesson 可以关联多个章节。
4. 标出新资源没有覆盖但当前 roadmap 要求掌握的缺口，并优先用 React 官方源码或官方文档补齐。
5. 标出超出当前目标的章节，不要自动扩大学习范围，将其列为可选扩展。
6. 保留“理解日 → 实现日 → 阶段验收”的学习方式，以及闭卷实现、行为测试、两轮追问的完成标准。
7. 不提交付费内容、下载地址、登录凭据或课程原文，只记录合法访问入口、章节编号和自己的学习证据。

请先输出，不要立即修改文件：
A. 新旧课程覆盖矩阵：Lesson、现有章节、新章节、覆盖状态、缺口来源。
B. 需要修改的最小文件清单及原因。
C. 可能导致路线失真的冲突或不确定项。

等我确认后再修改：
- RESOURCES.md：把主课程放在 Knowledge 第一项，链接标题以“课程：”开头。
- roadmap.md：只更新课程名称、章节映射和确有必要的说明，不静默改变机制目标。
- lesson-progress.md / progress-tracker.md：只有 Lesson ID 或阶段发生变化时才同步结构，不覆盖已有学习证据。

修改后运行：
node scripts/build-learning-hub.mjs

最后报告：
- 覆盖完整的 Lesson
- 仍有缺口的 Lesson
- 被标记为可选的章节
- 修改文件
- Hub 构建验证结果
```

## 部署到 GitHub Pages

对于这个无后端、单 HTML 页面的网站，GitHub Pages 是最方便的示例部署方式：无需额外账号或运行时，并且可在每次推送后由 Actions 自动重新生成和发布。仓库已经提供 [`.github/workflows/pages.yml`](./.github/workflows/pages.yml)。

工作流会：

1. 检出仓库并安装指定 Node.js 版本。
2. 运行 `node scripts/build-learning-hub.mjs`。
3. 将生成的 `learning-hub.html` 复制为站点入口 `index.html`。
4. 上传并部署 GitHub Pages artifact。

首次发布：

```bash
git init
git add .
git commit -m "docs: publish React source study hub"
git branch -M main
git remote add origin https://github.com/<你的账号>/<仓库名>.git
git push -u origin main
```

然后打开 GitHub 仓库的 **Settings → Pages → Build and deployment**，将 Source 设为 **GitHub Actions**。Actions 完成后，项目站点通常位于：

```text
https://<你的账号>.github.io/<仓库名>/
```

工作流也支持在 Actions 页面手动触发。若使用 GitHub Free，仓库应设为 public；私有仓库是否可发布 Pages 取决于账号方案。

## 目录说明

```text
.
├── MISSION.md                 # 学习目标与完成标准
├── CONTEXT.md                 # 术语和边界
├── RESOURCES.md               # 课程、源码和文档来源
├── roadmap.md                 # 16 阶段 / 49 Lesson 路线
├── daily-workflow.md          # 理解日、实现日和验收流程
├── lesson-progress.md         # Lesson 状态和证据
├── progress-tracker.md        # 阶段、每日和双周进度
├── prompts.md                 # teach、Review 和面试 Prompt
├── interview-question-bank.md # React 专项题库
├── templates/                 # NotebookLM 与 Lesson 模板
├── scripts/                   # Learning Hub 生成脚本
├── learning-hub.html          # 生成后的静态 Hub
└── docs/adr/                  # 关键学习系统决策
```

`lessons/`、`notes/`、`learning-records/` 和 `reference/` 会在产生对应成果后创建，Hub 会自动读取其中的文件。

## 设计原则

- **Build it**：先写最小实现，不靠复制课程代码获得“完成感”。
- **Prove it**：测试可观察行为，明确实现边界。
- **Explain it**：脱离笔记讲清数据结构、主链路与设计权衡。
- **Track evidence**：进度必须指向笔记、测试、commit 或 Demo。
- **Keep sources replaceable**：课程是学习骨架的输入，不是学习目标本身。

项目组织方式参考了 [`rohitg00/ai-engineering-from-scratch`](https://github.com/rohitg00/ai-engineering-from-scratch) 对“阶段化路线、固定学习循环、每课产出可验证成果”的设计。
