"""
第三课：Agent 记忆与多轮对话
让 Agent 记住之前的对话上下文
"""

import os
import time
import hashlib
import hmac
import base64
import requests
from urllib import parse
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver  

# 从环境变量加载 API Key
ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY")

# 心知天气 API 配置
SENIVERSE_UID = "Pc9Fuy4ms9vV1btnZ"
SENIVERSE_KEY = "S4KHevvOhFIYayLbu"
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"

# 创建 LLM
llm = ChatOpenAI(
    temperature=0.7,
    model="glm-5.1",
    openai_api_key=ZHIPU_API_KEY,
    openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
)


# 定义工具
@tool
def get_weather(city: str) -> str:
    """查询指定城市的实时天气情况，支持中文城市名如北京、上海等"""
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


# 工具列表
tools = [get_weather, get_current_time]

# 创建带记忆的 Agent
memory = InMemorySaver()
agent = create_agent(llm, tools, checkpointer=memory)


# 运行多轮对话
if __name__ == "__main__":
    print("=" * 60)
    print("第三课：Agent 记忆与多轮对话")
    print("=" * 60)
    
    # 对话配置（使用 thread_id 标识同一个对话）
    config = {"configurable": {"thread_id": "demo-conversation"}}
    
    # 多轮对话
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
        
        # 打印消息历史
        for msg in result["messages"]:
            msg_type = type(msg).__name__
            if msg_type == "ToolMessage":
                print(f"🔧 工具 [{msg.name}] 返回: {msg.content}")
        
        # 打印最终答案
        print(f"\nAgent: {result['messages'][-1].content}")
