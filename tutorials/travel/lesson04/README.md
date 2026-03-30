# 第四课：Agent 工作流与复杂任务

## 1. 回顾

上节课我们学习了：
- 使用 MemorySaver 让 Agent 记住对话历史
- 使用 thread_id 区分不同对话
- 多轮对话的实现

本节课我们将让 Agent 完成 **多步骤复杂任务**！

---

## 2. 什么是多步骤任务？

**简单任务**：一个工具调用就能完成
```
用户: 北京天气怎么样？
Agent: [调用 get_weather] → 返回结果
```

**多步骤任务**：需要多个工具协作完成
```
用户: 帮我规划一个北京到上海的出行计划
Agent: 
  1. [调用 get_weather("北京")] → 获取出发地天气
  2. [调用 get_weather("上海")] → 获取目的地天气
  3. [调用 get_current_time] → 获取当前时间
  4. [调用 search_transport] → 搜索交通方式
  5. 综合所有信息，生成出行建议
```

---

## 3. 设计多步骤工具集

为了完成复杂任务，我们需要设计一组协作的工具：

| 工具 | 功能 | 用途 |
|------|------|------|
| `get_weather` | 查询天气 | 了解穿衣建议 |
| `get_current_time` | 获取时间 | 确定出发时间 |
| `search_attractions` | 搜索景点 | 规划游玩路线 |
| `estimate_travel_time` | 估算行程 | 时间规划 |
| `create_plan` | 生成计划 | 汇总输出 |

---

## 4. 代码实战

### 4.1 定义工具集

```python
@tool
def get_weather(city: str) -> str:
    """查询城市天气，用于了解穿衣和出行建议"""
    # ... 调用天气 API

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
    return attractions.get(city, f"{city}暂无景点信息")

@tool
def estimate_travel_time(from_city: str, to_city: str) -> str:
    """估算两个城市之间的交通时间"""
    times = {
        ("北京", "上海"): "高铁约4.5小时，飞机约2小时",
        ("上海", "杭州"): "高铁约1小时，自驾约2小时",
        ("北京", "杭州"): "高铁约5小时，飞机约2小时",
        ("成都", "北京"): "高铁约8小时，飞机约2.5小时",
    }
    key = (from_city, to_city)
    reverse_key = (to_city, from_city)
    return times.get(key) or times.get(reverse_key) or f"{from_city}到{to_city}的交通信息暂无"
```

### 4.2 让 Agent 完成复杂任务

```python
# 复杂任务示例
question = """
我想在春节期间从北京去上海玩3天，请帮我：
1. 查看两地天气
2. 推荐上海的景点
3. 估算交通时间
4. 给出一个简单的出行建议
"""

result = agent.invoke({"messages": [{"role": "user", "content": question}]})
```

---

## 5. 运行效果

```
============================================================
复杂任务：规划北京到上海的出行
============================================================

用户: 我想在春节期间从北京去上海玩3天，请帮我：
      1. 查看两地天气
      2. 推荐上海的景点
      3. 估算交通时间
      4. 给出一个简单的出行建议

🔧 工具调用:
   → get_weather({'city': '北京'}) 返回: 北京：晴，温度 3°C
   → get_weather({'city': '上海'}) 返回: 上海：阴，温度 8°C
   → search_attractions({'city': '上海'}) 返回: 外滩、东方明珠、豫园、南京路、迪士尼
   → estimate_travel_time({'from_city': '北京', 'to_city': '上海'}) 返回: 高铁约4.5小时，飞机约2小时

Agent 回答:
根据您的需求，我为您整理了以下出行建议：

## 天气情况
- 北京：晴天，3°C，较冷需穿厚外套
- 上海：阴天，8°C，温度适中

## 交通建议
- 高铁：约4.5小时，推荐！舒适且班次多
- 飞机：约2小时，适合时间紧张的旅客

## 上海景点推荐
3天行程建议：
- Day 1：外滩 + 南京路步行街
- Day 2：东方明珠 + 豫园
- Day 3：迪士尼乐园

## 穿衣建议
上海比北京暖和5度，但仍需注意保暖，建议携带薄羽绒服或厚外套。

祝您旅途愉快！
```

---

## 6. Agent 的推理过程

Agent 自动分解任务并按顺序执行：

```
用户需求分析
    ↓
1. 需要查天气 → 调用 get_weather("北京")
                 调用 get_weather("上海")
    ↓
2. 需要景点推荐 → 调用 search_attractions("上海")
    ↓
3. 需要交通信息 → 调用 estimate_travel_time("北京", "上海")
    ↓
4. 汇总所有信息，生成出行建议
```

---

## 7. 完整代码

```python
"""
第四课：Agent 工作流与复杂任务
让 Agent 完成多步骤的复杂任务
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

# API 配置
ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY")
SENIVERSE_UID = "Pc9Fuy4ms9vV1btnZ"
SENIVERSE_KEY = "S4KHevvOhFIYayLbu"

# 创建 LLM
llm = ChatZhipuAI(model="glm-5.1", api_key=ZHIPU_API_KEY, temperature=0.7)


@tool
def get_weather(city: str) -> str:
    """查询城市实时天气，用于了解穿衣和出行建议"""
    # ... 天气 API 调用代码


@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@tool
def search_attractions(city: str) -> str:
    """搜索城市的热门景点，用于旅游规划"""
    attractions = {
        "北京": "故宫、长城、颐和园、天坛、南锣鼓巷",
        "上海": "外滩、东方明珠、豫园、南京路、迪士尼",
        "杭州": "西湖、灵隐寺、宋城、西溪湿地、千岛湖",
        "成都": "宽窄巷子、锦里、大熊猫基地、都江堰、青城山",
    }
    return attractions.get(city, f"{city}暂无景点信息")


@tool
def estimate_travel_time(from_city: str, to_city: str) -> str:
    """估算两个城市之间的交通时间和方式"""
    times = {
        ("北京", "上海"): "高铁约4.5小时，飞机约2小时",
        ("上海", "杭州"): "高铁约1小时，自驾约2小时",
        ("北京", "杭州"): "高铁约5小时，飞机约2小时",
    }
    key = (from_city, to_city)
    reverse_key = (to_city, from_city)
    return times.get(key) or times.get(reverse_key) or f"{from_city}到{to_city}的交通信息暂无"


# 组合所有工具
tools = [get_weather, get_current_time, search_attractions, estimate_travel_time]

# 创建带记忆的 Agent
memory = MemorySaver()
agent = create_react_agent(llm, tools, checkpointer=memory)

if __name__ == "__main__":
    config = {"configurable": {"thread_id": "travel-planner"}}
    
    question = """
    我想在春节期间从北京去上海玩3天，请帮我：
    1. 查看两地天气
    2. 推荐上海的景点
    3. 估算交通时间
    4. 给出一个简单的出行建议
    """
    
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]},
        config
    )
    print(result["messages"][-1].content)
```

---

## 8. 课后练习

1. 添加 `search_restaurants` 工具，推荐当地美食
2. 添加 `calculate_budget` 工具，估算旅行预算
3. 尝试让 Agent 规划一个"成都 5 日游"

---

## 下一课预告

**第五课：构建完整的 Agent 应用**
- 添加 Web 界面
- 用户输入交互
- 部署上线
