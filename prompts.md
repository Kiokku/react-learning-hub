# NotebookLM 和 Agent 提示词

NotebookLM 的完整五步模板见 [`templates/notebooklm-learning-template.md`](./templates/notebooklm-learning-template.md)。以下提示词用于 `teach` 或一般 agent 协作。

## teach 启动 Prompt

```text
使用 teach 开始 roadmap 阶段 [阶段编号]。
请读取 MISSION.md、roadmap.md、lesson-progress.md、已有 learning-records 和 notes，
判断我的最近发展区，只生成下一个机制级 Lesson。
课程视频前先做诊断；不要生成完整 mini React 实现。
```

## Agent 提示 Prompt

```text
我在学习 React18 源码，目标是面试能讲清楚。
下面是我当前代码和本节目标。
请不要直接补全完整代码。
请按以下方式帮助我：
1. 判断我当前思路是否偏离 React 核心模型
2. 指出我下一步应该实现的最小目标
3. 给我 2-3 个引导问题
4. 只有在我明确要求时，才给局部代码
```

## 代码 Review Prompt

```text
请作为 React 源码学习教练 review 我的实现。
重点看：
1. 数据结构是否符合 React 源码思路
2. 函数职责是否清晰
3. 是否只是跑通 demo，但隐藏了理解偏差
4. 哪些地方面试时可能被追问

不要重写我的代码。只给问题、原因和下一步修改建议。
```

## 面试追问 Prompt

```text
请作为高级前端面试官，基于我这节课的笔记和实现追问 React 源码问题。
规则：
1. 一次只问一个问题
2. 我回答后你指出漏洞
3. 继续追问 2 轮
4. 最后给出更好的 1 分钟回答结构
```

## 实现差异分析 Prompt

```text
我先自己实现了一版，然后对照课程代码发现这些差异：

[粘贴差异]

请帮我分析：
1. 哪些差异只是实现风格不同
2. 哪些差异说明我理解错了 React 的设计
3. 哪些差异是为后续章节铺垫
4. 我应该补哪几个概念
```
