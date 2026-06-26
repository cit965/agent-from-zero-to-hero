export type PiStatus =
  | "implemented"
  | "partial"
  | "not-implemented"
  | "different-paradigm";

export type TutorialId =
  | "s01"
  | "s02"
  | "s03"
  | "s04"
  | "s05"
  | "s06"
  | "s07"
  | "s08"
  | "s09"
  | "s10"
  | "s11"
  | "s12";

export interface PiCodeSnippet {
  language: "ts" | "tsx";
  code: string;
  caption?: string;
}

export interface PiPrimaryFile {
  path: string;
  role: string;
  snippet?: PiCodeSnippet;
}

export interface PiRelatedDemo {
  name: string;
  description: string;
}

export interface PiImplementation {
  tutorialId: TutorialId;
  status: PiStatus;
  summary: string;
  primaryFiles: PiPrimaryFile[];
  relatedDemos?: PiRelatedDemo[];
  divergenceNotes?: string;
  keyInsight?: string;
}

export const piImplementations: PiImplementation[] = [
  {
    tutorialId: "s01",
    status: "implemented",
    summary:
      "pi 用嵌套的双层 while 循环实现 Agent 循环：外层接收后续 follow-up steering 消息，内层把模型回复、工具调用、工具结果串成一轮轮 turn。",
    primaryFiles: [
      {
        path: "packages/agent/src/agent-loop.ts",
        role: "Agent 内核 runLoop：双层 while 循环 + 流式模型回复 + 工具调度",
        snippet: {
          language: "ts",
          caption: "agent-loop.ts:170-216  外层 while + 内层 while",
          code: `while (true) {
  let hasMoreToolCalls = true;

  // Inner loop: process tool calls and steering messages
  while (hasMoreToolCalls || pendingMessages.length > 0) {
    if (!firstTurn) {
      await emit({ type: "turn_start" });
    } else {
      firstTurn = false;
    }

    // Process pending messages (inject before next assistant response)
    if (pendingMessages.length > 0) {
      for (const message of pendingMessages) {
        await emit({ type: "message_start", message });
        await emit({ type: "message_end", message });
        currentContext.messages.push(message);
        newMessages.push(message);
      }
      pendingMessages = [];
    }

    // Stream assistant response
    const message = await streamAssistantResponse(currentContext, config, signal, emit, streamFn);
    newMessages.push(message);

    if (message.stopReason === "error" || message.stopReason === "aborted") {
      await emit({ type: "turn_end", message, toolResults: [] });
      await emit({ type: "agent_end", messages: newMessages });
      return;
    }

    // Check for tool calls
    const toolCalls = message.content.filter((c) => c.type === "toolCall");

    const toolResults: ToolResultMessage[] = [];
    hasMoreToolCalls = false;
    if (toolCalls.length > 0) {
      const executedToolBatch = await executeToolCalls(currentContext, message, config, signal, emit);
      toolResults.push(...executedToolBatch.messages);
      hasMoreToolCalls = !executedToolBatch.terminate;

      for (const result of toolResults) {
        currentContext.messages.push(result);
        newMessages.push(result);
      }
    }`,
        },
      },
    ],
    relatedDemos: [
      {
        name: "AgentLoopSimulator",
        description: "Web 端的循环可视化器，可与 s01 实现对照观察消息流",
      },
    ],
    keyInsight:
      "最小 Agent 不是「一个 while 循环」,而是「嵌套 while 循环」,外层收 follow-up steering、内层把模型与工具串起来。",
  },
  {
    tutorialId: "s02",
    status: "implemented",
    summary:
      "pi 用 switch 分发表注册 7 个核心工具（bash/read/write/edit/grep/find/ls），每个工具一对工厂函数（createXxxTool + createXxxToolDefinition），主循环通过 executeToolCalls 统一调度。",
    primaryFiles: [
      {
        path: "packages/coding-agent/src/core/tools/index.ts",
        role: "工具分发表 createTool / createToolDefinition 的 switch 路由",
        snippet: {
          language: "ts",
          caption: "tools/index.ts:117-136  工具 dispatch switch",
          code: `export function createTool(toolName: ToolName, cwd: string, options?: ToolsOptions): Tool {
  switch (toolName) {
    case "read":
      return createReadTool(cwd, options?.read);
    case "bash":
      return createBashTool(cwd, options?.bash);
    case "edit":
      return createEditTool(cwd, options?.edit);
    case "write":
      return createWriteTool(cwd, options?.write);
    case "grep":
      return createGrepTool(cwd, options?.grep);
    case "find":
      return createFindTool(cwd, options?.find);
    case "ls":
      return createLsTool(cwd, options?.ls);
    default:
      throw new Error(\`Unknown tool name: \${toolName}\`);
  }
}`,
        },
      },
      {
        path: "packages/coding-agent/src/core/tools/bash.ts",
        role: "单个工具工厂函数示例",
      },
    ],
    relatedDemos: [
      {
        name: "AgentLoopSimulator",
        description: "切换工具开启/关闭状态时观察 dispatch 行为",
      },
    ],
    keyInsight:
      "工具分发表让循环保持不变——加工具 = 加 switch case + 一个工厂函数。",
  },
  {
    tutorialId: "s03",
    status: "implemented",
    summary:
      "pi 把 TodoWrite 实现为一个 Extension（而非核心模块），通过 registerTool 暴露给 LLM，并利用 session_manager.getBranch() 在每个会话事件里重建内存状态。",
    primaryFiles: [
      {
        path: "packages/coding-agent/examples/extensions/todo.ts",
        role: "Todo Extension：注册工具 + 从 session 重建状态",
        snippet: {
          language: "ts",
          caption: "extensions/todo.ts:114-129  reconstructState 重建内存状态",
          code: `const reconstructState = (ctx: ExtensionContext) => {
  todos = [];
  nextId = 1;

  for (const entry of ctx.sessionManager.getBranch()) {
    if (entry.type !== "message") continue;
    const msg = entry.message;
    if (msg.role !== "toolResult" || msg.toolName !== "todo") continue;

    const details = msg.details as TodoDetails | undefined;
    if (details) {
      todos = details.todos;
      nextId = details.nextId;
    }
  }
};`,
        },
      },
    ],
    divergenceNotes:
      "pi 的 todo 是单一扁平列表，没有 s07 那种依赖图与并行/阻塞语义；并行协调放在 orchestrator 那一层。",
    keyInsight:
      "把 todo 当 extension 写而不是核心模块，让它能跟随 session 自动重建——状态来自历史，不在内存里。",
  },
  {
    tutorialId: "s04",
    status: "implemented",
    summary:
      "pi 的 subagent 通过 spawn 启动一个独立的 pi 子进程，把任务作为命令行参数传入；父子之间通过 stdout JSONL 事件流通信，子进程自己的 messages[] 完全隔离。",
    primaryFiles: [
      {
        path: "packages/coding-agent/examples/extensions/subagent/index.ts",
        role: "subagent spawn：子进程派生 + JSONL 事件流解析",
        snippet: {
          language: "ts",
          caption: "subagent/index.ts:333-410  spawn 子进程并按行解析事件",
          code: `const exitCode = await new Promise<number>((resolve) => {
  const invocation = getPiInvocation(args);
  const proc = spawn(invocation.command, invocation.args, {
    cwd: cwd ?? defaultCwd,
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let buffer = "";

  const processLine = (line: string) => {
    if (!line.trim()) return;
    let event: any;
    try {
      event = JSON.parse(line);
    } catch {
      return;
    }

    if (event.type === "message_end" && event.message) {
      const msg = event.message as Message;
      currentResult.messages.push(msg);

      if (msg.role === "assistant") {
        currentResult.usage.turns++;
        // ...accumulate usage, model, stopReason...
      }
      emitUpdate();
    }

    if (event.type === "tool_result_end" && event.message) {
      currentResult.messages.push(event.message as Message);
      emitUpdate();
    }
  };

  proc.stdout.on("data", (data) => {
    buffer += data.toString();
    const lines = buffer.split("\\n");
    buffer = lines.pop() || "";
    for (const line of lines) processLine(line);
  });`,
        },
      },
      {
        path: "packages/coding-agent/examples/extensions/subagent/agents.ts",
        role: "子 Agent 角色注册表（system prompt + 工具集）",
      },
    ],
    keyInsight:
      "subagent 不是「在主循环里 fork 一段消息」,而是「spawn 一个完整 pi 进程」——隔离是操作系统级的，消息流只是 IPC 投影。",
  },
  {
    tutorialId: "s05",
    status: "implemented",
    summary:
      "pi 把技能拆成两层：底层 loadSkills() 负责扫描目录、解析 frontmatter、忽略 .gitignore；上层 formatSkillInvocation() 把技能内容打包成 <skill> 块，在模型调用时按需注入。",
    primaryFiles: [
      {
        path: "packages/agent/src/harness/skills.ts",
        role: "通用 Skill 加载器（目录扫描 + frontmatter 解析 + ignore）",
        snippet: {
          language: "ts",
          caption: "harness/skills.ts:38-75  formatSkillInvocation + loadSkills",
          code: `export function formatSkillInvocation(skill: Skill, additionalInstructions?: string): string {
  const skillBlock = \`<skill name="\${skill.name}" location="\${skill.filePath}">
References are relative to \${dirnameEnvPath(skill.filePath)}.

\${skill.content}
</skill>\`;
  return additionalInstructions ? \`\${skillBlock}\\n\\n\${additionalInstructions}\` : skillBlock;
}

export async function loadSkills(
  env: ExecutionEnv,
  dirs: string | string[],
): Promise<{ skills: Skill[]; diagnostics: SkillDiagnostic[] }> {
  const skills: Skill[] = [];
  const diagnostics: SkillDiagnostic[] = [];
  for (const dir of Array.isArray(dirs) ? dirs : [dirs]) {
    const rootInfoResult = await env.fileInfo(dir);
    if (!rootInfoResult.ok) {
      if (rootInfoResult.error.code !== "not_found") {
        diagnostics.push({ type: "warning", code: "file_info_failed", message: rootInfoResult.error.message, path: dir });
      }
      continue;
    }
    const rootInfo = rootInfoResult.value;
    if ((await resolveKind(env, rootInfo, diagnostics)) !== "directory") continue;
    const result = await loadSkillsFromDirInternal(env, rootInfo.path, true, ignore(), rootInfo.path);
    skills.push(...result.skills);
    diagnostics.push(...result.diagnostics);
  }
  return { skills, diagnostics };
}`,
        },
      },
      {
        path: "packages/coding-agent/src/core/skills.ts",
        role: "coding-agent 层：包装 loadSkills，加 source-info / diagnostics 风格",
      },
    ],
    keyInsight:
      "技能内容不是预塞进系统提示词，而是在调用时通过 tool_result 注入——保持系统提示词精简，把加载交给目录扫描。",
  },
  {
    tutorialId: "s06",
    status: "implemented",
    summary:
      "pi 把压缩拆成两层：agent 层做通用的「找切点」（findCutPoint：跳过 toolResult、只在 assistant/user/bashExecution 处切），coding-agent 层再做「为被切掉的分支生成 branch summary」,让会话树导航时不会丢上下文。",
    primaryFiles: [
      {
        path: "packages/agent/src/harness/compaction/compaction.ts",
        role: "通用压缩工具 findCutPoint / findValidCutPoints",
        snippet: {
          language: "ts",
          caption: "compaction/compaction.ts:265-303  收集合法切点",
          code: `function findValidCutPoints(entries: SessionTreeEntry[], startIndex: number, endIndex: number): number[] {
  const cutPoints: number[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    const entry = entries[i];
    switch (entry.type) {
      case "message": {
        const role = entry.message.role;
        switch (role) {
          case "bashExecution":
          case "custom":
          case "branchSummary":
          case "compactionSummary":
          case "user":
          case "assistant":
            cutPoints.push(i);
            break;
          case "toolResult":
            break;
        }
        break;
      }
      case "thinking_level_change":
      case "model_change":
      case "active_tools_change":
      case "compaction":
      case "branch_summary":
      case "custom":
      case "custom_message":
      case "label":
      case "session_info":
      case "leaf":
        break;
    }
    if (entry.type === "branch_summary" || entry.type === "custom_message") {
      cutPoints.push(i);
    }
  }
  return cutPoints;
}`,
        },
      },
      {
        path: "packages/coding-agent/src/core/compaction/branch-summarization.ts",
        role: "为分支生成 summary 的编排（serializeConversation + SUMMARIZATION_SYSTEM_PROMPT）",
      },
    ],
    keyInsight:
      "压缩不只是「砍掉前面的消息」,还要给被砍掉的分支留 summary——会话树上的任意分支都能复盘。",
  },
  {
    tutorialId: "s07",
    status: "partial",
    summary:
      "pi 的 todo extension 只维护一个扁平 in_progress 列表（add / toggle / list / clear），没有任何 dependency / blocked_by / ready / parallel 这些字段；任务图与状态机完全缺失。",
    primaryFiles: [
      {
        path: "packages/coding-agent/examples/extensions/todo.ts",
        role: "扁平 todo 工具实现（无依赖图）",
        snippet: {
          language: "ts",
          caption: "todo.ts  扁平数组 + switch actions",
          code: `pi.registerTool({
  name: "todo",
  label: "Todo",
  description: "Manage a todo list. Actions: list, add (text), toggle (id), clear",
  parameters: TodoParams,

  async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
    switch (params.action) {
      case "list":
        return { content: [{ type: "text", text: todos.length ? todos.map(t => \`[\${t.status}] \${t.id}: \${t.content}\`).join("\\n") : "(empty)" }] };
      // ... add / toggle / clear operate on a flat array ...
    }
  },
});`,
        },
      },
    ],
    divergenceNotes:
      "s07 要求的「依赖图 + 文件式 task + 状态机」在 pi 中分散到 orchestrator supervisor 和外部 task board，没有任何内嵌的 DAG 工具可以交给 LLM 调用；multi-agent 的任务编排走的是 orchestrator + storage 而非 todo 工具。",
    keyInsight:
      "扁平 todo 适合个人提示；带依赖关系的任务图属于「团队级编排」,pi 把它外置到 orchestrator。",
  },
  {
    tutorialId: "s08",
    status: "partial",
    summary:
      "pi 把「后台任务」拆成两类：subagent（spawn 一个子 pi 进程独立跑任务，主进程流式读它的 JSONL）和 rpc-process（orchestrator 维护一组 long-lived 实例）。但没有显式的「通知队列」抽象——后台结果通过事件流被主进程订阅。",
    primaryFiles: [
      {
        path: "packages/orchestrator/src/rpc-process.ts",
        role: "RpcProcessInstance：spawn 子 pi 进程 + JSONL 请求/响应 + 事件订阅",
        snippet: {
          language: "ts",
          caption: "rpc-process.ts:25-60  进程生命周期 + pendingRequests",
          code: `export class RpcProcessInstance {
  readonly process: ChildProcess;

  private exited = false;
  private nextRequestId = 0;
  private stdoutBuffer = "";
  private stderrBuffer = "";
  private readonly pendingRequests = new Map<string, PendingRequest>();
  private readonly eventListeners = new Set<(event: AgentSessionEvent) => void>();
  private readonly exitListeners = new Set<(error?: Error) => void>();
  private uiRequestHandler: ((request: RpcExtensionUIRequest) => void) | undefined;

  constructor(options: { cwd: string }) {
    const rpcCommand = this.getSpawnCommand();
    this.process = spawn(rpcCommand.command, rpcCommand.args, {
      cwd: options.cwd,
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (!this.process.stdin || !this.process.stdout) {
      throw new Error("Failed to create RPC process stdio");
    }
    this.attachListeners();
  }`,
        },
      },
      {
        path: "packages/coding-agent/examples/extensions/subagent/index.ts",
        role: "subagent：一次性后台任务（spawn → 收集 message_end → 返回）",
      },
    ],
    divergenceNotes:
      "没有 s08 那种「BackgroundManager + 显式通知队列」结构——所有后台输出都通过 AgentSessionEvent 事件流实时推给监听者，主进程不需要主动 poll 通知队列。",
    keyInsight:
      "「后台」在 pi 里等于「独立进程 + 事件流」——没有专用队列，因为事件流本身就是队列。",
  },
  {
    tutorialId: "s09",
    status: "implemented",
    summary:
      "pi 的多 Agent 团队由 orchestrator 包承担：OrchestratorSupervisor 维护一组 RpcProcessInstance（每个实例是一个 pi 子进程），订阅它们的事件并把状态持久化到 storage（instances.json）。",
    primaryFiles: [
      {
        path: "packages/orchestrator/src/supervisor.ts",
        role: "OrchestratorSupervisor：实例集合 + 状态机 + 事件订阅",
        snippet: {
          language: "ts",
          caption: "supervisor.ts:63-82  supervisor 类骨架",
          code: `export class OrchestratorSupervisor {
  private readonly liveInstances = new Map<string, LiveInstance>();

  private setStatus(live: LiveInstance, status: InstanceStatus): void {
    live.record = {
      ...live.record,
      status,
      lastSeenAt: new Date().toISOString(),
    };
    upsertInstance(live.record);
  }

  private updateRecord(live: LiveInstance, updates: Partial<InstanceRecord>): void {
    live.record = {
      ...live.record,
      ...updates,
      lastSeenAt: new Date().toISOString(),
    };`,
        },
      },
      {
        path: "packages/orchestrator/src/storage.ts",
        role: "实例持久化（instances.json upsert / list / get / remove）",
      },
      {
        path: "packages/orchestrator/src/types.ts",
        role: "InstanceRecord / InstanceStatus 类型定义",
      },
    ],
    keyInsight:
      "「队友」在 pi 里等于「一个 supervisor 维护的 RpcProcessInstance」——你通过 orchestrator 调度它们，而不是把它们写进 messages[]。",
  },
  {
    tutorialId: "s10",
    status: "partial",
    summary:
      "pi 的 IPC 协议用 JSONL 帧（encodeMessage / parseRequestLine / parseResponseLine）按行传输，但 request-id 只在 RpcProcessInstance 内部用 nextRequestId 单调递增；orchestrator 与外部客户端之间没有共享 request-id（spawn / list / stop / rpc 各是独立顶层 type）。",
    primaryFiles: [
      {
        path: "packages/orchestrator/src/ipc/protocol.ts",
        role: "JSONL 帧编码 + 请求/响应类型表",
        snippet: {
          language: "ts",
          caption: "protocol.ts:130-142  JSONL 编码与解析",
          code: `export function encodeMessage(message: ProtocolMessage): string {
  return \`\${JSON.stringify(message)}\\n\`;
}

export function parseRequestLine(line: string): OrchestratorRequest {
  const value = JSON.parse(line) as OrchestratorRequest;
  return value;
}

export function parseResponseLine(line: string): OrchestratorResponse {
  const value = JSON.parse(line) as OrchestratorResponse;
  return value;
}`,
        },
      },
      {
        path: "packages/orchestrator/src/ipc/client.ts",
        role: "客户端：写请求 → 读 JSONL → 派发到 pendingRequests",
      },
      {
        path: "packages/orchestrator/src/ipc/server.ts",
        role: "服务端：按行读 JSONL → 路由到对应 handler",
      },
      {
        path: "packages/coding-agent/src/modes/rpc/",
        role: "coding-agent 内部的 RPC mode（被 orchestrator 启动）",
      },
    ],
    divergenceNotes:
      "s10 强调「两个协议共用 request-id 关联请求-响应」,pi 在 coding-agent 子进程内部确实用了共享 request-id，但 orchestrator ↔ supervisor ↔ 子进程这一层用的是「type 字段分桶」,没有暴露一个跨层的 request-id。",
    keyInsight:
      "JSONL 是天然的「每行一个请求」流——帧边界就是消息边界，request-id 只是进程内的 pendingRequests 索引。",
  },
  {
    tutorialId: "s11",
    status: "not-implemented",
    summary:
      "pi 没有「自主 Agent」轮询任务板并自己认领任务的机制：orchestrator 只能由用户（CLI/serve）或上层 supervisor 显式发起 spawn / rpc，子进程本身没有自治理循环。",
    primaryFiles: [],
    divergenceNotes:
      "s11 要求的「team-mate 主动扫描任务板 / 超时自治理 / 心跳」在 pi 中完全不存在。所有 pi 实例都是「被请求驱动」的：subagent 收到 task 才运行；orchestrator 实例也是被 spawn 才存在。",
    keyInsight:
      "pi 的多 Agent 模型是「请求-响应」,不是「轮询自治理」——你不会看到一个 pi 实例自己起来扫描磁盘找活干。",
  },
  {
    tutorialId: "s12",
    status: "different-paradigm",
    summary:
      "pi 的「任务隔离」走的是 VM 沙箱路线，而不是 git-worktree 路线：gondolin extension 把内置工具路由到一个本地 micro-VM（QEMU），sandbox extension 用 @anthropic-ai/sandbox-runtime 提供隔离执行。",
    primaryFiles: [
      {
        path: "packages/coding-agent/examples/extensions/gondolin/index.ts",
        role: "Gondolin VM 扩展：把内置工具的执行路由到 micro-VM",
        snippet: {
          language: "ts",
          caption: "extensions/gondolin/index.ts:1-30  VM 入口",
          code: `/**
 * Gondolin Tool Routing Example
 *
 * Runs pi's built-in tools inside a local Gondolin micro-VM. The host working
 * directory is mounted at /workspace in the guest. File changes under
 * /workspace write through to the host; other guest filesystem changes are
 * isolated to the VM.
 */

import path from "node:path";
import { RealFSProvider, VM } from "@earendil-works/gondolin";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import {
  type BashOperations,
  createBashTool,
  createEditTool,
  createFindTool,
  createGrepTool,`,
        },
      },
      {
        path: "packages/coding-agent/examples/extensions/sandbox/",
        role: "Sandbox Runtime 扩展（@anthropic-ai/sandbox-runtime）",
      },
    ],
    divergenceNotes:
      "s12 的 git-worktree 模型（每个任务一个 worktree、共享 task board event 流）在 pi 中完全没有对应实现。pi 走的是「每个任务一个进程（或一个 VM）」路线——隔离的维度不是文件系统分支，而是进程/虚拟机的地址空间与文件系统视图。",
    keyInsight:
      "pi 用「进程 + VM」隔离，s12 用「worktree + 共享 board」隔离——目标是「不让任务互相干扰」,但抽象层次差一层。",
  },
];

export function getPiImplementation(id: string): PiImplementation | undefined {
  return piImplementations.find((p) => p.tutorialId === id);
}

export function getPiStats() {
  const stats = {
    implemented: 0,
    partial: 0,
    notImplemented: 0,
    differentParadigm: 0,
  };
  for (const impl of piImplementations) {
    if (impl.status === "implemented") stats.implemented++;
    else if (impl.status === "partial") stats.partial++;
    else if (impl.status === "not-implemented") stats.notImplemented++;
    else if (impl.status === "different-paradigm") stats.differentParadigm++;
  }
  return stats;
}
