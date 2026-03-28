# Plan

## Task
- Title: Fix travel assistant tutorial typography
- Slug: `fix-travel-assistant-tutorial-typography`
- Created: 2026-03-28
- Active task registry: `tasks/registry.json`

## Handoff context
- Previous task folder: `none`
- Previous summary file: `none`
- 无前序任务上下文，本任务从仓库当前状态直接开始。

## Session policy
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- Before ending a work session, satisfy the floor or record why you are forcing an early stop.

## Milestones
1. 建立可恢复上下文：补全 `AGENTS.md` 与当前任务文档，记录真实项目结构、命令、目标和风险。
2. 定位并修复旅行助手教程页代码块排版异常的根因，确保改动范围尽量只落在内容源。
3. 运行站点构建做 smoke test，回写状态、决策和验证日志。

## Validation per milestone
- 里程碑 1：检查 `AGENTS.md`、`prompt.md`、`plan.md`、`status.md` 不再保留占位文本。
- 里程碑 2：确认 `web/src/data/travel-assistant-tutorial.ts` 中 Markdown 代码围栏会被解析为 `<pre><code>`，且不需要改动全局渲染器。
- 里程碑 3：运行 `cd web && npm run build`；若失败，先修复再结束任务。
- 在执行过程中，每完成一次实现、验证或关键排障，记录一个 cycle。

## Risks
- 若根因判断错误，可能误改 Markdown 渲染器并影响其他教程页面。
- `npm run build` 会先触发内容抽取脚本，若它依赖当前内容格式，也可能暴露额外兼容性问题。

## Decision log
- 优先修正文案源定义，而不是改 CSS 或 HTML 后处理；截图症状更像 Markdown 输入失真而非样式问题。
- 构建阶段出现的 Turbopack 端口绑定报错属于沙箱限制，不属于本次代码改动回归；提权后构建通过。

## Next milestone
- 任务已完成，后续仅在出现新的教程排版回归时再开新任务。
