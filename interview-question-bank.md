# 面试题库

这是一个持续维护的文档。完成相关阶段后再补答案。

## 阶段 0：工程配置与学习方法

### 为什么这个 mini React 项目适合使用 monorepo？

后续会有 `react`、`react-dom`、`react-reconciler`、scheduler 等独立包，公共逻辑可以沉淀到 shared 包。monorepo 让这些包共享同一份源码、类型规则和构建规范，并通过 workspace 依赖在本地联调；修改 shared 后，不需要先发布临时版本就能验证下游包。

追问：`peerDependencies` 为什么不是 monorepo 本地联调机制？

`peerDependencies` 约束发布后的宿主项目应提供哪一份依赖；workspace 依赖才把工作区中的包链接到本地最新源码，用于开发期联调。

### lint、tsc、代码风格与 commit 规范各防止什么问题？

- lint：发现未使用变量、危险写法和违反静态规则的代码。
- `tsc`：发现类型不匹配、错误的参数或返回值等类型错误。
- 代码风格：统一缩进、引号、分号等可读性约定；本项目由 ESLint 承担，不单独使用 Prettier。
- commit 规范：通过 pre-commit 运行质量检查，通过 commit-msg 和 commitlint 约束提交信息格式。

追问：为什么有 `tsc` 仍需要 lint？

类型检查不覆盖全部代码质量规则。例如当前 TypeScript 配置没有启用 `noUnusedLocals`，但 ESLint 可以发现未使用变量；lint 还负责项目约定和部分危险写法。

追问：`git commit --no-verify` 有什么影响？

它会绕过本地 Husky 钩子。CI 应运行 `pnpm check`，并单独对提交范围或 PR 标题运行 commitlint，避免本地钩子成为唯一保障。

### 为什么当前选择 Rollup？

当前目标是构建库包，而不是先开发完整应用。Rollup 能以较少配置输出可读的 ESM、类型声明和 source map，方便观察模块边界与调试。它不等同于完整的浏览器开发服务器。

追问：后续需要浏览器 demo 时，为什么不直接替换整套构建工具？

先保留 Rollup 负责库构建，按需为 demo 增加 HTML 入口和开发工具。这样不会改变已验证的库入口、类型声明和输出格式；整体替换工具链会扩大模块解析、产物和调试链路的回归范围。

### `pnpm check` 验证了什么？没有验证什么？

它依次运行 lint、类型检查、测试和构建，证明当前工程规则可执行、测试框架能运行、Rollup 能产出库文件。它不验证提交信息规范，也不能仅凭退出码为 0 证明所有配置设计合理；验证范围取决于实际接入的检查与测试。

## JSX 与 ReactElement

- JSX 到 ReactElement 发生了什么？
- ReactElement 和 Fiber 的区别是什么？
- key/ref 为什么不是普通 props？

## Reconciler 与 Update Queue

- Reconciler 解决什么问题？
- FiberRootNode 和 HostRootFiber 有什么区别？
- 为什么更新需要 update queue？

## Render 与 Commit

- render 阶段和 commit 阶段分别做什么？
- beginWork 和 completeWork 分别负责什么？
- 为什么 commit 阶段不能被中断？

## FunctionComponent 与 Hooks

- 函数组件重新执行后状态为什么不会丢？
- Hooks 为什么不能写在条件语句里？
- useState 的 dispatch 如何触发更新？

## Update 流程

- React 为什么需要双缓存 Fiber 树？
- mountState 和 updateState 有什么区别？
- 多次 state update 如何计算最终状态？

## 事件系统

- React 事件系统为什么要做统一封装？
- 事件触发后如何进入更新流程？
- React 17/18 事件委托位置有什么变化？

## Diff 与 Fragment

- React Diff 为什么不是完整树编辑距离？
- key 的真实作用是什么？
- 为什么 index 作为 key 会导致状态错乱？
- Fragment 在 Fiber 中如何表达？

## Lane 与调度

- React 18 automatic batching 是什么？
- Lane 解决什么问题？
- 高低优先级更新为什么需要区分？
- 调度阶段和 render 阶段是什么关系？

## Effect

- useEffect 为什么不是 render 阶段执行？
- cleanup 什么时候执行？
- 依赖数组比较如何影响 effect 执行？
- 为什么 React 需要 renderer 抽象？

## 并发渲染与 Transition

- Concurrent Rendering 解决什么问题？
- startTransition/useTransition 的使用场景是什么？
- 为什么并发更新可能出现状态计算复杂度？
- React 如何避免低优先级更新阻塞高优先级交互？

## useRef 与 Context

- useRef 和 useState 的区别是什么？
- Context 为什么可能导致性能问题？
- useContext 如何和 Fiber 树遍历关联？

## Suspense 与 use

- Suspense 解决什么问题？
- 为什么 Suspense 可以通过 throw promise 触发？
- unwind 流程做什么？
- use 和传统 useEffect 请求数据有什么区别？

## 性能优化

- React.memo 为什么有时无效？
- useMemo/useCallback 优化的到底是什么？
- eagerState 为什么可以减少一次调度？
- bailout 依赖哪些条件？
- Context 更新为什么容易穿透 memo？
