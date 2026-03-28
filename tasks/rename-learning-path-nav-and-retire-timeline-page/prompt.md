# Rename learning path nav and retire timeline page

## Objective
- 将顶部导航中的“学习路径”改为“手搓 Claude Code”，并把 Claude Code 路线的主入口统一为 `/${locale}/s01`；同时让旧 `/timeline` 页面退出主流程但保留跳转，避免用户或旧链接进入 404。

## Context
- 用户认为“学习路径”这个命名过泛，想把顶部入口改成更明确的“手搓 Claude Code”。
- 当前 `/timeline` 页面只是对 `s01`-`s12` 的重复汇总，和首页预览、版本详情页左侧导航存在较大重叠，信息架构上可以去掉这一跳。
- 受影响范围包括顶部导航、首页 CTA、首页 Claude Code 课程卡、旧 timeline 路由以及部分回链。

## Prior task context
- Previous task folder: `tasks/fix-travel-assistant-tutorial-typography`
- Previous task title: `Fix travel assistant tutorial typography`
- Previous task status at handoff: `completed`
- Read this first for carry-over context: `tasks/fix-travel-assistant-tutorial-typography/status.md`
- 上一个任务已修复旅行助手教程页的 Markdown 排版问题并完成构建验证。本任务与其代码路径基本独立，仅复用相同的 `web` 构建验证流程和 long-task 工作流。

## Session floor
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- A cycle means one meaningful implement, verify, or unblock pass.

## Constraints
- 不要让旧 `/timeline` 链接直接失效，优先改为跳转到 `s01`。
- 顶部导航中的 Claude Code 入口在 `s01`-`s12` 及其 diff 页面上都应保持高亮。
- 改动应尽量集中在导航、首页入口和路由层，避免触碰版本内容页面本身。

## Deliverables
- 更新顶部导航文案和激活逻辑。
- 将首页所有显式 `/timeline` 入口改为 `s01`。
- 将 `/timeline` 页面改为跳转到 `/${locale}/s01`。
- 更新旧回链并运行 `cd web && npm run build` 验证。

## Done When
- 顶部导航显示“手搓 Claude Code”，点击后进入 `/${locale}/s01`。
- 首页“开始学习”和 Claude Code 课程卡均直达 `s01`。
- 访问 `/${locale}/timeline` 时自动跳转到 `/${locale}/s01`，不再显示单独的 timeline 页面。
- `cd web && npm run build` 成功通过。

## References
- Link to specs, issues, upstream docs, or prior task folders.
- Global registry: `tasks/registry.json`
