# 每日学习流程

一个机制级 Lesson 通常跨两个学习日完成。不要在一天内同时塞入视频、Quiz、实现、复盘和面试输出。

## prompt

`按照 [daily-workflow.md](daily-workflow.md) 的指导，重新给出学习 阶段[] 的完整路径和相关使用的prompt`

## 理解日：60 分钟

| 时间 | 动作 | 产出 |
| --- | --- | --- |
| 5 分钟 | 只看 Lesson 标题，写课前预测 | 问题、输入、输出、涉及模块 |
| 10 分钟 | 使用 `teach` 完成诊断题和必要概念 | 当前理解漏洞 |
| 20 分钟 | 在 NotebookLM 中学习对应课程来源 | 带引用的主链路和关键数据结构 |
| 15 分钟 | 关闭资料，画流程并复述 | 闭卷心智模型 |
| 10 分钟 | 完成 NotebookLM Quiz，写出测试目标 | 错题和下一日测试清单 |

理解日结束时，将 Lesson 状态更新为 `理解中`。

## 实现日：最长 90 分钟

| 时间 | 动作 | 产出 |
| --- | --- | --- |
| 10 分钟 | 根据测试目标先写失败测试 | 可观察的行为边界 |
| 35 分钟 | 不看课程完成最小实现 | 独立实现尝试 |
| 15 分钟 | 运行测试并定位失败 | 测试结果和错误假设 |
| 15 分钟 | 对照课程与官方资料 | 实现差异记录 |
| 10 分钟 | 用 `teach` 完成追问和纠偏 | 修正后的解释 |
| 5 分钟 | 写 1 分钟面试回答 | 可复述的面试输出 |

开始写测试或实现时，将 Lesson 状态更新为 `实现中`；测试、实现和复盘都完成后更新为 `已完成`。

## 阶段验收

本阶段全部 Lesson 完成后，阶段进入 `待验收`。验收必须同时满足：

1. 不看课程，独立写出本阶段核心机制的最小实现。
2. 用测试证明关键行为。
3. 脱离笔记讲清主链路，并通过两轮追问。

三项都通过后，阶段才能标记为 `已掌握`，并按 [`templates/learning-record-template.md`](./templates/learning-record-template.md) 创建 Learning Record。文件名必须以对应阶段 ID 开头，例如 `S00-准备与方法建立.md`。

## NotebookLM 与 teach 分工

- NotebookLM：基于已购买课程视频做总结、溯源问答和视频内容 Quiz。
- `teach`：诊断理解、设计测试、引导闭卷实现、纠正偏差和模拟面试。
- NotebookLM 不直接生成完整实现；`teach` 不替代课程视频。
- 全项目使用一个 Notebook，通过 `Sxx-Lxx` 来源前缀限制当前问答范围。

## 可选：复杂机制可视化

可视化不是每个 Lesson 的必做产出，只用于最难解释的机制，例如 Fiber 树、Hook 链表、Diff、Lane 和 Suspense。目标是通过一个最小流程图、手绘图或交互模型发现理解漏洞；15 分钟内无法形成清晰模型时，退回流程图，不扩展成独立产品。S00 等准备类 Lesson 可以跳过。

### 用 `archify` 生成 Lesson 实现流程图

当 Lesson 的实现涉及多个模块、分支、状态变化或调用往返时，可以使用 [`archify`](/Users/mow/.agents/skills/archify/SKILL.md) skill，把真实代码实现整理成一个可浏览的流程图 HTML。它是理解和复盘的辅助产出，不替代闭卷画图、测试或阶段验收。

建议按以下顺序使用：

1. 先检查 Lesson、实现和测试的真实路径，提取触发条件、关键函数/数据结构、分支、失败路径和可观察结果；不要根据标题或记忆补写不存在的行为。
2. 按问题类型选择图：步骤与判断用 `workflow`，函数调用与返回用 `sequence`，状态转换与重试用 `lifecycle`，数据变换用 `dataflow`。节点保持精简，优先保留一条主路径和必要的失败分支。
3. 先写一个小型 JSON specification，再验证并交付 HTML。新建 workflow 使用 schema v2，并保留真实的代码标识符和关系标签：

   ```bash
   ARCHIFY=/Users/mow/.agents/skills/archify
   node "$ARCHIFY/bin/archify.mjs" validate workflow <candidate.json> --quality showcase --json
   node "$ARCHIFY/bin/archify.mjs" deliver workflow <candidate.json> <output.html> --quality showcase --json
   node "$ARCHIFY/bin/archify.mjs" visual-check <output.html> --json
   ```

4. 把图交给 `teach` 做一次反向检查：指出与实现不一致的节点、遗漏的边界条件和无法由测试证明的箭头；修正后再完成实现日的测试与复盘。

验收时分开记录三类证据：`validate`/`deliver` 的规格与制品检查、`visual-check` 的浏览器行为证据，以及人工确认的可读性。若 15 分钟内仍无法得到一条清晰主链路，立即退回手绘流程图，不继续扩展图的样式或功能。

## Agent 使用边界

可以：

- 提供提示、诊断题和追问。
- review 独立实现。
- 协助定位报错。
- 生成测试或最小 Demo。
- 模拟 React 专项面试。

在理解设计前，不让 agent 直接生成 Reconciler、Hooks、Diff、Lane、Suspense 或性能优化的完整实现。
