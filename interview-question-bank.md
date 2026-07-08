# 面试题库

这是一个持续维护的文档。完成相关阶段后再补答案。

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
