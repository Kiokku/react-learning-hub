# NotebookLM 学习模板

全项目使用一个 Notebook。上传来源时统一命名：

```text
S{阶段}-L{Lesson}-video-{课程编号}-{主题}
S{阶段}-L{Lesson}-react-source-{主题}
S{阶段}-L{Lesson}-react-doc-{主题}
S{阶段}-L{Lesson}-my-summary
```

示例：

```text
S04-L02-video-017-hooks-architecture
S04-L02-video-018-use-state
S04-L02-react-doc-hooks
S04-L02-my-summary
```

每次提问都先替换 `{LESSON_ID}`、`{LESSON_TITLE}` 和 `{SOURCE_NAMES}`。

## 1. 视频前：建立问题

```text
我正在学习 {LESSON_ID}「{LESSON_TITLE}」。

本次只允许使用以下来源：
{SOURCE_NAMES}

请不要总结课程，也不要给实现代码。请基于来源标题和已有内容：
1. 提出这个机制要解决的核心问题
2. 列出我观看时必须寻找的 5 个证据
3. 给出 3 个需要我先预测答案的问题
4. 区分输入、核心数据结构、处理过程和输出

每项结论都引用来源。当前来源没有证据时，明确写“当前来源未提供证据”。
```

## 2. 视频后：压缩主链路

```text
我已经观看 {LESSON_ID}「{LESSON_TITLE}」。

本次只允许使用以下来源：
{SOURCE_NAMES}

请生成一份可用于闭卷复述的学习摘要：
1. 一句话说明它解决的问题
2. 用不超过 8 步描述主调用链
3. 列出关键数据结构、重要字段和存在原因
4. 区分课程为了简化而省略的内容与 React 官方实现
5. 给出 3 个最容易形成错误心智模型的地方
6. 为下一次实现日写出 3-5 条可观察的测试目标

不要输出完整实现代码。每项事实都引用具体来源；来源冲突时并列说明。
```

## 3. 编码前：闭卷 Quiz

```text
围绕 {LESSON_ID}「{LESSON_TITLE}」连续考我 8 题，一次只问一题。

范围仅限：
{SOURCE_NAMES}

题目依次覆盖：问题边界、数据结构、主链路、边界情况和测试行为。
不要在问题里暗示答案。我的回答模糊时继续追问，不要立即给标准答案。
完成 8 题后输出：
- 已掌握
- 仍然模糊
- 编码前必须修正
- 建议测试目标

评价必须引用来源。
```

## 不属于 NotebookLM 的环节

实现后偏差分析、闭卷实现纠偏和面试追问由 `teach` 或一般 Agent 完成；分别使用 [`prompts.md`](../prompts.md) 中的“实现差异分析 Prompt”“代码 Review Prompt”和“面试追问 Prompt”。
