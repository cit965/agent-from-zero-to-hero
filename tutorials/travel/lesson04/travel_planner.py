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
    """获取当前时间，用于时间相关的规划"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@tool
def search_attractions(city: str) -> str:
    """搜索城市的热门景点，用于旅游规划"""
    attractions = {
        "北京": "故宫（门票60元）、长城（门票40元）、颐和园（门票30元）、天坛（门票15元）、南锣鼓巷（免费）",
        "上海": "外滩（免费）、东方明珠（门票199元）、豫园（门票40元）、南京路（免费）、迪士尼（门票475元）",
        "杭州": "西湖（免费）、灵隐寺（门票75元）、宋城（门票300元）、西溪湿地（门票80元）、千岛湖（门票150元）",
        "成都": "宽窄巷子（免费）、锦里（免费）、大熊猫基地（门票55元）、都江堰（门票80元）、青城山（门票90元）",
        "西安": "兵马俑（门票120元）、大雁塔（免费）、回民街（免费）、华清池（门票120元）、古城墙（门票54元）",
        "广州": "广州塔（门票150元）、长隆（门票350元）、沙面（免费）、陈家祠（门票10元）、白云山（门票5元）",
    }
    return attractions.get(city, f"{city}暂无景点信息，建议查询当地旅游网站")


@tool
def estimate_travel_time(from_city: str, to_city: str) -> str:
    """估算两个城市之间的交通时间和方式"""
    times = {
        ("北京", "上海"): "高铁约4.5小时（二等座553元），飞机约2小时（经济舱800-1500元）",
        ("上海", "杭州"): "高铁约1小时（二等座73元），自驾约2小时",
        ("北京", "杭州"): "高铁约5小时（二等座626元），飞机约2小时（经济舱600-1200元）",
        ("北京", "成都"): "高铁约8小时（二等座778元），飞机约2.5小时（经济舱800-1500元）",
        ("北京", "西安"): "高铁约4.5小时（二等座515元），飞机约2小时（经济舱500-1000元）",
        ("上海", "成都"): "高铁约12小时，飞机约3小时（经济舱700-1400元）",
        ("广州", "北京"): "高铁约8小时（二等座862元），飞机约3小时（经济舱800-1500元）",
    }
    key = (from_city, to_city)
    reverse_key = (to_city, from_city)
    return times.get(key) or times.get(reverse_key) or f"{from_city}到{to_city}：建议查询12306或携程获取详细信息"


@tool
def search_hotels(city: str, budget: str = "中等") -> str:
    """搜索城市的酒店推荐，budget可选：经济、中等、高端"""
    hotels = {
        "北京": {
            "经济": "如家、汉庭（150-250元/晚）",
            "中等": "全季、亚朵（300-500元/晚）",
            "高端": "王府井文华东方、北京饭店（1000-3000元/晚）"
        },
        "上海": {
            "经济": "如家、7天（180-280元/晚）",
            "中等": "全季、桔子水晶（350-600元/晚）",
            "高端": "和平饭店、外滩W酒店（1500-4000元/晚）"
        },
        "杭州": {
            "经济": "如家、汉庭（150-250元/晚）",
            "中等": "全季、亚朵（280-450元/晚）",
            "高端": "西湖国宾馆、安缦法云（2000-5000元/晚）"
        },
    }
    city_hotels = hotels.get(city, {})
    return city_hotels.get(budget, f"{city}暂无{budget}档次的酒店信息")


# 组合所有工具
tools = [get_weather, get_current_time, search_attractions, estimate_travel_time, search_hotels]

# 创建带记忆的 Agent
memory = InMemorySaver()
agent = create_agent(llm, tools, checkpointer=memory)


# ============================================================
# 运行多步骤任务
# ============================================================

if __name__ == "__main__":
    print("=" * 60)
    print("第四课：Agent 工作流与复杂任务")
    print("=" * 60)
    
    config = {"configurable": {"thread_id": "travel-planner"}}
    
    # 复杂任务：旅行规划
    question = """
我想在春节期间从北京去上海玩3天，预算中等，请帮我：
1. 查看两地天气
2. 推荐上海的景点
3. 估算交通时间和费用
4. 推荐住宿
5. 给出一个完整的出行建议
"""
    
    print(f"\n用户: {question}")
    print("\n" + "-" * 60)
    print("Agent 正在处理...")
    print("-" * 60)
    
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]},
        config
    )
    
    # 打印工具调用过程
    print("\n🔧 工具调用记录:")
    for msg in result["messages"]:
        msg_type = type(msg).__name__
        if msg_type == "ToolMessage":
            print(f"   [{msg.name}] → {msg.content[:60]}...")
    
    # 打印最终答案
    print("\n" + "=" * 60)
    print("Agent 最终回答:")
    print("=" * 60)
    print(result["messages"][-1].content)
