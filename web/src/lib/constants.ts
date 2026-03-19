export const VERSION_ORDER = [
  "s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09", "s10", "s11", "s12"
] as const;

export const LEARNING_PATH = VERSION_ORDER;

export type VersionId = typeof LEARNING_PATH[number];

export const VERSION_META: Record<string, {
  title: string;
  subtitle: string;
  coreAddition: string;
  keyInsight: string;
  layer: "tools" | "planning" | "memory" | "concurrency" | "collaboration";
  prevVersion: string | null;
}> = {
  s01: { title: "Agent 循环", subtitle: "Bash 就够了", coreAddition: "单工具 Agent 循环", keyInsight: "最小 Agent 内核就是 while 循环加一个工具", layer: "tools", prevVersion: null },
  s02: { title: "工具", subtitle: "每个工具一个处理器", coreAddition: "工具分发表", keyInsight: "循环保持不变；新工具只需注册到分发表", layer: "tools", prevVersion: "s01" },
  s03: { title: "TodoWrite", subtitle: "先计划，再行动", coreAddition: "TodoManager + 提醒器", keyInsight: "没有计划的 Agent 会漂移；先列步骤再执行", layer: "planning", prevVersion: "s02" },
  s04: { title: "子 Agent", subtitle: "每个子任务一个干净上下文", coreAddition: "隔离 messages[] 的子 Agent 派生", keyInsight: "子 Agent 使用独立 messages[]，主对话保持干净", layer: "planning", prevVersion: "s03" },
  s05: { title: "技能", subtitle: "按需加载", coreAddition: "SkillLoader + 双层注入", keyInsight: "知识应在需要时通过 tool_result 注入，而不是预塞进系统提示词", layer: "planning", prevVersion: "s04" },
  s06: { title: "上下文压缩", subtitle: "三层压缩策略", coreAddition: "微压缩 + 自动压缩 + 归档", keyInsight: "上下文迟早会填满；三层压缩策略让会话可持续", layer: "memory", prevVersion: "s05" },
  s07: { title: "任务系统", subtitle: "任务图与依赖关系", coreAddition: "基于文件状态与依赖图的 TaskManager", keyInsight: "带顺序、并行与依赖的文件式任务图，是多 Agent 协作的协调骨架", layer: "planning", prevVersion: "s06" },
  s08: { title: "后台任务", subtitle: "后台线程与通知", coreAddition: "BackgroundManager + 通知队列", keyInsight: "慢操作放到后台运行，Agent 可以继续向前思考", layer: "concurrency", prevVersion: "s07" },
  s09: { title: "Agent 团队", subtitle: "队友与邮箱", coreAddition: "TeammateManager + 文件邮箱", keyInsight: "单个 Agent 做不完时，通过异步邮箱委托给常驻队友", layer: "collaboration", prevVersion: "s08" },
  s10: { title: "团队协议", subtitle: "共享通信规则", coreAddition: "两个协议共用 request_id 关联", keyInsight: "一个请求-响应模式驱动整个团队协商", layer: "collaboration", prevVersion: "s09" },
  s11: { title: "自主 Agent", subtitle: "扫描任务板并自行认领", coreAddition: "任务板轮询 + 基于超时的自治理", keyInsight: "队友自己扫描任务板并认领任务，不需要主控逐个分配", layer: "collaboration", prevVersion: "s10" },
  s12: { title: "Worktree 与任务隔离", subtitle: "按目录隔离执行", coreAddition: "可组合的 worktree 生命周期 + 共享任务板事件流", keyInsight: "任务管理目标，worktree 管理目录，二者用 ID 绑定", layer: "collaboration", prevVersion: "s11" },
};

export const LAYERS = [
  { id: "tools" as const, label: "工具与执行", color: "#3B82F6", versions: ["s01", "s02"] },
  { id: "planning" as const, label: "规划与协调", color: "#10B981", versions: ["s03", "s04", "s05", "s07"] },
  { id: "memory" as const, label: "内存管理", color: "#8B5CF6", versions: ["s06"] },
  { id: "concurrency" as const, label: "并发", color: "#F59E0B", versions: ["s08"] },
  { id: "collaboration" as const, label: "协作", color: "#EF4444", versions: ["s09", "s10", "s11", "s12"] },
] as const;
