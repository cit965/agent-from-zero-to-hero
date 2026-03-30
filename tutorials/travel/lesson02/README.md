# 第二课：为 Agent 添加真实 API 工具

## 1. 回顾

上节课我们学习了：
- Agent 的基本概念
- 如何定义简单的工具（add、multiply）
- 如何创建和运行 Agent

本节课我们将学习如何调用真实的第三方 API！

---

## 2. 工具类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **计算工具** | 执行数学运算 | 加减乘除 |
| **搜索工具** | 获取外部信息 | 网络搜索、维基百科 |
| **文件工具** | 读写本地文件 | 读取 txt、写入 json |
| **API 工具** | 调用第三方服务 | 天气查询、翻译 |

---

## 3. 实战：调用心知天气 API

我们使用 [心知天气](https://www.seniverse.com/) 的 API 来获取真实天气数据。

### 3.1 API 签名验证

心知天气使用 HMAC-SHA1 签名验证方式，需要：
- **公钥 (UID)** - 用户标识
- **私钥 (KEY)** - 用于生成签名

```python
import time
import hashlib
import hmac
import base64
from urllib import parse

# 心知天气 API 配置
SENIVERSE_UID = "你的公钥"
SENIVERSE_KEY = "你的私钥"
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"
```

### 3.2 定义天气工具

```python
@tool
def get_weather(city: str) -> str:
    """查询指定城市的实时天气情况，支持中文城市名如北京、上海等"""
    try:
        # 使用 HMAC-SHA1 签名验证
        ts = int(time.time())
        params_str = f"ts={ts}&uid={SENIVERSE_UID}"
        
        # 签名
        key = bytes(SENIVERSE_KEY, 'UTF-8')
        raw = bytes(params_str, 'UTF-8')
        digester = hmac.new(key, raw, hashlib.sha1).digest()
        sig = parse.quote(base64.b64encode(digester).decode('utf8'))
        
        # 构造 URL
        url = f"{SENIVERSE_API_URL}?location={parse.quote(city)}&{params_str}&sig={sig}"
        
        response = requests.get(url, timeout=5)
        data = response.json()
        
        if 'results' in data:
            result = data['results'][0]
            location = result['location']['name']
            now = result['now']
            return f"{location}：{now['text']}，温度 {now['temperature']}°C"
        else:
            return f"未找到 {city} 的天气信息"
    except Exception as e:
        return f"获取天气失败: {str(e)}"
```

### 3.3 定义时间工具

```python
from datetime import datetime

@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
```

### 3.4 组合工具

```python
tools = [add, multiply, get_weather, get_current_time]
agent = create_react_agent(llm, tools)
```

---

## 4. 运行效果

**问题**：`现在几点了？北京天气怎么样？`

```
[1] HumanMessage:
    用户: 现在几点了？北京天气怎么样？

[2] AIMessage:
    🤖 AI 决定调用工具:
       → get_weather({'city': '北京'})
       → get_current_time({})

[3] ToolMessage:
    🔧 工具 [get_weather] 返回: 北京：晴，温度 2°C    ← 真实天气数据！

[4] ToolMessage:
    🔧 工具 [get_current_time] 返回: 2026-01-27 11:58:36

[5] AIMessage:
    🤖 AI: 现在时间是2026年1月27日11:58:36。北京天气：晴天，温度2°C。
```

> 💡 **注意**：Agent 一次性并行调用了两个工具，提高了效率！

---

## 5. 签名验证原理

```
1. 构造参数字符串: ts=时间戳&uid=公钥
2. 使用私钥对参数进行 HMAC-SHA1 加密
3. 对加密结果进行 Base64 编码
4. URL 编码后作为 sig 参数
```

这种方式比直接传递 API Key 更安全，因为：
- 签名有时效性（ts 时间戳）
- 私钥不会在网络中传输

---

## 6. 完整代码

```python
"""
第二课：为 Agent 添加真实 API 工具
使用心知天气 API 获取真实天气
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

# 从环境变量加载 API Key
ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY")

# 心知天气 API 配置（使用签名验证）
SENIVERSE_UID = "你的公钥"
SENIVERSE_KEY = "你的私钥"
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"

# 创建 LLM
llm = ChatZhipuAI(model="glm-5.1", api_key=ZHIPU_API_KEY, temperature=0.7)

# 定义工具
@tool
def add(a: int, b: int) -> int:
    """计算两个数字的和"""
    return a + b

@tool
def multiply(a: int, b: int) -> int:
    """计算两个数字的乘积"""
    return a * b

@tool
def get_weather(city: str) -> str:
    """查询指定城市的实时天气情况"""
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
            location = result['location']['name']
            now = result['now']
            return f"{location}：{now['text']}，温度 {now['temperature']}°C"
        else:
            return f"未找到 {city} 的天气信息"
    except Exception as e:
        return f"获取天气失败: {str(e)}"

@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 组合所有工具
tools = [add, multiply, get_weather, get_current_time]

# 创建 Agent
agent = create_react_agent(llm, tools)

# 运行
if __name__ == "__main__":
    question = "现在几点了？北京天气怎么样？"
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    print(result["messages"][-1].content)
```

---

## 7. 课后练习

1. 尝试查询其他城市的天气：上海、广州、深圳
2. 添加一个 `get_forecast` 工具，获取未来天气预报
3. 组合使用：`北京和上海哪个更冷？`

---

## 下一课预告

**第三课：Agent 记忆与对话历史**
- 让 Agent 记住之前的对话
- 多轮对话的实现
