"""
第二课：为 Agent 添加更多工具
使用心知天气 API 获取真实天气（签名验证方式）
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
from dotenv import load_dotenv


# 加载环境变量（包括 LangSmith 配置）
load_dotenv()

# 从环境变量加载 API Key
ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY")

# 心知天气 API 配置（使用签名验证）
SENIVERSE_UID = "Pc9Fuy4ms9vV1btnZ"  # 公钥（用户ID）
SENIVERSE_KEY = "S4KHevvOhFIYayLbu"  # 私钥
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"

# 创建 LLM
llm = ChatOpenAI(
    temperature=0.7,
    model="glm-4.7",
    openai_api_key=ZHIPU_API_KEY,
    openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
)

# 定义工具


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
            return f"未找到 {city} 的天气信息: {data.get('status', '未知错误')}"
    except Exception as e:
        return f"获取天气失败: {str(e)}"

@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 组合所有工具
tools = [get_weather, get_current_time]

# 创建 Agent
agent = create_agent(llm, tools)

# 运行
if __name__ == "__main__":
    print("=" * 50)
    print("第二课：为 Agent 添加更多工具")
    print("=" * 50)
    
    question = "现在几点了？北京天气怎么样？"
    print(f"\n问题: {question}\n")
    
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    
    # 打印消息历史
    print("\n" + "=" * 50)
    print("消息历史（可以看到 Tool 调用）:")
    print("=" * 50)
    
    for i, msg in enumerate(result["messages"]):
        msg_type = type(msg).__name__
        print(f"\n[{i+1}] {msg_type}:")
        
        if msg_type == "HumanMessage":
            print(f"    用户: {msg.content}")
        elif msg_type == "AIMessage":
            if hasattr(msg, 'tool_calls') and msg.tool_calls:
                print(f"    🤖 AI 决定调用工具:")
                for tc in msg.tool_calls:
                    print(f"       → {tc['name']}({tc['args']})")
            if msg.content:
                print(f"    🤖 AI: {msg.content[:100]}...")
        elif msg_type == "ToolMessage":
            print(f"    🔧 工具 [{msg.name}] 返回: {msg.content}")
    
    print("\n" + "=" * 50)
    print(f"最终答案: {result['messages'][-1].content}")
