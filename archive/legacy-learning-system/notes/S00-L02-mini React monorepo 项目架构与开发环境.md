# Lesson 笔记：[S00-L02-mini React monorepo 项目架构与开发环境]

日期：2026/7/24

所属阶段：阶段0

对应课程/来源：002 搭建项目架构

NotebookLM 来源前缀：[「1」搭建项目架构](https://notebooklm.google.com/notebook/5ed76725-7a7f-43db-8832-7f53b2eca330/artifact/561fb372-175f-4255-a1f0-7b9fbe6b97fa?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_1&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_1_)

## 1. 课前预测

这节课解决什么问题？

- mini-react 项目的架构选择；项目规范；打包工具

可能的输入：

- [eslint for all](https://talks.antfu.me/2024/feday/1)

可能的输出：

- 架构配置文件；规范 lint 配置；打包配置；

可能涉及的模块或文件：

-

我预期会出现的核心数据结构：

-

## 2. 架构笔记

主调用链：

```text
monorepo
  └─ pnpm workspace
      ├─ 根目录配置（docs、package.json、node_modules、pnpm-workspace.yaml）
      └─ packages/

开发规范：
  ESLint 10（代码规范与代码风格规则）
  Husky → pre-commit → pnpm check
  commitlint → 规范提交信息
  TypeScript → 类型检查
  Rollup → 库包构建
```

关键数据结构：

| 名称 | 重要字段 | 为什么存在 |
| --- | --- | --- |
| pnpm workspace | `pnpm-workspace.yaml`、`packages/` | 定义 monorepo 中的工作区与包目录。 |
| ESLint 10 | lint 规则、代码风格规则、相关插件 | 同时检查代码规范与统一代码风格；本项目不引入 Prettier。 |
| Husky | `pre-commit` hook | 在提交前执行 `pnpm check`。 |
| commitlint | commit message 规则 | 规范提交信息。 |
| TypeScript | `tsconfig.base.json`、各包 tsconfig | 以严格模式检查跨包代码的类型边界。 |
| Rollup | 各包 `rollup.config.mjs` | 输出可读的 ESM、类型声明和 source map。 |

render 阶段必须完成什么？

本课不适用；本课只搭建工程环境，尚未进入 React 渲染流程。

commit 阶段必须完成什么？

本课不适用；这里的 commit 规范指 Git 提交规范，不是 React commit 阶段。

## 3. 可选：复杂机制可视化

用途：把难以只靠文字理解的机制画成最小流程图或交互模型，用来发现理解漏洞。仅在 Fiber 树、Hook 链表、Diff、Lane、Suspense 等复杂机制中填写；不适用于 S00 等准备类 Lesson，也不是完成条件。

要可视化的机制（可留空）：

-

表现形式（流程图、手绘或最小交互）：

-

输入、核心结构、输出：

| 输入 | 核心结构 | 输出 |
| --- | --- | --- |
|  |  |  |

这个可视化暴露的理解漏洞：

-

## 4. 编码前 Quiz 结果

我答得比较好的问题：

- monorepo 适合后续多个 React 包与 shared 公共依赖的组织。
- Rollup 适合当前库包构建目标，不必提前引入完整应用工具链。

我答不上来的问题：

- `peerDependencies` 与 workspace 本地联调的区别；已在阶段面试追问中纠正。

编码前需要补的概念：

- CI 中应同时验证 `pnpm check` 与提交规范，避免本地 Husky 被 `--no-verify` 绕过。

## 5. 看实现前先写的伪代码

```ts

```

## 6. 我的实现尝试

我在不看视频的情况下实现了什么：

- 在 `mini-react18` 中建立 pnpm workspace 与 `@mini-react/shared` 包。
- 配置 ESLint、TypeScript、Husky、commitlint、Vitest 与 Rollup。
- 执行 `pnpm check`，通过 lint、typecheck、test 和 build。

我卡在哪里：

-

我做了哪些猜测：

-

## 7. 实现差异记录

我和课程代码的差异：

| 位置 | 我的实现 | 课程实现 | 这个差异说明什么 |
| --- | --- | --- | --- |
| 代码风格 | 只使用 ESLint 9+ 的代码风格规则，不引入 Prettier。 | ESLint 与 Prettier 组合。 | 工程工具选择不同；仍须用可执行检查统一代码风格。 |

哪些差异只是写法不同？

- ESLint 9+ 统一代码规范与风格，而课程额外使用 Prettier；两种方案的共同目标都是自动化、一致地约束代码风格。

哪些差异说明我理解错了？

-

哪些差异是为了后续课程铺垫？

-

## 8. 面试输出

1 分钟版回答：

```text
这个 mini React 用 pnpm workspace 管理后续多个库包，公共逻辑放到 shared，并通过 workspace 依赖在本地联调。
根目录统一维护 ESLint、TypeScript 和代码风格规则；pre-commit 执行 pnpm check，commit-msg 用 commitlint 约束提交信息。
库构建选择 Rollup，因为当前目标是输出可读的 ESM、类型声明和 source map，而不是先搭建复杂应用工具链。
pnpm check 依次执行 lint、类型检查、测试和构建，证明当前本地工程链路可运行。
```

3 分钟版回答：

```text

```

可能的追问：

- 问：为什么 `peerDependencies` 不是 monorepo 本地联调机制？
  答：它约束发布后的宿主项目应提供哪一份依赖；workspace 依赖才把本地包链接到最新源码。
- 问：为什么有 `tsc` 仍需要 lint？
  答：类型检查不覆盖全部静态规则；ESLint 还检查未使用变量、危险写法和项目代码风格。
- 问：`pnpm check` 没有验证什么？
  答：它不验证提交信息规范；CI 还应单独运行 commitlint，避免本地钩子被绕过。

## 9. 完成检查

- [x] 我能说明 monorepo、开发规范与打包工具的目的。
- [x] 我能执行 lint、typecheck、test 和 build。
- [x] 我能说明本项目为何由 ESLint 统一代码规范与代码风格。
- [x] 我能回答阶段 0 的工程配置面试问题。

## 10. 掌握证据

实现仓库 commit：

`fbf0ba5 chore: scaffold mini React monorepo`（2026/07/27）

测试命令与结果：

`pnpm check`（2026/07/27）：通过 lint、typecheck、Vitest（1 个测试）与 Rollup build。

两轮追问记录：

阶段 0 面试验收已通过；题目与参考答案见 `interview-question-bank.md`。

Lesson 状态：已完成
