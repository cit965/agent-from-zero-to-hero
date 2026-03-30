# Agent 从零到一

一个围绕 Agent 学习与实践的教程仓库。

这个项目现在不再只是单独讲 Claude Code，而是整理成一组渐进式教程，帮助你从最小 Agent 循环出发，一路走到工具调用、规划、记忆、协作，以及 LangChain 应用落地。

## 这是什么

仓库当前有两条主学习路线：

### 1. 手搓 Claude Code

一共 12 课，偏向 Coding Agent / Harness 拆解，按机制递进：

1. Agent 循环
2. 工具
3. TodoWrite
4. 子 Agent
5. 技能
6. 上下文压缩
7. 任务系统
8. 后台任务
9. Agent 团队
10. 团队协议
11. 自主 Agent
12. Worktree + 任务隔离

对应源码现在在 `tutorials/agents/` 目录下，从 `s01_agent_loop.py` 一直到 `s12_worktree_task_isolation.py`。

### 2. LangChain 旅行助手

一共 5 课，偏向应用实战，按“先跑通，再增强”推进：

1. LangChain 入门
2. 添加真实工具
3. 记忆与多轮对话
4. 工作流与复杂任务
5. 完整旅行助手

这一条路线除了教程内容外，还接入了真实源码展示、模拟运行和运行截图。旅行助手示例源码现在放在 `tutorials/travel/`，网站会按课时读取并展示。

## 仓库结构

```text
.
├── tutorials/
│   ├── agents/                     # Claude Code 风格 Agent 的 12 个渐进式 Python 示例
│   └── travel/                     # LangChain 旅行助手 5 节课源码
├── docs/                           # 文档素材
├── skills/                         # 本地 skill 示例
├── web/                            # Next.js 教程站点
│   ├── src/app/                    # 页面路由
│   ├── src/components/             # 教程 UI / 模拟器 / 源码浏览组件
│   ├── src/data/                   # 教程正文、场景、源码索引、截图等数据
│   └── scripts/                    # 构建前内容提取脚本
├── tasks/                          # long-task 工作记录
└── AGENTS.md                       # 仓库协作约定
```

## 快速开始

### Python 示例

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

根目录的 `.env.example` 默认面向 Anthropic 兼容接口，支持 Anthropic、GLM、Kimi、DeepSeek、MiniMax 等模型供应商。

先跑第一课：

```sh
python tutorials/agents/s01_agent_loop.py
```

如果你想直接看完整形态，也可以运行：

```sh
python tutorials/agents/s12_worktree_task_isolation.py
```

### 教程网站

```sh
cd web
npm install
npm run dev
```

本地启动后，打开 `http://localhost:3000`。

`web` 项目在 `dev` 和 `build` 前都会自动执行一次内容提取，所以通常不需要单独手动处理教程数据。

## 常用命令

```sh
# 仅提取站点内容
cd web && npm run extract

# 生产构建校验
cd web && npm run build
```

## 学习建议

- 想理解 Coding Agent 怎么搭起来：从 `tutorials/agents/s01_agent_loop.py` 开始，一课一课往后看。
- 想先做出一个能跑的 Agent 应用：从网站里的 LangChain 旅行助手路线开始。
- 想边学边对照 UI：直接运行 `web`，在教程页里切换“学习 / 模拟 / 源码”。

## 当前项目定位

这个仓库现在更适合作为一个“Agent 教程合集”，而不是单一路线的概念宣言页。我们把重点放在：

- 让每条路线都有清晰的课程顺序
- 让教程、模拟和源码能对应起来
- 让读者能既看原理，也看真实工程结构

如果你只是第一次打开仓库，推荐顺序是：

1. 读这份 README
2. 打开 `web` 站点看教程目录
3. 进入 `tutorials/agents/` 或 `tutorials/travel/` 继续深入
