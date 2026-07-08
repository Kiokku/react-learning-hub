# Teaching Notes

- 每个机制级 Lesson 通常跨两个学习日：理解日 60 分钟，实现日最长 90 分钟。
- `teach` 在课程视频前提供预测、必要概念和诊断题；视频后引导测试、闭卷实现、偏差分析和模拟追问。
- 课程视频由学习者在已购买并登录的课程页面观看，不将付费视频下载到项目中。
- 不新增原 roadmap 之外的 React 18 Hook；另设已确认范围的 React 19/19.2 差异阶段。
- `lessons/*.html` 保存教学材料；`notes/*.md` 保存练习、伪代码、实现偏差和面试回答；`learning-records/*.md` 只保存已有证据支持的关键理解。
- mini React 的实现和测试位于独立的 `mini-react18` 仓库；Learning Hub 只引用其 commit、测试结果和 Demo。
- `roadmap.md` 预先列出全部计划 Lesson 的标题和课程映射；`teach` 只在进入对应阶段后，根据当前掌握程度生成下一份 Lesson HTML。
- NotebookLM 基于已购买课程视频做总结、溯源问答和视频内容 Quiz；`teach` 负责诊断理解、测试设计、闭卷实现、偏差纠正和模拟面试。
- Learning Hub 可以记录 NotebookLM 笔记链接或学习者导出的总结，但不保存视频、下载地址或鉴权参数。
- 项目需要提供可复用的 NotebookLM 学习模板。
- 免费版 NotebookLM 全项目只使用一个 Notebook；通过统一的阶段、Lesson 和来源命名约定限制每次问答范围，不按阶段新建 Notebook。
