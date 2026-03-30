import type { Scenario } from "@/types/agent-data";

export const travelAssistantLessonScenarios: Record<string, Scenario> = {
  "lesson-1": {
    version: "travel-lesson-1",
    title: "最小 LangChain Agent 播放演示",
    description:
      "这是第一课的抽象演示步骤，展示最小 Agent 如何按顺序调用加法和乘法工具。",
    steps: [
      {
        type: "user_message",
        content: "用 add 工具计算 3+5，再用 multiply 工具把结果乘以 2。",
        annotation: "用户提出一个需要串联两个工具的最小请求",
      },
      {
        type: "assistant_text",
        content: "我会先调用 add 得到中间结果，再调用 multiply 完成最终计算。",
        annotation: "模型先规划调用顺序，而不是直接凭空口算",
      },
      {
        type: "tool_call",
        toolName: "add",
        content: "add(3, 5)",
        annotation: "第一步先执行加法工具",
      },
      {
        type: "tool_result",
        toolName: "add",
        content: "8",
        annotation: "工具返回中间结果 8，进入上下文",
      },
      {
        type: "tool_call",
        toolName: "multiply",
        content: "multiply(8, 2)",
        annotation: "第二步把中间结果交给乘法工具",
      },
      {
        type: "tool_result",
        toolName: "multiply",
        content: "16",
        annotation: "最终计算结果已经齐备",
      },
      {
        type: "assistant_text",
        content: "计算完成，最终答案是 16。",
        annotation: "模型综合工具返回值后给出最终回答",
      },
    ],
  },
  "lesson-2": {
    version: "travel-lesson-2",
    title: "真实 API 工具调用播放演示",
    description:
      "这是第二课的抽象演示步骤，展示 Agent 如何组合时间和天气两个真实工具。",
    steps: [
      {
        type: "user_message",
        content: "现在几点了？顺便帮我看看北京天气怎么样。",
        annotation: "用户同时请求时间和天气，适合观察多工具调用",
      },
      {
        type: "assistant_text",
        content: "我会先查当前时间，再查询北京天气，然后一起告诉你。",
        annotation: "模型将复合请求拆成两个工具调用",
      },
      {
        type: "tool_call",
        toolName: "get_current_time",
        content: "get_current_time()",
        annotation: "先获取当前时间",
      },
      {
        type: "tool_result",
        toolName: "get_current_time",
        content: "2026-03-30 16:20:00",
        annotation: "时间结果写入上下文，继续处理天气请求",
      },
      {
        type: "tool_call",
        toolName: "get_weather",
        content: 'get_weather("北京")',
        annotation: "再调用真实天气 API 工具",
      },
      {
        type: "tool_result",
        toolName: "get_weather",
        content: "北京：晴，温度 18°C",
        annotation: "天气结果到位，模型可以合并回复",
      },
      {
        type: "assistant_text",
        content: "现在是 2026-03-30 16:20:00，北京当前晴，温度 18°C。",
        annotation: "模型把两个工具结果组合成自然语言答复",
      },
    ],
  },
  "lesson-3": {
    version: "travel-lesson-3",
    title: "多轮记忆播放演示",
    description:
      "这是第三课的抽象演示步骤，展示同一个 thread_id 下，Agent 如何延续上一轮上下文。",
    steps: [
      {
        type: "user_message",
        content: "北京天气怎么样？",
        annotation: "第一轮对话，用户先问北京天气",
      },
      {
        type: "tool_call",
        toolName: "get_weather",
        content: 'get_weather("北京")',
        annotation: "Agent 正常调用天气工具查询北京",
      },
      {
        type: "tool_result",
        toolName: "get_weather",
        content: "北京：晴，温度 18°C",
        annotation: "北京天气结果被写入对话历史",
      },
      {
        type: "assistant_text",
        content: "北京现在晴，温度 18°C。",
        annotation: "第一轮回答完成",
      },
      {
        type: "user_message",
        content: "那上海呢？",
        annotation: "第二轮没有重复主题，考验记忆是否生效",
      },
      {
        type: "assistant_text",
        content: "我知道你还在问天气，所以继续查询上海的天气。",
        annotation: "模型借助同一个 thread_id 维持上下文连续性",
      },
      {
        type: "tool_call",
        toolName: "get_weather",
        content: 'get_weather("上海")',
        annotation: "继续查询上海天气",
      },
      {
        type: "tool_result",
        toolName: "get_weather",
        content: "上海：多云，温度 22°C",
        annotation: "第二个城市天气结果返回",
      },
      {
        type: "assistant_text",
        content: "上海现在多云，温度 22°C，比北京更暖一些。",
        annotation: "模型把新结果和上一轮记忆结合起来回答",
      },
    ],
  },
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
  "lesson-5": {
    version: "travel-lesson-5",
    title: "完整旅行助手应用播放演示",
    description:
      "这是第五课的抽象演示步骤，展示 Web 界面、后端 Agent 和工具调用是如何串起来的。",
    steps: [
      {
        type: "system_event",
        content: "POST /chat\npayload={\"message\":\"五一去杭州玩两天，帮我规划一下\"}",
        annotation: "前端表单把用户请求提交到 Flask 后端",
      },
      {
        type: "user_message",
        content: "五一去杭州玩两天，帮我规划一下。",
        annotation: "后端把用户输入转成 Agent 可处理的消息",
      },
      {
        type: "assistant_text",
        content: "我会先看杭州天气，再找适合两日游的景点，然后整合成一个简短计划。",
        annotation: "模型为完整应用请求组织执行顺序",
      },
      {
        type: "tool_call",
        toolName: "get_weather",
        content: 'get_weather("杭州")',
        annotation: "先查天气，决定出行建议基调",
      },
      {
        type: "tool_result",
        toolName: "get_weather",
        content: "杭州：小雨，温度 21°C",
        annotation: "天气进入上下文，用于后续行程建议",
      },
      {
        type: "tool_call",
        toolName: "search_attractions",
        content: 'search_attractions("杭州")',
        annotation: "再补齐热门景点信息",
      },
      {
        type: "tool_result",
        toolName: "search_attractions",
        content: "西湖、灵隐寺、河坊街、西溪湿地",
        annotation: "有了天气和景点，Agent 可以输出完整计划",
      },
      {
        type: "assistant_text",
        content:
          "杭州两日游建议以西湖和灵隐寺为主，小雨天气记得带伞；第二天可以去西溪湿地或河坊街，行程会更轻松。",
        annotation: "后端把生成结果返回给前端，形成完整产品闭环",
      },
      {
        type: "system_event",
        content: "200 OK\nresponse={\"reply\":\"杭州两日游建议以西湖和灵隐寺为主...\"}",
        annotation: "Flask 接口成功返回，前端把结果渲染到聊天界面",
      },
    ],
  },
};

export function getTravelAssistantLessonScenario(lessonId: string) {
  return travelAssistantLessonScenarios[lessonId] ?? null;
}
