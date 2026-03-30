export const travelAssistantTutorial = {
  slug: "travel-assistant",
  title: "LangChain 旅行助手教程",
  subtitle: "从 LangChain 入门到带记忆的 Web 旅行规划助手",
  description:
    "5 节渐进式实战：模型接入、真实天气 API、对话记忆、多步骤工作流，以及 Flask Web 应用落地。",
  stats: [
    "5 节课程",
    "LangChain + LangGraph",
    "智谱 GLM-4.7",
    "Flask Web 应用",
  ],
  sections: [
    {
      id: "lesson-1",
      label: "第一课",
      title: "LangChain 入门",
      heading: "## <a id=\"lesson-1\"></a>第一课：LangChain 入门",
    },
    {
      id: "lesson-2",
      label: "第二课",
      title: "添加真实工具",
      heading: "## <a id=\"lesson-2\"></a>第二课：添加真实工具",
    },
    {
      id: "lesson-3",
      label: "第三课",
      title: "记忆与多轮对话",
      heading: "## <a id=\"lesson-3\"></a>第三课：记忆与多轮对话",
    },
    {
      id: "lesson-4",
      label: "第四课",
      title: "工作流与复杂任务",
      heading: "## <a id=\"lesson-4\"></a>第四课：工作流与复杂任务",
    },
    {
      id: "lesson-5",
      label: "第五课",
      title: "完整旅行助手",
      heading: "## <a id=\"lesson-5\"></a>第五课：完整旅行助手",
    },
  ],
  markdown: `
# LangChain 旅行助手教程

> 用一个完整的旅行规划助手，把 LangChain Agent 的核心能力串起来：模型、工具、记忆、工作流和 Web 应用。

这个专题适合已经知道 Python 基础、想快速上手 Agent 开发的同学。整套内容按「先跑通，再增强」组织，每一课都能独立运行，最后会汇总为一个可交互的旅行助手应用。

## 课程结构

1. LangChain 入门：创建最小可运行 Agent
2. 添加真实 API 工具：接入天气与时间
3. Agent 记忆：实现多轮连续对话
4. 复杂任务工作流：让 Agent 自动拆解旅行规划
5. Flask Web 应用：把能力封装成一个完整产品

---

## <a id="lesson-1"></a>第一课：LangChain 入门

### 1. LangChain 概述

LangChain 是一个开源 Agent 框架，可以让开发者快速把大模型、工具调用和工作流组织在一起。它支持 Python 和 TypeScript，两种语言都能构建 Agent 应用。

- 官方文档：https://docs.langchain.com/
- 适合场景：工具调用、RAG、工作流编排、聊天应用、多 Agent 系统
- 这套课程使用 Python 版本进行演示

### 2. 环境准备

推荐使用 \`uv\` 管理虚拟环境和依赖。

\`\`\`sh
# 创建虚拟环境
uv venv
source .venv/bin/activate

# 安装 LangChain
uv add langchain langchain-openai langchain-anthropic

# 如果你习惯 pip，也可以这样安装
pip install -U langchain langchain-openai langchain-anthropic
\`\`\`

本课程示例使用智谱 API。你可以前往 https://bigmodel.cn/ 控制台获取 API Key，然后设置环境变量：

\`\`\`sh
export ZHIPU_API_KEY="你的智谱API密钥"
\`\`\`

### 3. 创建最小 Agent

先创建一个最简单的 LLM 与工具集合。

\`\`\`python
import os
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import create_agent

llm = ChatOpenAI(
    temperature=0.6,
    model="glm-4.7",
    openai_api_key=os.getenv("ZHIPU_API_KEY"),
    openai_api_base="https://open.bigmodel.cn/api/paas/v4/",
)


@tool
def add(a: int, b: int) -> int:
    """计算两个数字的和"""
    return a + b


@tool
def multiply(a: int, b: int) -> int:
    """计算两个数字的乘积"""
    return a * b


tools = [add, multiply]
agent = create_agent(llm, tools)
\`\`\`

这里最关键的点有两个：

1. \`@tool\` 把普通 Python 函数变成 Agent 可调用的工具。
2. docstring 会直接影响模型对工具用途的理解，不能省略。

### 4. 运行 Agent

\`\`\`python
if __name__ == "__main__":
    print("=" * 50)
    print("LangChain Agent Demo - 使用智谱 GLM-4")
    print("=" * 50)

    question = "用 add 工具计算 3+5，再用 multiply 工具把结果乘以 2"
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})

    print("\n消息历史：")
    for i, msg in enumerate(result["messages"], 1):
        msg_type = type(msg).__name__
        print(f"\n[{i}] {msg_type}:")

        if msg_type == "HumanMessage":
            print(f"    用户: {msg.content}")
        elif msg_type == "AIMessage":
            if msg.tool_calls:
                print("    AI 决定调用工具:")
                for tc in msg.tool_calls:
                    print(f"       -> {tc['name']}({tc['args']})")
            if msg.content:
                print(f"    AI: {msg.content}")
        elif msg_type == "ToolMessage":
            print(f"    工具 [{msg.name}] 返回: {msg.content}")

    print("\n最终答案:", result["messages"][-1].content)
\`\`\`

### 5. 这一课要理解什么

Agent 会自动完成这条链路：

1. 理解用户要求先加法、再乘法
2. 调用 \`add(3, 5)\`
3. 调用 \`multiply(8, 2)\`
4. 汇总结果，返回最终答案

到这里，你已经有了一个最小可运行的 LangChain Agent。

---

## <a id="lesson-2"></a>第二课：添加真实工具

第一课里的工具都是本地函数。真实应用里，Agent 往往需要调用外部 API。这里用心知天气 API 做一个真实工具。

### 1. API 签名配置

心知天气使用 HMAC-SHA1 签名。你需要准备：

- \`SENIVERSE_UID\`：公钥
- \`SENIVERSE_KEY\`：私钥

\`\`\`python
import base64
import hashlib
import hmac
import time
from urllib import parse

SENIVERSE_UID = "你的公钥"
SENIVERSE_KEY = "你的私钥"
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"
\`\`\`

### 2. 定义天气工具

\`\`\`python
import requests
from langchain_core.tools import tool


@tool
def get_weather(city: str) -> str:
    """查询指定城市的实时天气情况，支持中文城市名如北京、上海等"""
    try:
        ts = int(time.time())
        params_str = f"ts={ts}&uid={SENIVERSE_UID}"

        key = bytes(SENIVERSE_KEY, "UTF-8")
        raw = bytes(params_str, "UTF-8")
        digester = hmac.new(key, raw, hashlib.sha1).digest()
        sig = parse.quote(base64.b64encode(digester).decode("utf8"))

        url = (
            f"{SENIVERSE_API_URL}?location={parse.quote(city)}"
            f"&{params_str}&sig={sig}"
        )

        response = requests.get(url, timeout=5)
        data = response.json()

        if "results" in data:
            result = data["results"][0]
            location = result["location"]["name"]
            now = result["now"]
            return f"{location}：{now['text']}，温度 {now['temperature']}°C"

        return f"未找到 {city} 的天气信息"
    except Exception as e:
        return f"获取天气失败: {str(e)}"
\`\`\`

### 3. 定义时间工具

\`\`\`python
from datetime import datetime


@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
\`\`\`

### 4. 组合成一个有真实感知能力的 Agent

\`\`\`python
tools = [get_weather, get_current_time]
agent = create_agent(llm, tools)
\`\`\`

这时你就可以问：

\`\`\`text
现在几点了？北京天气怎么样？
\`\`\`

Agent 会自主决定：

1. 调用 \`get_current_time\`
2. 调用 \`get_weather("北京")\`
3. 汇总两个工具结果，一次性回复用户

### 5. 这一课的重点

- 工具不一定是本地逻辑，也可以是外部 API
- 只要工具描述清晰，Agent 会自己决定调用顺序
- 旅行类应用最常见的第一批工具就是天气、时间、位置和交通信息

---

## <a id="lesson-3"></a>第三课：记忆与多轮对话

如果没有记忆，Agent 每一轮都是孤立的。用户说“那上海呢？”时，模型可能根本不知道你还在问天气。

### 1. 为什么需要记忆

没有记忆时：

\`\`\`text
用户：北京天气怎么样？
Agent：北京：晴，温度 2°C

用户：那上海呢？
Agent：我不知道你在问什么
\`\`\`

有记忆时：

\`\`\`text
用户：北京天气怎么样？
Agent：北京：晴，温度 2°C

用户：那上海呢？
Agent：上海：多云，温度 8°C
\`\`\`

### 2. 使用 LangGraph Checkpointer

\`\`\`python
from langgraph.checkpoint.memory import InMemorySaver

memory = InMemorySaver()
agent = create_agent(llm, tools, checkpointer=memory)
\`\`\`

\`InMemorySaver\` 会把会话上下文保存在内存里，适合本地演示和开发阶段。

### 3. 使用 \`thread_id\` 区分会话

\`\`\`python
config = {"configurable": {"thread_id": "user-001"}}

agent.invoke(
    {"messages": [{"role": "user", "content": "北京天气怎么样？"}]},
    config,
)

agent.invoke(
    {"messages": [{"role": "user", "content": "那上海呢？"}]},
    config,
)
\`\`\`

只要两次调用使用同一个 \`thread_id\`，模型就会把它们视为同一段连续对话。

### 4. 多轮对话示例

\`\`\`python
if __name__ == "__main__":
    print("=" * 60)
    print("第三课：记忆与多轮对话")
    print("=" * 60)

    config = {"configurable": {"thread_id": "demo-conversation"}}
    conversations = [
        "北京天气怎么样？",
        "那上海呢？",
        "哪个城市更冷？",
    ]

    for i, question in enumerate(conversations, 1):
        print(f"\n第 {i} 轮对话")
        print(f"用户: {question}\n")

        result = agent.invoke(
            {"messages": [{"role": "user", "content": question}]},
            config,
        )

        for msg in result["messages"]:
            if type(msg).__name__ == "ToolMessage":
                print(f"工具 [{msg.name}] 返回: {msg.content}")

        print(f"\nAgent: {result['messages'][-1].content}")
\`\`\`

### 5. 持久化记忆

\`InMemorySaver\` 重启程序后会丢失数据。生产环境一般会换成数据库检查点，例如 PostgreSQL：

\`\`\`python
from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable"

with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    checkpointer.setup()
    agent = create_agent(
        llm,
        tools=tools,
        checkpointer=checkpointer,
    )
\`\`\`

### 6. 这一课的重点

- 记忆不是“模型自动会记住”，而是靠外部 checkpointer 管理
- \`thread_id\` 是多轮对话的关键
- 做聊天产品时，会话隔离和持久化要尽早设计

---

## <a id="lesson-4"></a>第四课：工作流与复杂任务

旅行规划通常不是一个工具就能解决的。它本质上是多步骤任务。

### 1. 什么是多步骤任务

简单任务：

\`\`\`text
用户：北京天气怎么样？
Agent：调用 get_weather -> 返回结果
\`\`\`

复杂任务：

\`\`\`text
用户：帮我规划一个北京到上海的出行计划
Agent：
1. 查北京天气
2. 查上海天气
3. 获取当前时间
4. 推荐景点
5. 估算交通方式
6. 综合生成建议
\`\`\`

### 2. 设计工具集

\`\`\`python
from datetime import datetime


@tool
def get_weather(city: str) -> str:
    """查询城市天气，用于了解穿衣和出行建议"""
    return f"{city}：晴，温度 23°C"


@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@tool
def search_attractions(city: str) -> str:
    """搜索城市的热门景点"""
    attractions = {
        "北京": "故宫、长城、颐和园、天坛、南锣鼓巷",
        "上海": "外滩、东方明珠、豫园、南京路、迪士尼",
        "杭州": "西湖、灵隐寺、宋城、西溪湿地、千岛湖",
        "成都": "宽窄巷子、锦里、大熊猫基地、都江堰、青城山",
    }
    return attractions.get(city, f"{city} 暂无景点信息")


@tool
def estimate_travel_time(from_city: str, to_city: str) -> str:
    """估算两个城市之间的交通时间"""
    times = {
        ("北京", "上海"): "高铁约 4.5 小时，飞机约 2 小时",
        ("上海", "杭州"): "高铁约 1 小时，自驾约 2 小时",
        ("北京", "杭州"): "高铁约 5 小时，飞机约 2 小时",
        ("成都", "北京"): "高铁约 8 小时，飞机约 2.5 小时",
    }
    key = (from_city, to_city)
    reverse_key = (to_city, from_city)
    return times.get(key) or times.get(reverse_key) or f"{from_city} 到 {to_city} 的交通信息暂无"
\`\`\`

### 3. 让 Agent 自主拆解旅行规划

\`\`\`python
tools = [get_weather, get_current_time, search_attractions, estimate_travel_time]
agent = create_agent(llm, tools, checkpointer=memory)

question = """
我想在春节期间从北京去上海玩 3 天，请帮我：
1. 查看两地天气
2. 推荐上海的景点
3. 估算交通时间
4. 给出一个简单的出行建议
"""

result = agent.invoke({"messages": [{"role": "user", "content": question}]})
print(result["messages"][-1].content)
\`\`\`

### 4. Agent 的推理链路

\`\`\`text
用户需求分析
    ↓
需要查天气 -> get_weather("北京"), get_weather("上海")
    ↓
需要景点推荐 -> search_attractions("上海")
    ↓
需要交通时间 -> estimate_travel_time("北京", "上海")
    ↓
综合天气、景点、时间和交通信息 -> 输出旅行建议
\`\`\`

### 5. 这一课的重点

- 复杂任务的关键不是“写更大的 prompt”，而是“准备一组可协作的工具”
- Agent 的价值在于能自己组织工具调用顺序
- 旅行助手就是一个非常典型的多工具协同场景

---

## <a id="lesson-5"></a>第五课：完整旅行助手

前四课已经完成了核心能力。现在把它打包成一个完整的 Web 应用。

### 1. 最终架构

\`\`\`text
┌──────────────────────────┐
│         Web 界面         │
│   HTML + CSS + JS        │
└──────────────┬───────────┘
               │ HTTP 请求
               ▼
┌──────────────────────────┐
│       Flask 服务器       │
│       Python 后端        │
└──────────────┬───────────┘
               │ 调用
               ▼
┌──────────────────────────┐
│     LangChain Agent      │
│   工具 + LLM + 记忆      │
└──────────────────────────┘
\`\`\`

### 2. 项目结构

\`\`\`text
lesson05/
├── app.py
├── agent.py
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   ├── app_demo.png
│   └── chat_demo.png
├── run.sh
└── requirements.txt
\`\`\`

### 3. Agent 模块

\`\`\`python
import os
import base64
import hashlib
import hmac
import time
from datetime import datetime
from urllib import parse

import requests
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

SENIVERSE_UID = os.getenv("SENIVERSE_UID", "")
SENIVERSE_KEY = os.getenv("SENIVERSE_KEY", "")
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"


@tool
def get_weather(city: str) -> str:
    """查询城市实时天气"""
    try:
        ts = int(time.time())
        params_str = f"ts={ts}&uid={SENIVERSE_UID}"
        key = bytes(SENIVERSE_KEY, "UTF-8")
        raw = bytes(params_str, "UTF-8")
        digester = hmac.new(key, raw, hashlib.sha1).digest()
        sig = parse.quote(base64.b64encode(digester).decode("utf8"))
        url = (
            f"{SENIVERSE_API_URL}?location={parse.quote(city)}"
            f"&{params_str}&sig={sig}"
        )

        data = requests.get(url, timeout=5).json()
        if "results" not in data:
            return f"未找到 {city} 的天气信息"

        result = data["results"][0]
        now = result["now"]
        return f"{result['location']['name']}：{now['text']}，温度 {now['temperature']}°C"
    except Exception as e:
        return f"获取天气失败: {str(e)}"


@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@tool
def search_attractions(city: str) -> str:
    """搜索城市的热门景点"""
    attractions = {
        "北京": "故宫、长城、颐和园、天坛、南锣鼓巷",
        "上海": "外滩、东方明珠、豫园、南京路、迪士尼",
        "杭州": "西湖、灵隐寺、宋城、西溪湿地、千岛湖",
        "成都": "宽窄巷子、锦里、大熊猫基地、都江堰、青城山",
    }
    return attractions.get(city, f"{city} 暂无景点信息")


@tool
def estimate_travel_time(from_city: str, to_city: str) -> str:
    """估算两个城市之间的交通时间"""
    times = {
        ("北京", "上海"): "高铁约 4.5 小时，飞机约 2 小时",
        ("上海", "杭州"): "高铁约 1 小时，自驾约 2 小时",
        ("北京", "杭州"): "高铁约 5 小时，飞机约 2 小时",
        ("成都", "北京"): "高铁约 8 小时，飞机约 2.5 小时",
    }
    key = (from_city, to_city)
    reverse_key = (to_city, from_city)
    return times.get(key) or times.get(reverse_key) or f"{from_city} 到 {to_city} 的交通信息暂无"


def create_travel_agent():
    llm = ChatOpenAI(
        temperature=0.7,
        model="glm-4.7",
        openai_api_key=os.getenv("ZHIPU_API_KEY"),
        openai_api_base="https://open.bigmodel.cn/api/paas/v4/",
    )

    memory = InMemorySaver()
    tools = [get_weather, get_current_time, search_attractions, estimate_travel_time]
    return create_agent(llm, tools, checkpointer=memory)
\`\`\`

### 4. Flask 后端

\`\`\`python
import uuid
from flask import Flask, jsonify, render_template, request

from agent import create_travel_agent

app = Flask(__name__)
agent = create_travel_agent()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json or {}
        user_message = data.get("message", "")
        thread_id = data.get("thread_id", str(uuid.uuid4()))

        if not user_message:
            return jsonify({"error": "消息不能为空"}), 400

        config = {"configurable": {"thread_id": thread_id}}
        result = agent.invoke(
            {"messages": [{"role": "user", "content": user_message}]},
            config,
        )

        tool_calls = []
        for msg in result["messages"]:
            if type(msg).__name__ == "ToolMessage":
                tool_calls.append({
                    "tool": msg.name,
                    "result": msg.content[:100] + "..." if len(msg.content) > 100 else msg.content,
                })

        return jsonify({
            "response": result["messages"][-1].content,
            "thread_id": thread_id,
            "tool_calls": tool_calls,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/new_chat", methods=["POST"])
def new_chat():
    return jsonify({"thread_id": str(uuid.uuid4())})


if __name__ == "__main__":
    app.run(debug=True, port=8080, host="0.0.0.0")
\`\`\`

### 5. 前端页面

前端可以保持简单：一个消息列表、一个输入框、一个发送按钮、一个工具调用记录区域。

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>旅行规划助手</title>
  <link rel="stylesheet" href="/static/style.css" />
</head>
<body>
  <div class="container">
    <header>
      <h1>旅行规划助手</h1>
      <p>基于 LangChain Agent 的智能旅行规划</p>
    </header>

    <div class="chat-container">
      <div class="messages" id="messages"></div>
      <div class="input-area">
        <input id="user-input" placeholder="例如：帮我规划一个北京到上海的三日游" />
        <button id="send-btn">发送</button>
      </div>
    </div>
  </div>
</body>
</html>
\`\`\`

### 6. 启动方式

\`\`\`sh
cd course/lesson05
./run.sh
\`\`\`

然后访问：

\`\`\`text
http://localhost:8080
\`\`\`

### 7. 最终功能清单

- 实时天气查询
- 城市景点推荐
- 出行交通时间估算
- 多轮记忆对话
- 工具调用过程可视化
- Web 端交互体验

---

## 完整项目建议

如果你要把这套教程继续往下扩展，可以按这个顺序演进：

1. 把天气、交通、酒店都改成真实 API
2. 增加预算约束，比如“3000 元以内”
3. 增加日期规划，比如“生成 3 天详细行程”
4. 把 \`InMemorySaver\` 替换成数据库持久化
5. 给前端加用户会话列表和历史记录

## 学完后你应该掌握什么

- 能独立创建 LangChain Agent
- 能给 Agent 添加真实世界工具
- 能实现多轮记忆对话
- 能把复杂需求拆成多工具工作流
- 能把 Agent 封装成完整 Web 应用
`,
} as const;

type TravelTutorial = typeof travelAssistantTutorial;
type TravelSection = TravelTutorial["sections"][number];

function extractLessonMarkdown(
  markdown: string,
  currentHeading: string,
  nextHeading?: string
) {
  const start = markdown.indexOf(currentHeading);
  if (start === -1) {
    return "";
  }

  const contentStart = start + currentHeading.length;
  const end = nextHeading ? markdown.indexOf(nextHeading, contentStart) : markdown.length;
  const sectionMarkdown = markdown.slice(contentStart, end === -1 ? markdown.length : end);
  return sectionMarkdown.trim();
}

export const travelAssistantLessons = travelAssistantTutorial.sections.map(
  (section, index) => ({
    ...section,
    href: `/${travelAssistantTutorial.slug}/${section.id}`,
    markdown: extractLessonMarkdown(
      travelAssistantTutorial.markdown,
      section.heading,
      travelAssistantTutorial.sections[index + 1]?.heading
    ),
  })
);

export function getTravelLesson(lessonId: string) {
  return travelAssistantLessons.find((lesson) => lesson.id === lessonId);
}

export function getTravelLessonHref(lessonId: string) {
  return `/${travelAssistantTutorial.slug}/${lessonId}`;
}

export function getTravelLessonDisplayTitle(lesson: {
  label: string;
  title: string;
}) {
  return `${lesson.label}：${lesson.title}`;
}
