# 第三课：Agent 记忆与多轮对话

## 1. 回顾

上节课我们学习了：
- 如何调用真实的第三方 API（心知天气）
- HMAC-SHA1 签名验证方式
- Agent 并行调用多个工具

本节课我们将让 Agent 拥有 **记忆能力**！

---

## 2. 为什么需要记忆？

之前的 Agent 每次对话都是独立的，无法记住上下文：

```
用户: 北京天气怎么样？
Agent: 北京：晴，温度 2°C

用户: 那上海呢？
Agent: ❌ 我不知道你在问什么...（没有上下文）
```

有了记忆后：

```
用户: 北京天气怎么样？
Agent: 北京：晴，温度 2°C

用户: 那上海呢？
Agent: ✅ 上海：多云，温度 8°C（理解你在问天气）
```

---

## 3. LangGraph 的记忆机制

LangGraph 使用 **Checkpointer** 来保存对话历史：

```python
from langgraph.checkpoint.memory import MemorySaver

# 创建内存检查点（保存对话历史）
memory = MemorySaver()

# 创建带记忆的 Agent
agent = create_react_agent(llm, tools, checkpointer=memory)
```

---

## 4. 使用 thread_id 区分对话

每个对话需要一个唯一的 `thread_id`：

```python
# 同一个 thread_id = 同一个对话上下文
config = {"configurable": {"thread_id": "user-001"}}

# 第一轮对话
agent.invoke({"messages": [{"role": "user", "content": "北京天气"}]}, config)

# 第二轮对话（Agent 记得之前问的是天气）
agent.invoke({"messages": [{"role": "user", "content": "那上海呢？"}]}, config)
```

---

## 5. 代码实战

### 5.1 创建带记忆的 Agent

```python
from langgraph.checkpoint.memory import MemorySaver

# 创建内存检查点
memory = MemorySaver()

# 创建带记忆的 Agent
agent = create_react_agent(llm, tools, checkpointer=memory)
```

### 5.2 多轮对话

```python
# 对话配置（使用 thread_id 标识对话）
config = {"configurable": {"thread_id": "conversation-1"}}

# 第一轮
result1 = agent.invoke(
    {"messages": [{"role": "user", "content": "北京天气怎么样？"}]},
    config
)
print("第一轮:", result1["messages"][-1].content)

# 第二轮（Agent 记得上文）
result2 = agent.invoke(
    {"messages": [{"role": "user", "content": "那上海呢？"}]},
    config
)
print("第二轮:", result2["messages"][-1].content)

# 第三轮
result3 = agent.invoke(
    {"messages": [{"role": "user", "content": "哪个城市更冷？"}]},
    config
)
print("第三轮:", result3["messages"][-1].content)
```

---

## 6. 运行效果

```
============================================================
第一轮对话
============================================================
用户: 北京天气怎么样？

🔧 工具 [get_weather] 返回: 北京：晴，温度 2°C

Agent: 北京目前天气晴朗，温度 2°C。

============================================================
第二轮对话（Agent 记得上下文）
============================================================
用户: 那上海呢？

🔧 工具 [get_weather] 返回: 上海：多云，温度 8°C

Agent: 上海目前多云，温度 8°C。

============================================================
第三轮对话（Agent 可以比较）
============================================================
用户: 哪个城市更冷？

Agent: 北京更冷！北京 2°C，上海 8°C，北京比上海低 6 度。
```

---

## 7. 记忆的持久化

`MemorySaver` 只在内存中保存，程序重启后丢失。

如果需要持久化，可以使用：

```python
# SQLite 持久化（需要安装 langgraph-checkpoint-sqlite）
from langgraph.checkpoint.sqlite import SqliteSaver

memory = SqliteSaver.from_conn_string("conversations.db")
```

---

## 8. 完整代码

```python
"""
第三课：Agent 记忆与多轮对话
"""

import os
import time
import hashlib
import hmac
import base64
import requests
from urllib import parse
from datetime import datetime
from langchain_community.chat_models import ChatZhipuAI
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

# API Keys
ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY")
SENIVERSE_UID = "Pc9Fuy4ms9vV1btnZ"
SENIVERSE_KEY = "S4KHevvOhFIYayLbu"
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"

# 创建 LLM
llm = ChatZhipuAI(model="glm-5.1", api_key=ZHIPU_API_KEY, temperature=0.7)

# 定义工具
@tool
def get_weather(city: str) -> str:
    """查询指定城市的实时天气"""
    try:
        ts = int(time.time())
        params_str = f"ts={ts}&uid={SENIVERSE_UID}"
        key = bytes(SENIVERSE_KEY, 'UTF-8')
        raw = bytes(params_str, 'UTF-8')
        digester = hmac.new(key, raw, hashlib.sha1).digest()
        sig = parse.quote(base64.b64encode(digester).decode('utf8'))
        url = f"{SENIVERSE_API_URL}?location={parse.quote(city)}&{params_str}&sig={sig}"
        
        response = requests.get(url, timeout=5)
        data = response.json()
        
        if 'results' in data:
            result = data['results'][0]
            now = result['now']
            return f"{result['location']['name']}：{now['text']}，温度 {now['temperature']}°C"
        return f"未找到 {city} 的天气信息"
    except Exception as e:
        return f"获取天气失败: {str(e)}"

@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

tools = [get_weather, get_current_time]

# 创建带记忆的 Agent
memory = MemorySaver()
agent = create_react_agent(llm, tools, checkpointer=memory)

# 运行多轮对话
if __name__ == "__main__":
    config = {"configurable": {"thread_id": "demo-conversation"}}
    
    conversations = [
        "北京天气怎么样？",
        "那上海呢？",
        "哪个城市更冷？"
    ]
    
    for i, question in enumerate(conversations, 1):
        print(f"\n{'='*60}")
        print(f"第 {i} 轮对话")
        print(f"{'='*60}")
        print(f"用户: {question}\n")
        
        result = agent.invoke(
            {"messages": [{"role": "user", "content": question}]},
            config
        )
        
        # 打印工具调用
        for msg in result["messages"]:
            if type(msg).__name__ == "ToolMessage":
                print(f"🔧 工具 [{msg.name}] 返回: {msg.content}")
        
        print(f"\nAgent: {result['messages'][-1].content}")
```

---

## 9. 课后练习

1. 创建一个记事本 Agent，可以记住用户说过的事情
2. 尝试使用不同的 `thread_id`，观察对话是否隔离
3. 思考：如何限制记忆的长度，避免上下文过长？

---

## 下一课预告

**第四课：Agent 工作流与复杂任务**
- 让 Agent 完成多步骤任务
