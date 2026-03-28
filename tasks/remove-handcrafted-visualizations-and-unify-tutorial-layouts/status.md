# Status

## Lifecycle
- Registry: `tasks/registry.json`
- This task folder: `tasks/remove-handcrafted-visualizations-and-unify-tutorial-layouts`
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
- Task: Remove handcrafted visualizations and unify tutorial layouts
- Updated: 2026-03-28
- Current focus: 任务已完成；代码、验证和会话收尾都已结束，等待下一次任务切换 active pointer。

## Previous task context
- Previous task folder: `tasks/add-travel-assistant-playable-simulator-example`
- Previous task title: `Add travel assistant playable simulator example`
- Previous task status at handoff: `completed`
- Read first: `tasks/add-travel-assistant-playable-simulator-example/status.md`
- Carry-over summary for this task: 旅行助手第四课已经有一个低维护的 simulator 示例，因此删掉 handcrafted visualizations 后，交互演示能力仍然可保留。

## Completed
- 已创建新 long-task 任务目录并启动工作会话。
- 已确认 handcrafted visualizations 只在版本页顶部通过 `SessionVisualization` 挂载，不影响 simulator 页签。
- 已确认旅行助手当前使用右侧导航卡片，不符合 Claude Code 路线的左侧 sidebar 风格。
- 已确认首页当前包含 `MessageFlow`、学习路径预览和层次概览，整体过度偏向 Claude Code 单一路线。
- 已从 `web/src/app/[locale]/(learn)/[version]/client.tsx` 删除 `SessionVisualization` 挂载，版本页改为仅保留 `learn / simulate / code / deep-dive` 四个主页签。
- 已删除 `web/src/components/visualizations/*`、`web/src/components/architecture/message-flow.tsx`、`web/src/hooks/useDarkMode.ts`、`web/src/hooks/useSteppedVisualization.ts` 等 handcrafted visualization 相关死代码。
- 已新增 `web/src/app/[locale]/travel-assistant/layout.tsx` 与 `web/src/components/layout/travel-sidebar.tsx`，将旅行助手总览页和课时页统一到左侧教程导航布局。
- 已将首页 `web/src/app/[locale]/page.tsx` 重构为教程合集入口页，移除“核心模式 / 消息增长 / 架构层次”等单路线重内容区块。
- 已更新 `web/src/i18n/messages/zh.json` 中首页文案，进一步压缩 Claude Code 路线描述，并把 badge 改成中文“教程入口”。

## In progress
- 无。

## Failed approaches
- Record dead ends and why they failed so future sessions do not repeat them.

## Verification log
- 2026-03-28: `python3 /Users/z/Code/long-running-system/skills/long-task-dev/scripts/init_long_task.py "Remove handcrafted visualizations and unify tutorial layouts" --project-root /Users/z/Code/learn-claude-code --previous-status completed` -> 成功创建新任务并切换 active pointer。
- 2026-03-28: `python3 /Users/z/Code/long-running-system/skills/long-task-dev/scripts/task_session.py start --project-root /Users/z/Code/learn-claude-code` -> 成功启动本任务工作会话。
- 2026-03-28: 检查 `web/src/app/[locale]/(learn)/[version]/client.tsx`、`web/src/components/visualizations/*`、`web/src/app/[locale]/travel-assistant/*`、`web/src/app/[locale]/page.tsx`，确认本次需要同时处理版本页、旅行助手页和首页。
- 2026-03-28: `rg -n "SessionVisualization|MessageFlow|useSteppedVisualization|useDarkMode|components/visualizations" web/src` -> 无结果，确认关键 handcrafted visualization 引用已清空。
- 2026-03-28: `cd web && npm run build` -> 成功，通过生产构建验证。
- 2026-03-28: `python3 /Users/z/Code/long-running-system/skills/long-task-dev/scripts/task_session.py stop --project-root /Users/z/Code/learn-claude-code` -> 成功停止工作会话，`floor_met=True`，`forced=False`。

## Decisions
- 用“删掉 handcrafted visualization 挂载 + 保留 simulator”的方式，降低维护成本而不牺牲可播放演示。
- 旅行助手将补一个专用 sidebar 组件，视觉和交互对齐 Claude Code 路线，但内容结构仍保留教程总览与课时页。
- 首页只承担“多系列教程入口”职责，不再承载 Claude Code 单路线的深度讲解。

## Completion summary for next task
- Claude Code 路线顶部 handcrafted visualization 已全部移除，版本页只保留 tab + simulator 模式。
- handcrafted visualization 相关组件、hooks 和首页 `MessageFlow` 都已删除，避免后续继续维护死代码。
- 旅行助手现在有独立 `layout.tsx` 和左侧 `TravelSidebar`，桌面布局与 Claude Code 路线一致。
- 首页已经改成教程合集入口页，避免继续把 Claude Code 单路线内容堆在主页。
- 本任务验证基线仍是 `cd web && npm run build`，并已通过。

## Next session start here
- 先读 `AGENTS.md` 和 `tasks/registry.json`，再决定是否需要用 `$long-task-dev` 新开任务。
