# Add travel assistant playable simulator example

## Objective
- 为旅行助手教程增加一个最小可播放演示，让用户能直观看到“教程步骤 -> 播放式消息流”的落地方式，并把实现做成低维护的数据驱动结构。

## Context
- 用户希望看到一个“我给你写一个看看”的具体示例，用来理解这类动画并不是从教程 Markdown 自动生成，而是基于额外定义的步骤数据驱动。
- 现有 Claude Code 路线有两套可播放能力：专属 SVG 可视化，以及更通用的 simulator（`Scenario + steps`）。
- 对旅行助手而言，复用通用 simulator 更适合：维护成本低，后续只要改步骤数据，不必改动画组件。

## Prior task context
- Previous task folder: `tasks/rename-learning-path-nav-and-retire-timeline-page`
- Previous task title: `Rename learning path nav and retire timeline page`
- Previous task status at handoff: `completed`
- Read this first for carry-over context: `tasks/rename-learning-path-nav-and-retire-timeline-page/status.md`
- 上个任务已清理 Claude Code 路线导航与旧 timeline 页面；`web` 站点当前构建稳定。本任务复用同样的前端页面组织方式和 `npm run build` 验证路径。

## Session floor
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- A cycle means one meaningful implement, verify, or unblock pass.

## Constraints
- 优先复用现有 simulator hook 和消息卡片组件，不新增专属 SVG 架构图。
- 示例应明确告诉用户：这是“根据教程抽象出的演示步骤”，不是实时执行日志。
- 入口位置要直观，但不能干扰原有教程 Markdown 阅读。

## Deliverables
- 新增一份旅行助手课程步骤数据。
- 新增一个基于现有 simulator 组件栈的可播放演示组件。
- 在旅行助手第四课页面挂载这个示例。
- 运行 `cd web && npm run build` 完成验证，并更新任务状态。

## Done When
- 打开第四课页面时能看到一个可播放的旅行规划演示。
- 用户可以播放、暂停、单步和重置，看到天气查询、景点查询和交通时间估算的消息流。
- 构建成功通过。

## References
- Link to specs, issues, upstream docs, or prior task folders.
- Global registry: `tasks/registry.json`
