"""
Agent 模块
定义旅行规划助手 Agent
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
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain.tools import tool

# 心知天气 API 配置
SENIVERSE_UID = "Pc9Fuy4ms9vV1btnZ"
SENIVERSE_KEY = "S4KHevvOhFIYayLbu"
SENIVERSE_API_URL = "https://api.seniverse.com/v3/weather/now.json"


# ============================================================
# 工具定义
# ============================================================

@tool
def get_weather(city: str) -> str:
    """查询城市实时天气，用于了解穿衣和出行建议"""
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


@tool
def search_attractions(city: str) -> str:
    """搜索城市的热门景点"""
    attractions = {
        "北京": "故宫（门票60元）、长城（门票40元）、颐和园（门票30元）、天坛（门票15元）、南锣鼓巷（免费）",
        "上海": "外滩（免费）、东方明珠（门票199元）、豫园（门票40元）、南京路（免费）、迪士尼（门票475元）",
        "杭州": "西湖（免费）、灵隐寺（门票75元）、宋城（门票300元）、西溪湿地（门票80元）",
        "成都": "宽窄巷子（免费）、锦里（免费）、大熊猫基地（门票55元）、都江堰（门票80元）",
        "西安": "兵马俑（门票120元）、大雁塔（免费）、回民街（免费）、古城墙（门票54元）",
    }
    return attractions.get(city, f"{city}暂无景点信息")


@tool
def estimate_travel_time(from_city: str, to_city: str) -> str:
    """估算两个城市之间的交通时间和费用"""
    times = {
        ("北京", "上海"): "高铁约4.5小时（二等座553元），飞机约2小时",
        ("上海", "杭州"): "高铁约1小时（二等座73元）",
        ("北京", "杭州"): "高铁约5小时（二等座626元）",
        ("北京", "成都"): "高铁约8小时（二等座778元）",
        ("北京", "西安"): "高铁约4.5小时（二等座515元）",
    }
    key = (from_city, to_city)
    reverse_key = (to_city, from_city)
    return times.get(key) or times.get(reverse_key) or f"{from_city}到{to_city}：建议查询12306"


@tool
def search_hotels(city: str, budget: str = "中等") -> str:
    """搜索城市酒店，budget可选：经济、中等、高端"""
    hotels = {
        "北京": {"经济": "如家（150-250元/晚）", "中等": "全季（300-500元/晚）", "高端": "王府井文华东方（1000+元/晚）"},
        "上海": {"经济": "如家（180-280元/晚）", "中等": "全季（350-600元/晚）", "高端": "和平饭店（1500+元/晚）"},
        "杭州": {"经济": "如家（150-250元/晚）", "中等": "全季（280-450元/晚）", "高端": "西湖国宾馆（2000+元/晚）"},
    }
    city_hotels = hotels.get(city, {})
    return city_hotels.get(budget, f"{city}暂无{budget}档次的酒店信息")


# 工具列表
tools = [get_weather, get_current_time, search_attractions, estimate_travel_time, search_hotels]


def create_agent():
    """创建带记忆的 Agent"""
    zhipu_api_key = os.getenv("ZHIPU_API_KEY")
    
    llm = ChatOpenAI(
        temperature=0.7,
        model="glm-4.7",
        openai_api_key=zhipu_api_key,
        openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
    )
    
    memory = InMemorySaver()
    agent = create_react_agent(llm, tools, checkpointer=memory)
    
    return agent
