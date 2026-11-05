# React Learning Hub

在 CourseX 中理解 React 源码与设计思想的路线图和说明书。

React 是我职业生涯中重要的技术栈。在 AI 能够承担大量编码工作的时代，我希望回到源码，理解 React 如何描述 UI、组织状态、协调更新，以及这些设计的收益与代价。未来将经过独立验证的理解，逐步整理为图解 React 的交互式教材 **React, Explained.**。

**Build it. Prove it. Explain it. Teach it.** 学习依靠实现、实验与解释；教学作品按需提炼，不是每节课的作业。面试练习可以作为辅助用途。

## 从这里开始

| 入口 | 用途 |
| --- | --- |
| [roadmap.md](./roadmap.md) | 16 阶段、49 个机制索引：设计问题、依赖、课程映射与建议实验 |
| [workflow.md](./workflow.md) | 在 CourseX 中提出问题、探索、验证和沉淀；三类可复制 Prompt |
| [网页指引](./learning-hub.html) | 同一份路线与学习方法的离线网页入口 |

## 三分钟上手

1. 打开你部署的 CourseX，选择《从0实现 React18》课程。
2. 在路线图中定位 **S01-L01**，对应课程 `003「2-1」实现 JSX`、`004「2-2」实现 JSX 的打包`；CourseX 中显示为 `02-01`、`02-02`。
3. 打开课程章节的画板，放入问题：“JSX 为什么先形成 UI 的描述，而不是直接创建 DOM？”
4. 按 [四步法](./workflow.md) 看课程、读源码、与 AI 讨论，在 mini React 仓库做最小实验，将解释与依据留在画布。
5. CourseX 支持结构化导出后，按需导出、检查内容并纳入自己的 Git 备份。

CourseX 地址由你的运行环境决定。本仓库尚未确认稳定的 `courseId/chapterId` 深链接，先按章节名查找。章节主画布自动绑定、问答保存为卡片、结构化导出属于企划能力，具体可用性需在 CourseX 核查；当前可使用已有画板手动整理文字、问答片段与证据链接。

## 项目分工

| 项目 | 职责 | 内容位置 |
| --- | --- | --- |
| React Learning Hub | 学习方向、机制依赖、课程映射与操作方法 | 本仓库 |
| CourseX | 课程学习、AI 探索与章节知识画布 | CourseX 本地数据及其导出包 |
| mini-react18 | 独立实现、行为测试、最小 Demo | [实现仓库](https://github.com/Kiokku/mini-react18) |
| React, Explained. | 将成熟理解重新组织为公开教材 | 未来独立项目 |

一个机制索引可以对应多节课程；课程章节画布承载具体探索，机制索引不等于视频章节或进度状态。本仓库不维护个人进度、掌握度、每日打卡或另一份知识笔记。旧成果保留在 [历史归档](./archive/README.md)，无需迁入 CourseX 或重新验收。

CourseX 的工作画布可以保留错误假设与未解决问题。公开教材需要重新筛选、验证与教学设计；学习路线与教材叙事不必使用同一套导航。可复用图解组件属于后续演进。

## 学习范围与来源

React 18 是实现主线，React 19/19.2 作为版本差异补充。保留现有范围，不扩展为 React 全量实现、SSR、React Server Components 基础设施或 React Compiler 项目。

课程入口、配套实现与官方源码见 [RESOURCES.md](./RESOURCES.md)。课程 mini React、自己的实现与 React 官方实现需要区分，重要结论保留版本、源码或测试依据。只引用合法访问入口，不提交付费原始视频、完整课件、凭据或密钥。

更换课程时，保留机制目标与 `Sxx-Lxx` ID，将新课程重新映射到已有主题；未覆盖的内容用官方资料补齐，超出范围的内容列为可选。路线图提供问题与实验建议，不预设课程里的每个简化都等于官方实现。

## 网页生成与发布

要求 Node.js 22 或更高版本，无需安装依赖：

```bash
node scripts/build-learning-hub.mjs
python3 -m http.server 4174
```

打开 [本地网页](http://127.0.0.1:4174/learning-hub.html)。修改路线、学习方法或资源后重新生成即可。网页仅从 `roadmap.md`、`workflow.md`、`RESOURCES.md` 生成，不读取历史进度，浏览器只保存主题偏好。

[GitHub Pages 工作流](./.github/workflows/pages.yml) 在推送 `main` 时重新生成并发布入口；仓库 Settings → Pages 的 Source 需设为 GitHub Actions。工作流只发布生成页，历史笔记不打包进站点。文档链接指向仓库，CourseX 链接待稳定路由确认后接入。

## 决策与历史

- [产品企划书](./docs/CourseX_React_Learning_Hub_产品企划书.html)：两项目的目标、优先级和验收条件。
- [项目职责与分仓决策](./docs/adr/0001-separate-learning-and-implementation-repositories.md)：指引、知识与实现的存储边界。
- [历史归档说明](./archive/README.md)：旧版路线、流程、笔记、记录、模板与网页快照。
