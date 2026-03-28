import type { Scenario } from "@/types/agent-data";

export const travelAssistantLessonScenarios: Record<string, Scenario> = {
  "lesson-4": {
    version: "travel-lesson-4",
    title: "旅行规划播放演示",
    description:
      "这是一个根据第四课内容抽象出的演示步骤，不是真实运行日志。它展示了 Agent 如何串联天气、景点和交通工具调用。",
    steps: [
      {
        type: "user_message",
        content:
          "我想在春节期间从北京去上海玩 3 天，请帮我查看天气、推荐景点、估算交通时间，并给出一个简单建议。",
        annotation: "用户提出一个需要多工具协作的旅行规划请求",
      },
      {
        type: "assistant_text",
        content: "我会先查北京和上海天气，再看上海景点，最后估算北京到上海的交通时间。",
        annotation: "模型先形成执行顺序，而不是直接输出一段大段建议",
      },
      {
        type: "tool_call",
        toolName: "get_weather",
        content: 'get_weather("北京")',
        annotation: "第一步先查出发地天气",
      },
      {
        type: "tool_result",
        toolName: "get_weather",
        content: "北京：晴，温度 2°C",
        annotation: "Agent 收到北京天气结果并写入上下文",
      },
      {
        type: "tool_call",
        toolName: "get_weather",
        content: 'get_weather("上海")',
        annotation: "接着查询目的地天气",
      },
      {
        type: "tool_result",
        toolName: "get_weather",
        content: "上海：多云，温度 8°C",
        annotation: "Agent 现在已经有两地天气，可以继续扩展计划",
      },
      {
        type: "tool_call",
        toolName: "search_attractions",
        content: 'search_attractions("上海")',
        annotation: "查询上海热门景点，补齐游玩信息",
      },
      {
        type: "tool_result",
        toolName: "search_attractions",
        content: "外滩、东方明珠、豫园、南京路、迪士尼",
        annotation: "景点信息进入上下文，准备和天气一起综合",
      },
      {
        type: "tool_call",
        toolName: "estimate_travel_time",
        content: 'estimate_travel_time("北京", "上海")',
        annotation: "最后补交通时间，形成完整建议所需信息",
      },
      {
        type: "tool_result",
        toolName: "estimate_travel_time",
        content: "高铁约 4.5 小时，飞机约 2 小时",
        annotation: "Agent 已收集完成出行建议的关键信息",
      },
      {
        type: "assistant_text",
        content:
          "春节期间北京更冷、上海相对温和，建议优先准备保暖外套。上海 3 天可以安排外滩、豫园和南京路为核心路线；如果你想节省市区往返时间，高铁会是更稳妥的选择。",
        annotation: "模型综合工具结果后输出最终旅行建议",
      },
    ],
  },
};

export function getTravelAssistantLessonScenario(lessonId: string) {
  return travelAssistantLessonScenarios[lessonId] ?? null;
}
