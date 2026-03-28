# Fix travel assistant tutorial typography

## Objective
- 修复“旅行助手”教程页及其分课页的文字排版问题，让 Markdown 代码围栏、行内代码和段落恢复正常显示，视觉表现接近参考图中的教程页。

## Context
- 用户反馈 `旅行助手` 教程页出现代码块被当作普通文本渲染的问题，截图中能看到 ` ```python` 和整段示例代码被挤成正文。
- 受影响内容位于 `web/src/data/travel-assistant-tutorial.ts`，渲染链路经过 `web/src/components/docs/markdown-article.tsx`，页面入口在 `web/src/app/[locale]/travel-assistant/`。

## Prior task context
- Previous task folder: `none`
- Previous task title: `none`
- Previous task status at handoff: `none`
- Read this first for carry-over context: `none`
- 无历史任务需要继承。

## Session floor
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- A cycle means one meaningful implement, verify, or unblock pass.

## Constraints
- 优先做最小修复，避免为单页内容问题改动全局 Markdown 渲染样式。
- 不能破坏 `travelAssistantTutorial.sections` 的章节提取逻辑和详情页路由。
- 按 `long-task-dev` 要求保留可恢复的任务文档和验证记录。

## Deliverables
- 更新长期任务文档，使目标、计划、状态和验证命令可直接续接。
- 修复 `web/src/data/travel-assistant-tutorial.ts` 中导致代码围栏失效的内容定义。
- 运行 `cd web && npm run build` 作为回归验证，并把结果写入 `status.md`。

## Done When
- `travel-assistant` 总览页和单课页中的代码示例以代码块样式渲染，不再显示原始三反引号。
- 行内代码恢复为内联 code 样式，普通段落和列表不再被破坏。
- `cd web && npm run build` 成功通过。

## References
- Link to specs, issues, upstream docs, or prior task folders.
- Global registry: `tasks/registry.json`
- User-provided visual reference: thread images `Image #1` and `Image #2`
