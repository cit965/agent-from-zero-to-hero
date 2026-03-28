# Plan

## Task
- Title: Rename learning path nav and retire timeline page
- Slug: `rename-learning-path-nav-and-retire-timeline-page`
- Created: 2026-03-28
- Active task registry: `tasks/registry.json`

## Handoff context
- Previous task folder: `tasks/fix-travel-assistant-tutorial-typography`
- Previous summary file: `tasks/fix-travel-assistant-tutorial-typography/status.md`
- 继承内容只有长期任务工作流、验证命令以及 `web` 站点构建路径；本任务本身与旅行助手内容修复无代码耦合。

## Session policy
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- Before ending a work session, satisfy the floor or record why you are forcing an early stop.

## Milestones
1. 补全新任务文档，记录为何移除 timeline 页面以及如何保留兼容跳转。
2. 修改顶部导航、首页 CTA 和显式 `/timeline` 链接，把 Claude Code 主入口统一到 `s01`。
3. 将 `/timeline` 路由改为跳转页，运行构建验证并记录结果。

## Validation per milestone
- 里程碑 1：检查 `prompt.md`、`plan.md`、`status.md` 不再包含占位文本。
- 里程碑 2：确认 `web/src/components/layout/header.tsx` 和 `web/src/app/[locale]/page.tsx` 中不再保留 `/timeline` 作为 Claude Code 入口。
- 里程碑 3：访问逻辑上 `/timeline` 应跳到 `s01`；运行 `cd web && npm run build`，若失败则先修复再结束任务。
- 每完成一次实现、验证或关键排障，记录一个 cycle。

## Risks
- 如果只改链接不改导航高亮逻辑，用户在 `s02` 之后会看不到 Claude Code 入口处于选中状态。
- 如果直接删除 `/timeline` 路由而不保留跳转，现有外链或旧书签会变成 404。

## Decision log
- 用重定向替代直接删除 `/timeline` 页面，既达到“去掉页面”的目标，也保留向后兼容。
- 顶部导航仍复用 `timeline` 这个 i18n key，但产品呈现改为“手搓 Claude Code”，避免大范围重命名带来的无效改动。
- 既然 `/timeline` 页面已经退场，就同步删除未再引用的 `Timeline` 组件和 `timeline` 翻译块，避免留下假活跃代码。

## Next milestone
- 任务已完成；后续仅在用户想继续收缩无用组件或翻译块时再开新任务。
