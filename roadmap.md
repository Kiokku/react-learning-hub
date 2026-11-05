# React 设计问题与源码学习路线

以 React 18 为实现主线，保留 16 个阶段、49 个稳定机制索引和原课程映射；React 19/19.2 作为补充。每个主题围绕问题、机制、依赖、课程、实验与材料组织，按 [四步法](./workflow.md) 在 CourseX 章节画布中探索，不在此维护个人进度。

课程可以替换，一个机制可以关联多个章节。下列课程编号来自原路线，不是 CourseX 的路由 ID；稳定深链接尚待核查，先按章节名进入。S01-L01 对应 003「2-1」与 004「2-2」，CourseX 显示为 02-01 与 02-02。

问题与实验是探索建议，答案需用实际版本与证据核对。前置依赖表达知识关系，不是完成状态或入学门槛；可以在发现理解缺口时回访。React 19/19.2 不要求在 mini React 中重写新增 API，也不扩展到 RSC 基础设施、SSR 实现或 React Compiler。

阶段 0 保留准备主题并增加 CourseX 使用方法；阶段 15 转向链路整合与解释。S14-L06、S15-L03 的旧面试主题扩展为版本解释和理解修订，原面试用途作为可选练习保留；ID 和来源映射不变。旧名称与历史记录见 [归档路线](./archive/legacy-learning-system/roadmap.md)。

## 阶段 0：准备与方法建立

### S00-L01 · 学习系统与课程架构

- 核心问题：怎样让课程、问题和实验围绕同一次探索组织？
- 关键机制：机制索引、课程章节与章节画布的职责。
- 前置依赖：无。
- 课程：001「课程介绍」。
- 建议实验：在 CourseX 找到 JSX 章节及其画板，写一个问题并回访，确认内容能找回。
- 延伸材料：[CourseX 学习方法](./workflow.md)、[课程与配套实现](./RESOURCES.md)。

### S00-L02 · mini React monorepo 项目架构与开发环境

- 核心问题：怎样搭建能独立验证 React 机制的最小环境？
- 关键机制：monorepo 包边界、lint、类型检查、测试与打包。
- 前置依赖：S00-L01。
- 课程：002「搭建项目架构」。
- 建议实验：运行一个最小 Demo 和测试，分别制造类型、风格和测试错误，观察各工具的职责。
- 延伸材料：[CourseX 学习方法](./workflow.md)、[课程与配套实现](./RESOURCES.md)。

## 阶段 1：JSX 与 ReactElement

### S01-L01 · JSX 编译结果与 JSX Runtime

- 核心问题：为什么 JSX 先被编译为调用，再产生 UI 描述？
- 关键机制：自动 JSX Runtime、jsx/jsxs 与 createElement 的参数协议。
- 前置依赖：S00-L02。
- 课程：003「2-1」实现 JSX、004「2-2」实现 JSX 的打包。
- 建议实验：比较单子节点、多子节点和 key 的编译结果，独立实现最小 Runtime 并断言输出。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S01-L02 · ReactElement 数据结构与调试

- 核心问题：ReactElement、Fiber 与 DOM 分别承担什么职责？
- 关键机制：type/key/ref/props、元素身份、Runtime 与渲染边界（React 18）。
- 前置依赖：S01-L01。
- 课程：005「2-3」实现第一种调试方式。
- 建议实验：检查元素对象与宿主 DOM 的差别，用课程第一种调试方式观察输出；不提前引入后续渲染器。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 2：Reconciler 架构与首次更新入口

### S02-L01 · Reconciler 职责与 Fiber 根节点模型

- 核心问题：为什么需要独立于宿主环境的协调层？
- 关键机制：FiberNode、FiberRootNode、HostRootFiber 与 renderer 边界。
- 前置依赖：S01-L02。
- 课程：006「3」实现 Reconciler 架构。
- 建议实验：画出三个根相关对象的关系，在最小数据结构中标出宿主容器和工作树入口。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S02-L02 · Update Queue 与首次更新入口

- 核心问题：为什么更新需要排队，而不是直接修改屏幕？
- 关键机制：Update、UpdateQueue、更新入队与首次更新入口。
- 前置依赖：S02-L01。
- 课程：007「4-1」实现状态更新机制、008「4-2」接入状态更新机制。
- 建议实验：构造两次更新，预测队列计算结果，再用测试验证更新顺序。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 3：mount 流程与首屏渲染

### S03-L01 · mount render：beginWork 与 completeWork

- 核心问题：如何把一次树计算分解为可逐步推进的工作？
- 关键机制：beginWork、completeWork 与 Fiber 遍历。
- 前置依赖：S02-L02。
- 课程：009「5-1」实现 mount 流程的 beginWork、010「5-2」实现 mount 流程的 completeWork。
- 建议实验：对一棵小树记录进入与完成节点的顺序，解释每一步的数据变化。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S03-L02 · commit 与 Mutation 子阶段

- 核心问题：为什么计算 UI 与执行宿主变更要分开？
- 关键机制：render/commit、flags 与 Mutation 子阶段。
- 前置依赖：S03-L01。
- 课程：011「6-1」实现 commit 阶段、012「6-2」实现 Mutation 子阶段。
- 建议实验：对比 render 前后与 commit 后的容器，追踪一个插入标记如何变为宿主操作。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S03-L03 · ReactDOM 接入与首屏链路调试

- 核心问题：从 render 入口到首屏，哪些层各自负责什么？
- 关键机制：ReactDOM 接入、宿主配置与首次渲染链路。
- 前置依赖：S03-L02。
- 课程：013「6-3」实现 ReactDOM、014「6-4」调试 ReactDOM。
- 建议实验：运行最小首屏 Demo，从入口追踪到 DOM 插入，给关键边界留断点。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 4：FunctionComponent、Hooks 与 JSX 测试

### S04-L01 · FunctionComponent 执行模型

- 核心问题：函数执行得到的 children 如何进入协调过程？
- 关键机制：FunctionComponent、组件执行与第二种调试方式。
- 前置依赖：S03-L03。
- 课程：015「7-1」实现 FunctionComponent、016「7-2」实现第二种调试方式。
- 建议实验：组合函数组件和宿主节点，观察函数返回值如何成为待处理子节点。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S04-L02 · Hook 链表与 mountState

- 核心问题：函数反复执行时，状态为什么仍能关联到原组件？
- 关键机制：Hook 链表、当前 Hook 指针、mountState 与 dispatch。
- 前置依赖：S04-L01。
- 课程：017「8-1」实现 Hooks 架构、018「8-2」实现 useState。
- 建议实验：建立含两个 useState 的组件，画出 Hook 与 Fiber 的关联并预测顺序变化的影响。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S04-L03 · JSX 调试与回归测试

- 核心问题：如何用行为证据证明 JSX Runtime 的边界？
- 关键机制：第三种调试方式与 JSX 回归测试。
- 前置依赖：S04-L02。
- 课程：019「9-1」实现第三种调试方式、020「9-2」测试 JSX。
- 建议实验：在已有首屏链路上测试 key、children 与元素创建，区分对象断言和真实渲染断言。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 5：update 流程与 useState 更新

### S05-L01 · 双缓存树与 update render

- 核心问题：更新时为什么保留两棵关联的工作树？
- 关键机制：current、workInProgress、alternate 与 update render。
- 前置依赖：S04-L03。
- 课程：021「10-1」update 流程 render 阶段。
- 建议实验：追踪连续两次更新的对象身份，画出新旧树在 render 与 commit 前后的关系。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S05-L02 · update commit 与宿主变更

- 核心问题：如何把更新计算结果变成必要的宿主变更？
- 关键机制：update commit、宿主属性与文本更新。
- 前置依赖：S05-L01。
- 课程：022「10-2」update 流程 commit 阶段。
- 建议实验：只改变文本或一个属性，记录实际宿主操作，与全量重建作对比。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S05-L03 · Hook Queue 与 useState 状态计算

- 核心问题：多次状态更新按什么顺序得到最终结果？
- 关键机制：Hook Queue、函数式更新与 updateState。
- 前置依赖：S05-L02。
- 课程：023「10-3」update 流程处理 useState。
- 建议实验：对比值更新和函数式更新序列，先预测结果再验证状态计算。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 6：事件系统

### S06-L01 · 事件委托、收集、派发与更新入口

- 核心问题：统一事件层给 React 更新机制带来什么能力与成本？
- 关键机制：事件委托、收集、派发、合成事件与更新入口。
- 前置依赖：S05-L03。
- 课程：024「11」实现事件系统。
- 建议实验：构造嵌套点击，观察传播和触发更新的链路；核对 React 17/18 的委托位置。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 7：Diff 与 Fragment

### S07-L01 · 单节点 Diff 与复用条件

- 核心问题：一个旧节点在什么条件下可以被复用？
- 关键机制：单节点比较、type/key、复用与删除标记。
- 前置依赖：S06-L01。
- 课程：025「12-1」实现单节点 Diff。
- 建议实验：分别改变 type 与 key，观察节点身份和状态是否保留。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S07-L02 · 多节点 Diff、key 与移动

- 核心问题：列表重排为什么需要稳定身份？
- 关键机制：多节点 Diff、key、移动与删除。
- 前置依赖：S07-L01。
- 课程：026「12-2」实现多节点 Diff。
- 建议实验：对含状态的列表执行插入、删除、重排，对比稳定 key 与索引 key 的行为。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S07-L03 · Diff Commit 与 Fragment

- 核心问题：没有额外 DOM 的分组怎样参与协调和提交？
- 关键机制：Fragment、Diff flags 与 commit。
- 前置依赖：S07-L02。
- 课程：027「12-3」Diff 算法处理 commit 阶段、028「13」实现 Fragment。
- 建议实验：重排嵌套 Fragment，追踪 Fiber 变化、宿主顺序与实际移动操作。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 8：批处理、Lane 与调度

### S08-L01 · 批处理语义与 Lane 模型

- 核心问题：为什么同一批更新还需要区分优先级？
- 关键机制：批处理语义、Lane 与更新选择。
- 前置依赖：S07-L03。
- 课程：029「14-1」批处理的概念、030「14-2」实现 Lane 模型。
- 建议实验：比较一组更新的提交次数与优先级选择，区分批处理和状态计算。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S08-L02 · 调度阶段与更新流程改造

- 核心问题：什么时候执行哪一份工作，由谁决定？
- 关键机制：调度入口、Lane 选择与更新流程衔接。
- 前置依赖：S08-L01。
- 课程：031「14-3」实现调度阶段、032「14-4」改造更新流程。
- 建议实验：构造不同优先级的待处理更新，记录调度选择与进入 render 的顺序。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 9：useEffect 与测试渲染器

### S09-L01 · Effect 数据结构与执行流程

- 核心问题：为什么副作用与清理需要独立的执行模型？
- 关键机制：Effect 链表、依赖比较、cleanup 与 passive effect。
- 前置依赖：S08-L02。
- 课程：033「15-1」实现 useEffect 数据结构、034「15-2」实现 useEffect 工作流程。
- 建议实验：分别记录 mount、依赖改变和卸载的副作用日志，与 useLayoutEffect 时机作对比。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S09-L02 · Noop Renderer 与渲染器抽象

- 核心问题：如何脱离浏览器验证协调层的行为？
- 关键机制：宿主抽象、Noop Renderer 与打包。
- 前置依赖：S09-L01。
- 课程：035「16-1」实现 noop-renderer、036「16-2」打包 noop-renderer。
- 建议实验：把相同组件送入 noop-renderer，检查输出树而非 DOM。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S09-L03 · useEffect 行为测试

- 核心问题：哪些实验能发现 Effect 的时序或清理错误？
- 关键机制：Effect 行为测试、依赖数组与卸载。
- 前置依赖：S09-L02。
- 课程：037「16-3」测试 useEffect。
- 建议实验：用日志断言依赖不变、改变、卸载时的 setup/cleanup 次序，并标明运行模式。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 10：并发更新与 useTransition

### S10-L01 · 同步渲染与并发渲染对照

- 核心问题：同步计算与可中断计算怎样影响交互响应？
- 关键机制：同步更新、并发渲染与响应性。
- 前置依赖：S09-L03。
- 课程：038「17-1」实现同步更新 Demo、039「17-2」实现并发更新 Demo。
- 建议实验：运行课程两种更新 Demo，记录输入响应与渲染推进，区分并发与多线程。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S10-L02 · 并发交互与调度策略

- 核心问题：新交互到来时，未完成的渲染应怎样处理？
- 关键机制：并发交互、让出执行与调度策略。
- 前置依赖：S10-L01。
- 课程：040「18-1」实现并发更新的交互部分、041「18-2」实现并发更新的策略逻辑。
- 建议实验：在较重渲染中触发新输入，观察工作让出和重新选择的过程。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S10-L03 · 并发状态计算与更新重放

- 核心问题：跳过部分更新后，怎样保证后续状态计算一致？
- 关键机制：优先级跳过、状态基线与更新重放。
- 前置依赖：S10-L02。
- 课程：042「18-3」实现并发更新的状态计算。
- 建议实验：交错两种优先级更新，手算状态序列，再对照执行结果。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S10-L04 · useTransition 原理与实现

- 核心问题：怎样表达可延后的 UI 更新，同时保持交互可用？
- 关键机制：startTransition、useTransition 与 pending。
- 前置依赖：S10-L03。
- 课程：043「19-1」useTransition 的作用、044「19-2」实现 useTransition。
- 建议实验：把紧急输入与较重结果更新分开，观察 pending 和输入体验；记录使用边界。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 11：useRef 与 Context

### S11-L01 · useRef 的稳定可变容器

- 核心问题：什么时候需要可变容器，而不是触发渲染的状态？
- 关键机制：useRef、对象身份与可变值。
- 前置依赖：S10-L04。
- 课程：045「20」实现 useRef。
- 建议实验：在重渲染之间比较 ref 身份，改变 ref.current 后观察是否触发更新。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S11-L02 · Context 数据结构与传播

- 核心问题：跨层数据如何沿组件树提供与恢复？
- 关键机制：Context、Provider、值栈与传播。
- 前置依赖：S11-L01。
- 课程：046「21-1」实现 Context 数据结构、047「21-2」实现 Context 逻辑。
- 建议实验：嵌套同一 Context 的 Provider，观察不同子树读取值的范围。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S11-L03 · useContext 与 Fiber 遍历

- 核心问题：Context 读取怎样建立与更新传播的联系？
- 关键机制：useContext、消费依赖与 Fiber 遍历。
- 前置依赖：S11-L02。
- 课程：048「21-3」实现 useContext。
- 建议实验：改变 Provider 值并记录消费者行为，解释读取和传播所需的数据。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 12：Suspense 与 use

### S12-L01 · Suspense 的问题边界与实现思路

- 核心问题：如何表达某棵子树暂时无法完成渲染？
- 关键机制：Suspense 边界、未完成数据与 fallback。
- 前置依赖：S11-L03。
- 课程：049「22-1」Suspense 的作用、050「22-2」Suspense 的实现思路。
- 建议实验：为延迟资源画出 pending、fallback、重试与完成的概念路径，标出课程简化。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S12-L02 · Suspense 工作流与触发方式

- 核心问题：暂停信号如何找到合适的边界？
- 关键机制：Suspense 触发、边界捕获与重试入口。
- 前置依赖：S12-L01。
- 课程：051「22-3」实现 Suspense 工作流程、052「22-4」如何触发 Suspense？。
- 建议实验：用受控 Thenable 触发课程演示，观察最近边界和 fallback 选择。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S12-L03 · use、Thenable 与 unwind

- 核心问题：渲染读取未完成资源后，如何撤回未完成的工作？
- 关键机制：课程试验性 use、Thenable、unwind 与状态恢复。
- 前置依赖：S12-L02。
- 课程：053「22-5」实现试验性 hook —— use、054「22-6」实现 unwind 流程。
- 建议实验：追踪一次暂停后的回退与环境恢复；课程 use 不是 React 18 稳定 API，另对照 S14-L01。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S12-L04 · Suspense 完整链路

- 核心问题：资源完成后，如何从 fallback 回到内容？
- 关键机制：Suspense 完整链路与重新调度。
- 前置依赖：S12-L03。
- 课程：055「22-7」完善 Suspense。
- 建议实验：控制资源完成时机，验证 fallback 到内容的切换并追踪重新渲染。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 13：性能优化策略

### S13-L01 · 性能成本模型与优化策略

- 核心问题：真正昂贵的是哪一段工作，如何证明优化有效？
- 关键机制：render/commit 成本、测量与优化边界。
- 前置依赖：S12-L04。
- 课程：056「23-1」性能优化的一般思路、057「23-2」性能优化策略简介。
- 建议实验：为一个具体场景记录优化前后的执行次数或耗时，先确认瓶颈再修改。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S13-L02 · Bailout 条件与子树复用

- 核心问题：什么情况下可以跳过计算，又不能漏掉子树更新？
- 关键机制：bailout、props、更新优先级与子树复用。
- 前置依赖：S13-L01。
- 课程：058「23-3」实现 bailout 策略（上）、059「23-4」实现 bailout 策略（下）。
- 建议实验：构造父级无变化而子级有待处理更新的场景，验证跳过边界。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S13-L03 · eagerState 与提前跳过调度

- 核心问题：能否在调度前就发现某次状态更新没有必要？
- 关键机制：eagerState、状态比较与调度短路。
- 前置依赖：S13-L02。
- 课程：060「23-5」实现 eagerState 策略。
- 建议实验：比较相同状态更新和不同状态更新的调度记录，说明优化成立的前提。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S13-L04 · React.memo、useMemo 与 useCallback

- 核心问题：缓存与浅比较什么时候节省成本，什么时候失效？
- 关键机制：React.memo、useMemo、useCallback 与依赖身份。
- 前置依赖：S13-L03。
- 课程：061「23-6」实现 React.memo、062「23-7」实现 useMemo、useCallback。
- 建议实验：分别稳定和改变对象、函数与依赖，观察缓存命中及组件执行情况。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

### S13-L05 · Context 与 Bailout 协作

- 核心问题：Context 变化为什么不能被普通跳过条件掩盖？
- 关键机制：Context 依赖、传播与 bailout 协作。
- 前置依赖：S13-L04。
- 课程：063「23-8」context 兼容 bailout 策略。
- 建议实验：在 memo 子树中更新 Context，验证消费者得到新值并解释传播路径。
- 延伸材料：[React 18 源码 v18.2.0](https://github.com/facebook/react/tree/v18.2.0)、[React 18 文档](https://18.react.dev/)、[课程配套实现与来源说明](./RESOURCES.md)。

## 阶段 14：React 19/19.2 关键差异

### S14-L01 · use 与 Suspense 数据读取

- 核心问题：稳定版 use 的读取规则与课程试验实现有什么差别？
- 关键机制：React 19 use、Promise、Context 与 Suspense。
- 前置依赖：S12-L04。
- 来源：React 19 官方文档。
- 建议实验：在指定 React 19 版本做最小读取 Demo，与课程 use 的适用条件作对照。
- 延伸材料：[React 官方 API Reference](https://react.dev/reference/react)、[React 19.2 发布说明](https://react.dev/blog/2025/10/01/react-19-2)；使用对应版本核对。

### S14-L02 · Actions 与 useActionState

- 核心问题：异步操作及其结果如何进入 UI 的状态表达？
- 关键机制：Actions、useActionState 与异步状态。
- 前置依赖：S14-L01。
- 来源：React 19 官方文档。
- 建议实验：运行成功和失败两个最小操作，观察 pending、结果与错误处理。
- 延伸材料：[React 官方 API Reference](https://react.dev/reference/react)、[React 19.2 发布说明](https://react.dev/blog/2025/10/01/react-19-2)；使用对应版本核对。

### S14-L03 · useOptimistic 与 useFormStatus

- 核心问题：乐观反馈与提交状态分别解决什么问题？
- 关键机制：useOptimistic、useFormStatus 与表单边界。
- 前置依赖：S14-L02。
- 来源：React 19 官方文档。
- 建议实验：在指定版本中模拟操作成功和失败，观察乐观显示与表单提交状态。
- 延伸材料：[React 官方 API Reference](https://react.dev/reference/react)、[React 19.2 发布说明](https://react.dev/blog/2025/10/01/react-19-2)；使用对应版本核对。

### S14-L04 · ref 作为 prop

- 核心问题：ref 作为 prop 后，组件边界与旧代码如何衔接？
- 关键机制：React 19 ref 传递与 React 18 对比。
- 前置依赖：S14-L03。
- 来源：React 19 官方文档。
- 建议实验：比较 React 18 与 19 的 ref 用法，记录版本和最小迁移差异。
- 延伸材料：[React 官方 API Reference](https://react.dev/reference/react)、[React 19.2 发布说明](https://react.dev/blog/2025/10/01/react-19-2)；使用对应版本核对。

### S14-L05 · useEffectEvent 与 Activity

- 核心问题：如何分别理解 Effect 事件与界面活动状态的边界？
- 关键机制：React 19.2 useEffectEvent 与 Activity。
- 前置依赖：S14-L04。
- 来源：React 19.2 官方文档。
- 建议实验：各做一个官方用法的最小 Demo，记录依赖限制以及隐藏、恢复的可观察行为。
- 延伸材料：[React 官方 API Reference](https://react.dev/reference/react)、[React 19.2 发布说明](https://react.dev/blog/2025/10/01/react-19-2)；使用对应版本核对。

### S14-L06 · React 18、19 与 19.2 版本边界对比

- 核心问题：哪些理解来自 React 18，哪些只在后续版本成立？
- 关键机制：React 18/19/19.2 版本边界与迁移解释。
- 前置依赖：S14-L05。
- 来源：阶段 0 至阶段 14。
- 建议实验：针对一个易混淆行为在指定版本复现，给结论附版本与实验依据。
- 延伸材料：[React 官方 API Reference](https://react.dev/reference/react)、[React 19.2 发布说明](https://react.dev/blog/2025/10/01/react-19-2)；使用对应版本核对。

## 阶段 15：总复盘与机制解释

### S15-L01 · 五条核心链路闭卷重建

- 核心问题：能否把分散的机制连成完整的运行解释？
- 关键机制：JSX→Element→Fiber、更新入口、render/commit、Hook Queue 与调度。
- 前置依赖：S13-L05、S14-L06。
- 来源：阶段 1 至阶段 13。
- 建议实验：脱离课件重建五条核心链路，挑一条用执行日志核对关键连接。
- 延伸材料：[mini-react18](https://github.com/Kiokku/mini-react18)、[学习与图解审稿](./workflow.md)；原[面试题库](./archive/legacy-learning-system/interview-question-bank.md)仅作可选解释练习。

### S15-L02 · mini React 集成测试与公开说明

- 核心问题：怎样证明 mini React 的主要机制能够协作？
- 关键机制：集成测试、能力边界与公开实现说明。
- 前置依赖：S15-L01。
- 来源：mini-react18。
- 建议实验：运行跨机制集成用例，写明支持与省略的行为，并链接具体测试。
- 延伸材料：[mini-react18](https://github.com/Kiokku/mini-react18)、[学习与图解审稿](./workflow.md)；原[面试题库](./archive/legacy-learning-system/interview-question-bank.md)仅作可选解释练习。

### S15-L03 · React 专项解释与理解修订

- 核心问题：自己的解释能否经受反例，并帮助别人建立正确模型？
- 关键机制：机制解释、设计权衡与理解修订；面试练习可选。
- 前置依赖：S15-L02。
- 来源：面试题库。
- 建议实验：选一个机制做解释练习，由他人或 AI 寻找反例，修正结论；按需标记教学候选。
- 延伸材料：[mini-react18](https://github.com/Kiokku/mini-react18)、[学习与图解审稿](./workflow.md)；原[面试题库](./archive/legacy-learning-system/interview-question-bank.md)仅作可选解释练习。
