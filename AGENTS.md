# 仓库协作指南

## 项目定位
- 这个仓库现在是一个 `Agent 从零到一` 的教程合集，不再是只围绕单一路线的 Claude Code 拆解项目。
- 当前有两条主要学习路线：
  - `手搓 Claude Code`：12 节渐进式 Python 课程，重点讲 coding agent / harness 的核心机制。
  - `LangChain 旅行助手`：5 节应用实战课，重点讲工具、记忆、工作流和 Web 界面如何落地成一个真实 Agent 应用。
- `web/` 首页应被维护为“教程入口页”，不要再把某一条路线的大段深度内容继续堆回首页。
- 用户可见的课程命名优先使用 `第一课：...` 这种格式，不要直接显示 `s01/s02/...` 这类内部编号。

<!-- long-task-dev:start -->
## 长任务工作流
- 跨多次会话、多个里程碑或需要交接的工作，使用 `$long-task-dev`。
- 任意时刻只保留一个 active long task。
- 每个长任务都放在 `tasks/<task-slug>/` 下单独维护。
- 全局任务注册表：`tasks/registry.json`。
- 默认任务文件集合：
  - `prompt.md`
  - `plan.md`
  - `status.md`
- 当前 active task 目录：`tasks/remove-handcrafted-visualizations-and-unify-tutorial-layouts`。
- 上一个任务目录：`tasks/add-travel-assistant-playable-simulator-example`。
- 最近完成的任务：`tasks/add-travel-assistant-playable-simulator-example`。
- 当前 active task 的 session floor：至少 `15` 分钟、`3` 个 cycle，规则为 `all`，每 `5` 分钟自检一次。
- 恢复上下文时的阅读顺序：`AGENTS.md` -> `tasks/registry.json` -> active task 的 `prompt.md` -> `plan.md` -> `status.md` 或 `documentation.md` -> 可选 `feature-list.json`。
- 开启新长任务时，请重新运行 scaffold，让 active pointer 自动切到新目录，并同步更新 `tasks/registry.json`，不要手改多份文件。
- 真正开始新任务前，先阅读前一个任务记录的 summary 文件。
- 深入实现前先启动受保护的工作会话；除非任务被阻塞或已满足 session floor，否则不要提前结束。
- 以 `plan.md` 作为执行顺序、验证要求和范围边界的唯一真源。
- 每次收尾前把仓库整理到可继续工作的状态，并更新 `status.md`。
- 如果仓库还没有“一条命令启动”或“单命令 smoke test”，优先补上并记录在这里。
<!-- long-task-dev:end -->

## 项目结构与模块组织
- 主要学习内容位于仓库根目录：
  - `tutorials/agents/`：`s01` 到 `s12` 的渐进式 Python Agent 示例
  - `tutorials/travel/`：旅行助手 lesson01-05 的源码目录
  - `docs/`：配套文档素材
  - `skills/`：示例中使用的本地 skill 定义
- 交互式教程网站位于 `web/`：
  - `web/src/app/`：Next.js App Router 页面
  - `web/src/components/`：教程 UI、布局、模拟器、源码面板等组件
  - `web/src/data/`：教程 markdown、模拟场景、源码索引、截图等数据
  - `web/scripts/`：开发和构建前运行的内容提取脚本
- 长任务文件统一放在 `tasks/<task-slug>/` 下。

## 构建、测试与开发命令
- 安装前端依赖：`cd web && npm install`
- 启动开发环境：`cd web && npm run dev`
- 仅提取教程内容：`cd web && npm run extract`
- 冒烟验证：`cd web && npm run build`
- 当前仓库根目录没有统一的 lint / test 命令；涉及 UI 或教程内容时，默认用 `cd web && npm run build` 作为必做验证。

## 验证规则
- 修改范围要尽量收敛在当前 active task 内。
- 对重复使用的启动流程，优先沉淀成单命令或脚本。
- 只要改动了 `web/src/data`、教程渲染逻辑或页面结构，结束前都要执行 `cd web && npm run build`。
- 像 `README.md`、`AGENTS.md` 这种根目录纯文档更新，如果没有影响 `web/` 的渲染或数据加载，可以不跑 build。
- 关闭一个长任务并开启下一个时，使用 scaffold 更新 active pointer，不要手工同步多份任务文件。
