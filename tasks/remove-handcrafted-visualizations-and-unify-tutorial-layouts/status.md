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
- Updated: 2026-03-30
- Current focus: 已补做 follow-up，移除了 Claude Code 12 节版本页的 `deep-dive / 深入探索` 页签与对应内容；等待下一次任务切换 active pointer。

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
- 已从 `web/src/app/[locale]/(learn)/[version]/client.tsx` 移除 Claude Code 12 节版本页的 `deep-dive / 深入探索` 页签与对应区块，只保留 `learn / simulate / code`。
- 已删除不再有入口的 deep-dive 组件：`web/src/components/architecture/design-decisions.tsx`、`web/src/components/architecture/execution-flow.tsx`、`web/src/components/diff/whats-new.tsx`，并同步清理 `web/src/i18n/messages/zh.json` 里的相关文案。
- 已将 Claude Code 路线的 `sessions` 文案改为“编程第一课”到“编程第十二课”，让左侧导航更像课程目录。
- 已调整 `web/src/app/[locale]/(learn)/[version]/page.tsx` 页头：保留概念标题 `meta.title`，并额外展示课程编号标签，避免页面主标题丢失具体知识点。
- 已按用户澄清将 `sessions` 文案进一步改为“第一课：Agent 循环”这类格式，让左侧导航同时包含课程序号和知识点标题。
- 已将版本页头的小标签收敛为“第一课 / 第二课”这类短标签，避免与主标题 `Agent 循环 / 工具` 重复。
- 已移除教程界面里直接展示给用户的 `s01/s02/...` 前缀，包括左侧导航、版本页头部、上一课/下一课、版本对比下拉框和 diff 页标签。
- 已将旅行助手路线的侧边栏、总览页和单课页骨架收敛到与 Claude Code 教程页一致的视觉语法：统一版心、标题区、卡片容器和上下课导航样式。
- 已为旅行助手新增 `getTravelLessonDisplayTitle()`，统一生成“第一课：LangChain 入门”这类展示文案，避免侧栏、目录和翻页区各自拼接出不同格式。
- 已新增 `web/src/components/travel/travel-lesson-detail.tsx`，将旅行助手单课页统一为 `学习 / 模拟` tabs 结构，避免第四课模拟器与正文分离。
- 已为旅行助手第 1、2、3、5 课补齐抽象播放场景；现在 5 节课都支持“模拟”页签，而不再只有第四课带模拟。
- 已新增 `web/src/data/travel-assistant-source.ts`，从仓库根目录下的 `第二章：langchain 基础旅行助手/lesson01-05` 读取源码文件，并按课时映射到旅行助手页面。
- 已新增 `web/src/components/travel/travel-source-panel.tsx`，让旅行助手每节课的“源码”页签支持在多个文件之间切换查看。
- 已将旅行助手单课页从 `学习 / 模拟` 扩展为 `学习 / 模拟 / 源码`，并接入用户粘贴进仓库的实际 lesson 源码目录。
- 已将旅行助手“源码”页签改成左侧文件目录 + 右侧源码预览的结构，更接近常见代码浏览器，而不是顶部按钮切换。
- 已移除旅行助手教程总览页底部的整篇长文内容，只保留总览介绍、能力摘要和课程目录入口。
- 已将旅行助手单课页外层放宽到 `max-w-6xl`，同时保留 header、学习内容和翻页导航的 `max-w-3xl` 窄版心，让源码页签单独获得更宽的代码阅读空间。
- 已为旅行助手源码目录增加折叠开关；折叠后目录栏宽度会从约 `240px` 收缩到约 `64px`，进一步把横向空间让给源码预览区。
- 已为旅行助手源码目录折叠增加动画：目录栏宽度使用 spring 过渡，标题与文件名淡入淡出切换，折叠按钮图标带旋转转场。

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
- 2026-03-30: `rg -n "design-decisions|execution-flow|whats-new|tab_deep_dive|deep-dive" web/src` -> 无结果，确认 Claude Code 版本页已不再保留 deep-dive 入口或相关引用。
- 2026-03-30: `cd web && npm run build` -> 首次在沙箱内失败，原因是 Next/Turbopack 处理 CSS 时需要绑定端口，报 `Operation not permitted (os error 1)`，属于环境限制而非代码错误。
- 2026-03-30: 提权执行 `cd web && npm run build` -> 成功，通过生产构建验证。
- 2026-03-30: 提权执行 `cd web && npm run build`（课时命名 follow-up） -> 成功，通过“编程第一课...第十二课”命名调整后的生产构建验证。
- 2026-03-30: 提权执行 `cd web && npm run build`（课时命名澄清 follow-up） -> 成功，通过“第一课：Agent 循环”格式调整后的生产构建验证。
- 2026-03-30: `rg -n "Back to s01|font-mono text-xs\\}\\{vId\\}|\\{prevVersion\\} - | - \\{nextVersion\\}|\\{v\\} - \\{VERSION_META\\[v\\]\\?\\.title\\}" web/src` -> 无结果，确认前台展示位置已不再包含 `s01/s02` 这类前缀。
- 2026-03-30: 提权执行 `cd web && npm run build`（移除可见 `s01/s02` 前缀 follow-up） -> 成功，通过生产构建验证。
- 2026-03-30: 提权执行 `cd web && npm run build`（旅行助手布局风格统一 follow-up） -> 成功，通过旅行助手总览页与单课页样式收敛后的生产构建验证。
- 2026-03-30: 提权执行 `cd web && npm run build`（旅行助手 tabs + 全课模拟 follow-up） -> 成功，通过旅行助手 5 节课统一 `学习 / 模拟` 结构后的生产构建验证。
- 2026-03-30: 检查 `第二章：langchain 基础旅行助手/lesson01-05` 映射文件 -> `lesson-1` 到 `lesson-5` 所需源码文件均存在，lesson05 包含 `agent.py`、`app.py`、`templates/index.html`、`static/style.css` 等多文件源码。
- 2026-03-30: 提权执行 `cd web && npm run build`（旅行助手源码页签 follow-up） -> 成功，通过旅行助手 `学习 / 模拟 / 源码` 三页签结构后的生产构建验证。
- 2026-03-30: 提权执行 `cd web && npm run build`（旅行助手源码目录视图 + 总览页瘦身 follow-up） -> 成功，通过文件目录式源码展示和教程总览页精简后的生产构建验证。
- 2026-03-30: 提权执行 `cd web && npm run build`（旅行助手源码宽度 + 目录折叠 follow-up） -> 成功，通过 `max-w-6xl` 源码阅读宽度和可折叠目录布局后的生产构建验证。
- 2026-03-30: `cd web && npm run build`（旅行助手源码目录折叠动画 follow-up） -> 成功，通过折叠动画增强后的生产构建验证。

## Decisions
- 用“删掉 handcrafted visualization 挂载 + 保留 simulator”的方式，降低维护成本而不牺牲可播放演示。
- 旅行助手将补一个专用 sidebar 组件，视觉和交互对齐 Claude Code 路线，但内容结构仍保留教程总览与课时页。
- 首页只承担“多系列教程入口”职责，不再承载 Claude Code 单路线的深度讲解。

## Completion summary for next task
- Claude Code 路线顶部 handcrafted visualization 已全部移除，版本页只保留 tab + simulator 模式。
- handcrafted visualization 相关组件、hooks 和首页 `MessageFlow` 都已删除，避免后续继续维护死代码。
- 旅行助手现在有独立 `layout.tsx` 和左侧 `TravelSidebar`，桌面布局与 Claude Code 路线一致。
- 首页已经改成教程合集入口页，避免继续把 Claude Code 单路线内容堆在主页。
- Claude Code 12 节版本页现在只保留“学习 / 模拟 / 源码”三个页签，`深入探索` 已正式移除。
- Claude Code 12 节左侧导航现在使用“编程第一课...编程第十二课”命名，同时版本页头部仍保留具体概念名。
- Claude Code 12 节左侧导航最终使用“第一课：Agent 循环”这类命名，页头则展示 `s01 + 第一课 + Agent 循环` 的组合。
- Claude Code 12 节当前不再向用户展示 `s01/s02/...` 前缀，保留“第一课：Agent 循环”这类课程命名和页头知识点标题。
- 旅行助手路线此前之所以“像另一个站点”，主要是因为它有独立的绿色 hero、目录卡片和单课翻页卡片；现在这些骨架已改回与 Claude Code 路线一致的教程页语法。
- 旅行助手此前之所以只有第四课出现模拟，是因为 `travel-assistant-scenarios.ts` 里当时只定义了 `lesson-4`；现在 1-5 课都已有场景，并统一通过 tabs 切换“学习 / 模拟”。
- 旅行助手现在不仅有“学习 / 模拟”，还会从用户粘贴的 `第二章：langchain 基础旅行助手` 目录读取实际源码，按课时展示“源码”页签。
- 旅行助手教程总览页现在只承担“入口页”职责，不再重复承载整套长篇教程内容；具体内容进入课时页再看。
- 当源码页签引入文件目录后，代码区会因 `max-w-3xl` 外层和目录栏宽度而变窄；现在已通过“页宽放大 + 目录可折叠”两步一起缓解。
- 文件目录现在不仅能折叠，而且有明显的过渡反馈，不再是生硬地瞬间收起。
- 本任务验证基线仍是 `cd web && npm run build`，并已通过。

## Next session start here
- 先读 `AGENTS.md` 和 `tasks/registry.json`，再决定是否需要用 `$long-task-dev` 新开任务。
