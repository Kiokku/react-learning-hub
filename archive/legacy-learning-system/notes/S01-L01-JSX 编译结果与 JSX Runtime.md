# Lesson 笔记：[S01-L01 JSX 编译结果与 JSX Runtime]

日期：2026/08/13

所属阶段：阶段 1：JSX 与 ReactElement

对应课程/来源：003「2-1」实现 JSX、004「2-2」实现 JSX 的打包

NotebookLM 来源前缀：`S01-L01`

## 1. 课前预测

这节课解决什么问题？

- JSX 为什么需要经过编译，才能进入 React 的运行时链路？

可能的输入：

- 一段包含单个或多个子节点的 JSX 源码。

可能的输出：

- 待完成课前预测。

可能涉及的模块或文件：

- 待完成课前预测。

我预期会出现的核心数据结构：

- 待完成课前预测。

课前需要先回答的问题：

1. 浏览器为什么不能直接执行 JSX？

   原回答：浏览器只有javascript runtime，JSX 是一种类语法糖，不能直接执行；

   批改：**部分正确。** JSX 是 JavaScript 的语法扩展（通常也称语法糖），JavaScript 解析器不能直接解析 JSX 语法，因此需要先编译为标准 JavaScript。关键不是浏览器“只有 JavaScript runtime”，而是 JavaScript 运行环境不认识 JSX 语法。

2. JSX 编译后的输出可能是什么？

   原回答：dom节点树

   批改：**存在错误心智模型。** 编译结果不是 DOM 节点树，而是标准 JavaScript 表达式；在自动 JSX Runtime 下，通常表现为对 `jsx` 或 `jsxs` 的函数调用。此时还没有创建真实 DOM。

3. `jsx` 与 `jsxs` 可能分别接收什么输入？

   原回答：接收 DOM 节点树对象。

   批改：**不正确。** 两者接收元素 `type`、包含属性和 `children` 的配置对象，以及可能单独传入的 `key`。它们不接收 DOM 节点树。

4. JSX Runtime 应该返回什么？

   原回答：返回 `jsx/jsxs` 表示的函数结果。

   批改：**不正确，答案没有指出具体结果。** JSX Runtime 返回描述界面的 ReactElement 对象，而不是真实 DOM 节点。

5. `react`、`react-dom`、`react-reconciler` 中，哪个模块应该负责创建 ReactElement？

   原回答：react

   批改：**正确。** 当前链路中由 `react` 包提供的 JSX Runtime 创建 ReactElement；`react-reconciler` 和 `react-dom` 尚未参与这个创建步骤。

### teach 课前诊断反馈

- JSX 需要编译：基本正确，但需要补清 JavaScript 解析器不识别 JSX 语法。
- `jsx/jsxs`：曾误认为树节点与叶子节点；需要通过编译结果确认它们与子节点数量的关系。
- Runtime 输入输出：曾误认为输入 DOM 节点树；需要确认输入参数及 ReactElement 输出。
- 模块边界：`react` 的判断基本正确；需要区分 Reconciler 的计算职责、ReactDOM 的浏览器渲染职责和真实 DOM 容器。

课程中需要寻找的证据：

1. 单个与多个子节点的实际编译结果。
2. `jsx/jsxs` 的参数和返回值。
3. ReactElement 创建阶段为什么尚未出现真实 DOM。

## 2. 架构笔记

主调用链：

```text
JSX 源码
  → 待根据课程补充
  → jsx/jsxs 调用
  → 待根据课程补充
  → ReactElement
```

关键数据结构：

| 名称 | 重要字段 | 为什么存在 |
| --- | --- | --- |
| ReactElement | 待根据课程补充 | 待根据课程补充 |

编译阶段必须完成什么？

- 待根据课程补充。

JSX Runtime 必须完成什么？

- 待根据课程补充。

render 阶段必须完成什么？

- 本 Lesson 尚未进入 Reconciler 的 render 工作流程，不在当前实现范围内。

commit 阶段必须完成什么？

- 本 Lesson 尚未进入 commit 阶段，不在当前实现范围内。

## 3. 可选：最小链路图

本 Lesson 只需画清楚 JSX 到 ReactElement 的最小链路，不扩展为 Fiber、Reconciler 或 ReactDOM 可视化。

要可视化的机制（可留空）：

- JSX 源码如何变成 JSX Runtime 调用，再产生 ReactElement。

表现形式（流程图、手绘或最小交互）：

- 待完成。

输入、核心结构、输出：

| 输入 | 核心结构 | 输出 |
| --- | --- | --- |
| JSX 源码 | 待根据课程补充 | ReactElement |

这个可视化暴露的理解漏洞：

- 待完成闭卷复述后填写。

## 4. 编码前 Quiz 结果

我答得比较好的问题：

- 待完成 Quiz 后填写。

我答不上来的问题：

- 待完成 Quiz 后填写。

编码前需要补的概念：

- 待完成 Quiz 后填写。

下一次实现日的测试目标：

- [ ] 待从课程证据和 Quiz 结果中提炼 1～3 条可观察行为。

## 5. 看实现前先写的伪代码

```ts
// 关闭课程和资料后独立填写。
```

## 6. 我的实现尝试

我在不看视频的情况下实现了什么：

- 尚未开始。

我卡在哪里：

- 尚未记录。

我做了哪些猜测：

- 尚未记录。

## 7. 实现差异记录

我和课程代码的差异：

| 位置 | 我的实现 | 课程实现 | 这个差异说明什么 |
| --- | --- | --- | --- |
|  |  |  |  |

哪些差异只是写法不同？

- 待对照课程后填写。

哪些差异说明我理解错了？

- 待对照课程后填写。

哪些差异是为了后续课程铺垫？

- 待对照课程后填写；本 Lesson 不提前实现 Fiber、Reconciler、ReactDOM 或完整 JSX 回归测试。

## 8. 面试输出

核心问题：JSX 从源码到 ReactElement 发生了什么？

1 分钟版回答：

```text
待完成实现与纠偏后填写。
```

3 分钟版回答：

```text
待完成实现与纠偏后填写。
```

可能的追问：

- 问：JSX 为什么不能被浏览器直接执行？
  答：待填写。
- 问：编译器和 JSX Runtime 分别负责什么？
  答：待填写。
- 问：ReactElement 与 Fiber、真实 DOM 有什么区别？
  答：待填写；本 Lesson 只要求区分概念，不展开 Fiber 工作流程。

## 9. 完成检查

- [ ] 我能不看笔记画出 `JSX → jsx/jsxs → JSX Runtime → ReactElement` 链路。
- [ ] 我能解释编译器与 JSX Runtime 的职责边界。
- [ ] 我能说明 `jsx`、`jsxs` 的输入和输出。
- [ ] 我先写了失败测试，再进行闭卷实现。
- [ ] 我完成了最小 JSX Runtime，并通过基础测试。
- [ ] 我记录了独立实现与课程实现的差异。
- [ ] 我能完成 1 分钟回答并通过两轮追问。

## 10. 掌握证据

实现仓库 commit：

- 尚无。

测试命令与结果：

- 尚无。

两轮追问记录：

- 尚无。

Lesson 状态：未开始
