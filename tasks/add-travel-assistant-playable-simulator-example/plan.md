# Plan

## Task
- Title: Add travel assistant playable simulator example
- Slug: `add-travel-assistant-playable-simulator-example`
- Created: 2026-03-28
- Active task registry: `tasks/registry.json`

## Handoff context
- Previous task folder: `tasks/rename-learning-path-nav-and-retire-timeline-page`
- Previous summary file: `tasks/rename-learning-path-nav-and-retire-timeline-page/status.md`
- 继承内容主要是前端站点结构、已启用的 long-task 工作流，以及 `cd web && npm run build` 这条验证命令。

## Session policy
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- Before ending a work session, satisfy the floor or record why you are forcing an early stop.

## Milestones
1. 补全任务文档，并确认旅行助手页面的最佳挂载点与现有 simulator 复用方式。
2. 新增数据驱动的旅行助手播放演示，并挂到第四课页面。
3. 运行构建验证，回写状态和决策记录。

## Validation per milestone
- 里程碑 1：确认任务文档不再保留占位文本，且挂载方案明确。
- 里程碑 2：源码中新增 travel assistant scenario 数据和对应组件，且 lesson-4 页面可引用。
- 里程碑 3：运行 `cd web && npm run build`；若失败，先修复再结束任务。
- 每完成一次实现、验证或关键排障，记录一个 cycle。

## Risks
- 如果把示例直接塞进 Markdown 渲染链路，会增加渲染复杂度并让维护方式混乱。
- 如果组件和数据耦合过深，后续扩展到 lesson-2 或 lesson-5 时会重复造轮子。

## Decision log
- 先用“通用 simulator + lesson-specific scenario 数据”的模式，不做专属 SVG 图，这是当前最划算的路线。
- 把示例挂在第四课页面，而不是总览页；这样上下文最贴近“多工具协同”这节课本身，也不会冲淡教程首页的导读角色。

## Next milestone
- 任务已完成；后续若要扩展，可按同样模式给 lesson-2 或 lesson-5 追加 scenario。
