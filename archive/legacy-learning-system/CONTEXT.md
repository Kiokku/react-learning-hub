# React 18 源码学习

本项目用于建立以 React 18 为实现主线、补充 React 19/19.2 差异的可实现、可解释知识体系，并形成高级前端面试中的 React 专项能力。

## Language

**React 专项面试能力**:
能够结合最小实现，解释 React 18 的核心数据结构、渲染与更新链路、常用 Hooks 和并发机制，并应对相关追问。不代表覆盖高级前端工程师的完整能力模型。
_Avoid_: 高级前端完整面试能力、高级 React 工程师完整能力

**阶段掌握**:
不看课程独立完成该阶段的最小实现，以测试证明关键行为，并能脱离笔记讲清主链路、通过两轮追问。三项缺一不可。
_Avoid_: 看完课程、跟写完成、代码能运行

**学习阶段**:
`roadmap.md` 中围绕一组相关 React 机制组织的课程容器。一个阶段可以包含多个 Lesson，不直接等同于一节课。
_Avoid_: Lesson、单个课程视频

**Lesson**:
一次 `teach` 教学的最小单元，围绕一个可独立练习和验证的 React 机制展开，通常关联一至三节课程视频。
_Avoid_: 学习阶段、课程视频

**阶段验收**:
学习阶段结束后的综合验证，统一执行闭卷最小实现、关键行为测试和两轮模拟面试。通过阶段验收才算达到阶段掌握。
_Avoid_: Lesson 完成、课程看完

**课程范围**:
`roadmap.md` 当前列出的 React 18 机制、课程和面试主题，以及一个 React 19/19.2 差异阶段。React 18 内容要求深度实现；新增版本差异侧重原理、用法、Demo 和面试对比。
_Avoid_: React Hooks 全覆盖、React 19 全量源码实现

**React 19/19.2 差异阶段**:
覆盖 `use`、Actions、`useActionState`、`useOptimistic`、`useFormStatus`、ref 作为 prop、`useEffectEvent`、`<Activity />` 及 React 18/19 面试对比。不覆盖 React Server Components 基础设施、SSR 实现和 React Compiler。
_Avoid_: React 19 全量学习、React 19 源码重写

**理解日**:
一个 60 分钟学习单元，用于课前预测、学习资料、构建主链路、完成 Quiz，并写出后续实现的测试目标。
_Avoid_: 实现日、看完一节视频

**实现日**:
一个最长 90 分钟学习单元，用于先写测试、闭卷实现、对照课程、记录偏差并形成面试表达。
_Avoid_: 理解日、跟写代码

**React Learning Hub**:
学习工作区的 HTML 总览页，展示阶段、Lesson、学习记录和参考资料。仓库文件是唯一数据源，页面不单独维护一份浏览器进度。
_Avoid_: 课程播放器、仅存于 localStorage 的进度页

**学习状态**:
Lesson 在 `未开始 → 理解中 → 实现中 → 已完成` 之间推进。阶段根据 Lesson 聚合为 `未开始、理解中、实现中`；全部 Lesson 完成后进入 `待验收`，只有通过阶段验收才能进入 `已掌握`。
_Avoid_: 已看完、代码已跟写

**学习仓库**:
当前项目，保存 Mission、Roadmap、Lesson、Notes、Learning Record、进度和 React Learning Hub，不承载 mini React 实现源码。
_Avoid_: 实现仓库、课程代码仓库

**实现仓库**:
独立且可公开发布的 mini React 代码仓库，保存实现、测试和公开文档；学习仓库只引用其提交或成果链接。
_Avoid_: 学习仓库、课程配套仓库
