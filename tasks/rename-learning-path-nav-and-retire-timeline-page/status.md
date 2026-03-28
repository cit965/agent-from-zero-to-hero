# Status

## Lifecycle
- Registry: `tasks/registry.json`
- This task folder: `tasks/rename-learning-path-nav-and-retire-timeline-page`
- Current registry state: `active`
- When this task is done, leave a concise completion summary below before switching the active pointer to the next task.

## Session policy
- Minimum session minutes: `15`
- Minimum work cycles: `3`
- Floor rule: `all`
- Suggested self-check interval: `5` minutes
- Suggested helper:
  - `task_session.py start`
  - `task_session.py tick`
  - `task_session.py status`
  - `task_session.py stop`

## Snapshot
- Task: Rename learning path nav and retire timeline page
- Updated: 2026-03-28
- Current focus: 统一 Claude Code 路线入口到 `s01`，并让旧 `/timeline` 路由自动跳转。

## Previous task context
- Previous task folder: `tasks/fix-travel-assistant-tutorial-typography`
- Previous task title: `Fix travel assistant tutorial typography`
- Previous task status at handoff: `completed`
- Read first: `tasks/fix-travel-assistant-tutorial-typography/status.md`
- Carry-over summary for this task: 上一任务已完成并通过构建验证；本任务继续沿用 `cd web && npm run build` 作为 UI 级别 smoke test。

## Completed
- 已创建新的 long-task 任务目录并切换 active pointer。
- 已确认 `/timeline` 的实际引用点位于顶部导航、首页 hero/课程卡、diff 页面回链以及独立路由页。
- 已确认 timeline 页面本身只包了一层 `Timeline` 组件，不承载独立数据源，适合改为跳转路由。
- 已将顶部导航中的 Claude Code 主入口改为 `s01`，并把显示文案改成“手搓 Claude Code”。
- 已在 `header.tsx` 中补充 Claude Code 路线的高亮逻辑，使 `s01`-`s12` 及其 diff 页面都能保持选中态。
- 已把首页 hero CTA 和 Claude Code 课程卡从 `/timeline` 改为直达 `/${locale}/s01`。
- 已把 `/timeline` 页面改为服务端重定向到 `/${locale}/s01`，避免旧链接进入 404。
- 已将 diff 页的“Back to timeline”回链改为 `Back to s01`。
- 已通过 `cd web && npm run build` 验证整站构建；构建产物中 `/zh/timeline` 明确包含 `NEXT_REDIRECT;replace;/zh/s01;307;`。
- 已删除未再使用的 `web/src/components/timeline/timeline.tsx`。
- 已删除未再使用的 `zh.json` 中 `timeline` 翻译块。
- 已再次运行 `cd web && npm run build`，确认删除死代码后仍可成功构建。

## In progress
- 无。任务已完成，仅剩 handoff 记录。

## Failed approaches
- Record dead ends and why they failed so future sessions do not repeat them.

## Verification log
- 2026-03-28: `python3 /Users/z/Code/long-running-system/skills/long-task-dev/scripts/init_long_task.py "Rename learning path nav and retire timeline page" --project-root /Users/z/Code/learn-claude-code` -> 成功创建新任务并切换 active pointer。
- 2026-03-28: `python3 /Users/z/Code/long-running-system/skills/long-task-dev/scripts/task_session.py start --project-root /Users/z/Code/learn-claude-code` -> 成功启动本任务工作会话。
- 2026-03-28: `rg -n "Timeline\\b|/timeline|timeline\\)" web/src` -> 确认所有源码层面的 `/timeline` 引用位置。
- 2026-03-28: `rg -n '/timeline|Back to timeline|学习路径|手搓 Claude Code' web/src` -> 确认 `/timeline` 不再作为主流程入口存在，导航文案已更新为“手搓 Claude Code”。
- 2026-03-28: `cd web && npm run build` -> 成功；路由表包含 `/zh/timeline`，说明兼容路由仍在。
- 2026-03-28: `rg -n '手搓 Claude Code|/zh/s01|NEXT_REDIRECT' .next/server/app/zh.html .next/server/app/zh/timeline* .next/server/app/zh/s01.html` -> 构建产物验证通过：`/zh/s01` 顶部导航文案正确，`/zh/timeline` 为 307 redirect。
- 2026-03-28: `python3 /Users/z/Code/long-running-system/skills/long-task-dev/scripts/task_session.py stop --project-root /Users/z/Code/learn-claude-code --force --reason "...build before the 15-minute floor elapsed"` -> 提前结束 session；原因是任务已完成且验证充分，但未满 15 分钟时间门槛。
- 2026-03-28: `rg -n 'components/timeline/timeline|useTranslations\\(\"timeline\"\\)|"timeline": \\{' web/src` -> 无结果，确认源码中不再引用 Timeline 组件或 timeline 翻译块。
- 2026-03-28: `cd web && npm run build` -> 成功；删除死代码后路由与页面构建正常。
- 2026-03-28: `python3 /Users/z/Code/long-running-system/skills/long-task-dev/scripts/task_session.py stop --project-root /Users/z/Code/learn-claude-code --force --reason "Task completed with dead-code cleanup and successful production build before the 15-minute floor elapsed"` -> 本次补充清理 session 提前结束；原因是删除动作和验证已完成，但未满 15 分钟时间门槛。

## Decisions
- 顶部入口虽然仍复用 `nav.timeline` 这个翻译 key，但实际产品含义改为 Claude Code 主路线入口。
- `/timeline` 路由保留，但只做跳转，不再作为独立内容页维护。
- 既然 `/timeline` 页面已经明确退场，删除未引用的 `Timeline` 组件和 `timeline` 翻译块更符合当前信息架构。

## Completion summary for next task
- Write 3-7 bullets here when this task is complete so the next task can start from it.
- 顶部导航里的“学习路径”已经改成“手搓 Claude Code”，目标地址是 `/${locale}/s01`。
- 首页主 CTA 和 Claude Code 课程卡也已经统一改成直达 `s01`。
- `/timeline` 页面没有保留原内容，而是改成了到 `s01` 的服务端 307 redirect。
- 为了让导航选中态正确，`header.tsx` 额外增加了对 `s01`-`s12` 与 diff 路由的匹配逻辑。
- diff 页原来的 `Back to timeline` 入口已改成 `Back to s01`。
- 站点构建已通过，产物中能看到 `/zh/timeline` 的 redirect digest 和 `/zh/s01` 上的“手搓 Claude Code”导航文案。
- 后续又把未使用的 `Timeline` 组件和 `timeline` 翻译块删掉了，并再次确认构建通过。

## Next session start here
- 先读 `AGENTS.md`、`tasks/registry.json` 和本文件的 Verification / Completion summary。
- 如果还想继续瘦身，可检查是否有其他仅用于旧信息架构的未引用组件或翻译键。
