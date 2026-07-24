# 《从0实现 React18》课程顺序学习 Roadmap

## 总目标

以《从0实现 React18》为课程主线，按概念依赖组织学习阶段，并保留原课程编号作为映射。每个机制先理解概念和架构，再尝试自己实现，最后对照课程代码修正理解。目标是达到 React 源码面试可讲清楚的水准，而不是单纯把视频看完。

默认节奏：平均每天 60 分钟、每周 5 天；实现日最长 90 分钟。一个机制级 Lesson 通常包含一个理解日和一个实现日，每个阶段结束后另做阶段验收，不设置固定完成周数。

## 阶段 0：准备与方法建立

### 计划 Lessons

- **S00-L01** 学习系统与课程架构（课程：001「课程介绍」）
- **S00-L02** mini React monorepo 项目架构与开发环境（课程：002「搭建项目架构」）

对应课程：

- 001 课程介绍
- 002 搭建项目架构

重点：

- 定义 mini React 的 monorepo 项目结构。
- 建立 lint、commit、TypeScript 与代码风格规范。
- 选择打包工具，并搭好运行、调试、测试环境。
- 建立固定笔记流程：概念、架构、伪代码、实现差异、面试问答。

完成标准：

- 能说明 monorepo 的目录结构与各项开发规范的目的。
- 能执行 lint、类型检查和代码风格检查，并按约定提交代码。
- 已选定打包工具，且能跑通初始 demo 或测试。

## 阶段 1：JSX 与 ReactElement

### 计划 Lessons

- **S01-L01** JSX 编译结果与 JSX Runtime（课程：003「2-1」实现 JSX、004「2-2」实现 JSX 的打包）
- **S01-L02** ReactElement 数据结构与调试（课程：005「2-3」实现第一种调试方式）
- **S01-L03** JSX 测试方法与行为边界（课程：019「9-1」实现第三种调试方式、020「9-2」测试 JSX）

对应课程：

- 003 「2-1」实现 JSX
- 004 「2-2」实现 JSX 的打包
- 005 「2-3」实现第一种调试方式
- 019 「9-1」实现第三种调试方式
- 020 「9-2」测试 JSX

重点：

- JSX 会被编译为 `jsx/jsxs` 调用。
- ReactElement 保存 `type`、`key`、`ref`、`props`。
- `key` 和 `ref` 不是普通 props。
- 结合 JSX Runtime，初步理解 `react`、`react-dom`、`react-reconciler` 的职责、边界和依赖关系。

实现产出：

- 简化版 JSX runtime。
- ReactElement 测试。

面试输出：

- JSX 到 ReactElement 发生了什么？
- ReactElement 和 Fiber 的区别是什么？
- key/ref 为什么不是普通 props？

## 阶段 2：Reconciler 架构与首次更新入口

### 计划 Lessons

- **S02-L01** Reconciler 职责与 Fiber 根节点模型（课程：006「3」实现 Reconciler 架构）
- **S02-L02** Update Queue 与首次更新入口（课程：007「4-1」实现状态更新机制、008「4-2」接入状态更新机制）

对应课程：

- 006 「3」实现 Reconciler 架构
- 007 「4-1」实现状态更新机制
- 008 「4-2」接入状态更新机制

重点：

- Reconciler 是 React 核心计算层，不等于 DOM 渲染器。
- 理解 FiberNode、FiberRootNode、HostRootFiber、update queue。
- 理解一次更新如何被创建、入队、调度。

面试输出：

- Reconciler 解决什么问题？
- FiberRootNode 和 HostRootFiber 有什么区别？
- setState/useState 更新为什么要进入 update queue？

## 阶段 3：mount 流程与首屏渲染

### 计划 Lessons

- **S03-L01** mount render：beginWork 与 completeWork（课程：009「5-1」实现 mount 流程的 beginWork、010「5-2」实现 mount 流程的 completeWork）
- **S03-L02** commit 与 Mutation 子阶段（课程：011「6-1」实现 commit 阶段、012「6-2」实现 Mutation 子阶段）
- **S03-L03** ReactDOM 接入与首屏链路调试（课程：013「6-3」实现 ReactDOM、014「6-4」调试 ReactDOM）

对应课程：

- 009 「5-1」实现 mount 流程的 beginWork
- 010 「5-2」实现 mount 流程的 completeWork
- 011 「6-1」实现 commit 阶段
- 012 「6-2」实现 Mutation 子阶段
- 013 「6-3」实现 ReactDOM
- 014 「6-4」调试 ReactDOM

重点：

- 主链路：`beginWork -> completeWork -> commitRoot`。
- render 阶段创建 Fiber 工作结果和 flags。
- commit 阶段执行宿主环境操作。

实现产出：

- ReactElement 到真实 DOM 的首屏渲染。

面试输出：

- render 阶段和 commit 阶段分别做什么？
- 为什么 completeWork 阶段适合创建 DOM？
- Mutation 子阶段做什么？

## 阶段 4：FunctionComponent 与 Hooks 基础

### 计划 Lessons

- **S04-L01** FunctionComponent 执行模型（课程：015「7-1」实现 FunctionComponent、016「7-2」实现第二种调试方式）
- **S04-L02** Hook 链表与 mountState（课程：017「8-1」实现 Hooks 架构、018「8-2」实现 useState）

对应课程：

- 015 「7-1」实现 FunctionComponent
- 016 「7-2」实现第二种调试方式
- 017 「8-1」实现 Hooks 架构
- 018 「8-2」实现 useState

重点：

- 函数组件本质是执行函数得到 children。
- Hook 状态存储在 Fiber 的 Hook 链表上，不存在函数闭包里。
- 理解当前渲染中的 Hook 指针。

实现产出：

- mount 阶段的 `useState`。

面试输出：

- 函数组件重新执行后状态为什么不会丢？
- Hooks 为什么不能写在条件语句里？
- useState 返回的 dispatch 和 Fiber 有什么关系？

## 阶段 5：update 流程与 useState 更新

### 计划 Lessons

- **S05-L01** 双缓存树与 update render（课程：021「10-1」update 流程 render 阶段）
- **S05-L02** update commit 与宿主变更（课程：022「10-2」update 流程 commit 阶段）
- **S05-L03** Hook Queue 与 useState 状态计算（课程：023「10-3」update 流程处理 useState）

对应课程：

- 021 「10-1」update 流程 render 阶段
- 022 「10-2」update 流程 commit 阶段
- 023 「10-3」update 流程处理 useState

重点：

- mount 和 update 会走不同路径。
- 理解 current tree、workInProgress tree、alternate。
- 处理 Hook queue 并计算新 state。

面试输出：

- React 为什么需要双缓存 Fiber 树？
- mountState 和 updateState 有什么区别？
- 多次 state update 如何计算最终状态？

## 阶段 6：事件系统

### 计划 Lessons

- **S06-L01** 事件委托、收集、派发与更新入口（课程：024「11」实现事件系统）

对应课程：

- 024 「11」实现事件系统

重点：

- React 事件不是简单包一层 `addEventListener`。
- 理解事件注册、收集、派发、合成事件基础。
- 理解事件如何连接更新流程。

面试输出：

- React 事件系统为什么要做统一封装？
- 事件触发后如何进入更新流程？
- React 17/18 事件委托位置变化是什么？

## 阶段 7：Diff 与 Fragment

### 计划 Lessons

- **S07-L01** 单节点 Diff 与复用条件（课程：025「12-1」实现单节点 Diff）
- **S07-L02** 多节点 Diff、key 与移动（课程：026「12-2」实现多节点 Diff）
- **S07-L03** Diff Commit 与 Fragment（课程：027「12-3」Diff 算法处理 commit 阶段、028「13」实现 Fragment）

对应课程：

- 025 「12-1」实现单节点 Diff
- 026 「12-2」实现多节点 Diff
- 027 「12-3」Diff 算法处理 commit 阶段
- 028 「13」实现 Fragment

重点：

- 单节点 diff、多节点 diff、key、移动、删除、flags。
- Diff 结果会在 commit 阶段变成 DOM 操作。
- Fragment 不产生额外 DOM，但参与 Fiber 结构。

面试输出：

- React Diff 为什么不是完整树编辑距离？
- key 的真实作用是什么？
- 为什么 index 作为 key 会导致状态错乱？
- Fragment 在 Fiber 中如何表达？

## 阶段 8：批处理、Lane 与调度

### 计划 Lessons

- **S08-L01** 批处理语义与 Lane 模型（课程：029「14-1」批处理的概念、030「14-2」实现 Lane 模型）
- **S08-L02** 调度阶段与更新流程改造（课程：031「14-3」实现调度阶段、032「14-4」改造更新流程）

对应课程：

- 029 「14-1」批处理的概念
- 030 「14-2」实现 Lane 模型
- 031 「14-3」实现调度阶段
- 032 「14-4」改造更新流程

重点：

- batch 控制的是更新时机和优先级，不只是合并 setState。
- Lane 用于表达更新优先级。
- 调度阶段负责选择下一次要执行的工作。

面试输出：

- React 18 automatic batching 是什么？
- Lane 解决什么问题？
- 高低优先级更新为什么需要区分？
- 调度阶段和 render 阶段是什么关系？

## 阶段 9：useEffect 与测试渲染器

### 计划 Lessons

- **S09-L01** Effect 数据结构与执行流程（课程：033「15-1」实现 useEffect 数据结构、034「15-2」实现 useEffect 工作流程）
- **S09-L02** Noop Renderer 与渲染器抽象（课程：035「16-1」实现 noop-renderer、036「16-2」打包 noop-renderer）
- **S09-L03** useEffect 行为测试（课程：037「16-3」测试 useEffect）

对应课程：

- 033 「15-1」实现 useEffect 数据结构
- 034 「15-2」实现 useEffect 工作流程
- 035 「16-1」实现 noop-renderer
- 036 「16-2」打包 noop-renderer
- 037 「16-3」测试 useEffect

重点：

- effect 链表、依赖数组、cleanup、passive effect 执行时机。
- `useEffect` 和 `useLayoutEffect` 的差异。
- noop-renderer 可以脱离 DOM 测试 Reconciler 行为。

面试输出：

- useEffect 为什么不是 render 阶段执行？
- cleanup 什么时候执行？
- 依赖数组比较如何影响 effect 执行？
- 为什么 React 需要 renderer 抽象？

## 阶段 10：并发更新与 useTransition

### 计划 Lessons

- **S10-L01** 同步渲染与并发渲染对照（课程：038「17-1」实现同步更新 Demo、039「17-2」实现并发更新 Demo）
- **S10-L02** 并发交互与调度策略（课程：040「18-1」实现并发更新的交互部分、041「18-2」实现并发更新的策略逻辑）
- **S10-L03** 并发状态计算与更新重放（课程：042「18-3」实现并发更新的状态计算）
- **S10-L04** useTransition 原理与实现（课程：043「19-1」useTransition 的作用、044「19-2」实现 useTransition）

对应课程：

- 038 「17-1」实现同步更新 Demo
- 039 「17-2」实现并发更新 Demo
- 040 「18-1」实现并发更新的交互部分
- 041 「18-2」实现并发更新的策略逻辑
- 042 「18-3」实现并发更新的状态计算
- 043 「19-1」useTransition 的作用
- 044 「19-2」实现 useTransition

重点：

- 并发渲染提升响应性，但不是多线程。
- 渲染可以被中断、恢复，并按优先级推进。
- transition 会降低非紧急更新的优先级。

面试输出：

- Concurrent Rendering 解决什么问题？
- startTransition/useTransition 的使用场景是什么？
- 为什么并发更新可能出现状态计算复杂度？
- React 如何避免低优先级更新阻塞高优先级交互？

## 阶段 11：useRef 与 Context

### 计划 Lessons

- **S11-L01** useRef 的稳定可变容器（课程：045「20」实现 useRef）
- **S11-L02** Context 数据结构与传播（课程：046「21-1」实现 Context 数据结构、047「21-2」实现 Context 逻辑）
- **S11-L03** useContext 与 Fiber 遍历（课程：048「21-3」实现 useContext）

对应课程：

- 045 「20」实现 useRef
- 046 「21-1」实现 Context 数据结构
- 047 「21-2」实现 Context 逻辑
- 048 「21-3」实现 useContext

重点：

- ref 是稳定可变容器，不触发渲染。
- Context 的 Provider/Consumer 数据流。
- Context 更新与子树传播。

面试输出：

- useRef 和 useState 的区别是什么？
- Context 为什么可能导致性能问题？
- useContext 如何和 Fiber 树遍历关联？

## 阶段 12：Suspense 与 use

### 计划 Lessons

- **S12-L01** Suspense 的问题边界与实现思路（课程：049「22-1」Suspense 的作用、050「22-2」Suspense 的实现思路）
- **S12-L02** Suspense 工作流与触发方式（课程：051「22-3」实现 Suspense 工作流程、052「22-4」如何触发 Suspense？）
- **S12-L03** use、Thenable 与 unwind（课程：053「22-5」实现试验性 hook —— use、054「22-6」实现 unwind 流程）
- **S12-L04** Suspense 完整链路（课程：055「22-7」完善 Suspense）

对应课程：

- 049 「22-1」Suspense 的作用
- 050 「22-2」Suspense 的实现思路
- 051 「22-3」实现 Suspense 工作流程
- 052 「22-4」如何触发 Suspense？
- 053 「22-5」实现试验性 hook —— use
- 054 「22-6」实现 unwind 流程
- 055 「22-7」完善 Suspense

重点：

- Suspense 是渲染过程中处理未完成数据的控制流，不只是 loading 组件。
- 理解 throw promise、fallback、边界捕获、unwind。
- `use` 作为 React 19 相关加分知识理解即可。

面试输出：

- Suspense 解决什么问题？
- 为什么 Suspense 可以通过 throw promise 触发？
- unwind 流程做什么？
- use 和传统 useEffect 请求数据有什么区别？

## 阶段 13：性能优化策略

### 计划 Lessons

- **S13-L01** 性能成本模型与优化策略（课程：056「23-1」性能优化的一般思路、057「23-2」性能优化策略简介）
- **S13-L02** Bailout 条件与子树复用（课程：058「23-3」实现 bailout 策略（上）、059「23-4」实现 bailout 策略（下））
- **S13-L03** eagerState 与提前跳过调度（课程：060「23-5」实现 eagerState 策略）
- **S13-L04** React.memo、useMemo 与 useCallback（课程：061「23-6」实现 React.memo、062「23-7」实现 useMemo、useCallback）
- **S13-L05** Context 与 Bailout 协作（课程：063「23-8」context 兼容 bailout 策略）

对应课程：

- 056 「23-1」性能优化的一般思路
- 057 「23-2」性能优化策略简介
- 058 「23-3」实现 bailout 策略（上）
- 059 「23-4」实现 bailout 策略（下）
- 060 「23-5」实现 eagerState 策略
- 061 「23-6」实现 React.memo
- 062 「23-7」实现 useMemo、useCallback
- 063 「23-8」context 兼容 bailout 策略

重点：

- 优化的本质是减少无效 render、无效 commit 和不必要的子树遍历。
- 理解 bailout、eagerState、React.memo、useMemo、useCallback 的源码动机。
- 理解 Context 为什么会和 bailout 冲突。

面试输出：

- React.memo 为什么有时无效？
- useMemo/useCallback 优化的到底是什么？
- eagerState 为什么可以减少一次调度？
- bailout 依赖哪些条件？
- Context 更新为什么容易穿透 memo？

## 阶段 14：React 19/19.2 关键差异

### 计划 Lessons

- **S14-L01** use 与 Suspense 数据读取（来源：React 19 官方文档）
- **S14-L02** Actions 与 useActionState（来源：React 19 官方文档）
- **S14-L03** useOptimistic 与 useFormStatus（来源：React 19 官方文档）
- **S14-L04** ref 作为 prop（来源：React 19 官方文档）
- **S14-L05** useEffectEvent 与 Activity（来源：React 19.2 官方文档）
- **S14-L06** React 18、19 与 19.2 面试对比（来源：阶段 0 至阶段 14）

重点：

- `use` 与 Suspense 数据读取。
- Actions、`useActionState`、`useOptimistic`、`useFormStatus`。
- ref 作为普通 prop。
- `useEffectEvent` 与 `<Activity />`。
- React 18 与 React 19/19.2 的关键面试对比。

学习产出：

- 每项能力的最小用法 Demo。
- React 18/19/19.2 差异表。
- 对应的面试回答与追问记录。

边界：

- 不要求在 `mini-react18` 中实现这些新增 API。
- 不覆盖 React Server Components 基础设施、SSR 实现和 React Compiler。

## 阶段 15：总复盘与面试化

### 计划 Lessons

- **S15-L01** 五条核心链路闭卷重建（来源：阶段 1 至阶段 13）
- **S15-L02** mini React 集成测试与公开说明（来源：mini-react18）
- **S15-L03** React 专项模拟面试与答案修订（来源：面试题库）

核心链路：

- `JSX -> ReactElement -> Fiber`
- `createRoot/render -> scheduleUpdate -> renderRoot`
- `beginWork -> completeWork -> commitRoot`
- `useState dispatch -> update queue -> render -> commit`
- `Lane/Scheduler -> concurrent render -> transition`

最终产出：

- 一个可运行的 mini React 项目。
- 主要链路流程图。
- 30-50 道面试题，包含 1 分钟版、3 分钟版、追问版答案。
- 一份能写进简历的项目说明，重点表达你实现过哪些 React18 核心机制。
