# Remove handcrafted visualizations and unify tutorial layouts

## Objective
- 删除 Claude Code 路线中维护成本高的手搓顶部可视化，统一保留更低维护的 simulator；同时把旅行助手页面布局调整为与 Claude Code 路线一致的左侧教程导航风格，并把首页改成更明显的“多系列教程入口页”。

## Context
- 用户明确表示 `s01/s02/s03` 这类手搓可视化维护成本太高，希望删除。
- 旅行助手当前页面结构与 Claude Code 路线差异较大，使用右侧卡片导航，整体不像一个统一教程系统。
- 首页目前过度强调 Claude Code 单一路线，包含“核心模式”“消息增长”“架构层次”等较深内容，不符合“多个系列教程组成的主页”定位。

## Prior task context
- Previous task folder: `tasks/add-travel-assistant-playable-simulator-example`
- Previous task title: `Add travel assistant playable simulator example`
- Previous task status at handoff: `completed`
- Read this first for carry-over context: `tasks/add-travel-assistant-playable-simulator-example/status.md`
- 上一个任务已经为旅行助手第四课加了一个基于通用 simulator 的可播放示例，这恰好验证了“保留通用 simulator、去掉手搓图”的方向是可行的。

## Session floor
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- A cycle means one meaningful implement, verify, or unblock pass.

## Constraints
- 不能影响现有 simulator、源码查看和 deep-dive 页签的可用性。
- 旅行助手的新布局要尽量复用现有 sidebar 风格，而不是再造一套完全不同的视觉体系。
- 首页必须突出“教程合集”而不是单一系列；描述要更短、更像入口页。

## Deliverables
- 版本页不再渲染手搓顶部可视化。
- 相关未使用的 handcrafted visualization 代码和依赖被删除。
- 旅行助手总览页与单课页切换为统一的左侧课程导航布局。
- 首页重构为多系列教程入口页，并完成构建验证。

## Done When
- 打开 `s01/s02/s03` 等版本页时，不再看到手搓 SVG/流程图大卡片。
- `simulate` 页签仍然可播放。
- 旅行助手页在桌面端拥有与 Claude Code 路线一致的左侧教程列表。
- 首页不再展示“核心模式 / 消息增长 / 架构层次”等长篇单路线内容。
- `cd web && npm run build` 成功通过。

## References
- Global registry: `tasks/registry.json`
- Active task status: `tasks/remove-handcrafted-visualizations-and-unify-tutorial-layouts/status.md`
- Previous task status: `tasks/add-travel-assistant-playable-simulator-example/status.md`
