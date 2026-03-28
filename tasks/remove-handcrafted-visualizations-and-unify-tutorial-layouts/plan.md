# Plan

## Task
- Title: Remove handcrafted visualizations and unify tutorial layouts
- Slug: `remove-handcrafted-visualizations-and-unify-tutorial-layouts`
- Created: 2026-03-28
- Active task registry: `tasks/registry.json`

## Handoff context
- Previous task folder: `tasks/add-travel-assistant-playable-simulator-example`
- Previous summary file: `tasks/add-travel-assistant-playable-simulator-example/status.md`
- 已有旅行助手播放器示例可复用，说明本次删掉 handcrafted visualization 后，教学交互性仍然能通过 simulator 保住。

## Session policy
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- Before ending a work session, satisfy the floor or record why you are forcing an early stop.

## Milestones
1. 补全文档并明确删减范围：移除 handcrafted visualizations，保留 simulator。 `completed`
2. 重构页面结构：版本页删掉顶部可视化；旅行助手切到左侧 sidebar 风格；首页收缩成多教程入口页。 `completed`
3. 清理未使用代码与翻译，运行构建验证并回写状态。 `completed`

## Validation per milestone
- 里程碑 1：确认任务文档不再包含占位文本，且范围边界清晰。
- 里程碑 2：源码中 `SessionVisualization` 不再挂到版本页；旅行助手页面出现左侧课程列表；首页不再包含 `MessageFlow` 和相关深度区块。
- 里程碑 3：运行 `cd web && npm run build`；如果失败，先修复再结束任务。
- 每完成一次实现、验证或关键排障，记录一个 cycle。

## Risks
- 若只移除版本页挂载、不清理未使用文件，仓库会留下大量死代码。
- 旅行助手改成左侧导航后，可能影响移动端和总览页的信息层次，需要保持版心和内容间距稳定。
- 首页如果删得太狠，可能失去“这是做什么的”最基本说明。

## Decision log
- 本次优先保留 `simulate` 页签，因为它比 handcrafted SVG 更低维护，也更接近“可由数据驱动”的教学方式。
- 首页只保留“教程合集入口”职责，不再承载 Claude Code 单路线的深度架构导览。
- 旅行助手直接复用左侧教程导航模式，而不是继续维护一套右侧卡片式教程导航。

## Next milestone
- 无。任务已完成，下一次开启新任务时重新运行 scaffold 切换 active pointer。
