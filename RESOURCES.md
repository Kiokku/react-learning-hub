# React 源码学习资源

## Knowledge

- [课程：《从0实现 React18》](https://appjiz2zqrn2142.h5.xiaoeknow.com/p/course/column/p_638035c1e4b07b05581d25db)
  63 期付费视频课程，是 `roadmap.md` 的 React 18 实现主线。视频需要在已购买并登录的账号中观看。
- [课程配套实现：BetaSu/big-react](https://github.com/BetaSu/big-react)
  课程作者公开的配套实现。先独立预测或实验，再对照设计与实现偏差；课程简化不等于 React 官方实现。
- [React 官方源码](https://github.com/facebook/react)
  核对真实数据结构、调用链和版本差异的第一手资料。React 18 阶段应固定到对应版本 tag，避免混入后续实现。
- [React 18 官方文档](https://18.react.dev/)
  核对 React 18 API 行为、Hooks 用法和并发特性的官方资料。
- [React 19.2 官方发布说明](https://react.dev/blog/2025/10/01/react-19-2)
  React 19/19.2 差异阶段的版本边界和新增能力清单。
- [React 官方 API Reference](https://react.dev/reference/react)
  核对 React 19/19.2 Hooks 与组件行为的当前官方参考。

## Wisdom (Communities)

- [React GitHub Discussions](https://github.com/reactjs/react.dev/discussions)
  用于核对文档问题和真实使用场景；只在课程、官方文档与源码仍无法解释问题时使用。

## 使用与替换

资源是问题探索的输入。课程编号与机制依赖见 [roadmap.md](./roadmap.md)，学习操作见 [workflow.md](./workflow.md)。NotebookLM 等来源工具按需使用，不要求额外维护模板或记录。

React 18 源码入口可固定到 [v18.2.0](https://github.com/facebook/react/tree/v18.2.0)，比较其他版本时另写明 tag 或 commit。官方当前 API 文档可能随版本更新，引用时保留对应版本信息。

更换课程只重映射课程章节，不静默变更 Sxx-Lxx ID、依赖关系与学习范围。超出主线的内容标为可选，不添加进度表。

## 待核查

- 课程配套实现应固定的 commit 尚未确认，实际对照时记录所用 commit。
- CourseX 的稳定课程/章节 ID 与深链接尚未核查；路线中的课程编号是资源映射，不是路由 ID。
