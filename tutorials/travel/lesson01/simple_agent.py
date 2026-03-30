"""
最简单的 LangChain Agent Demo
使用智谱 GLM-4 作为 LLM
"""

import os
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import create_agent

# 1. 从环境变量加载 API Key
ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY")

# 2. 创建 LLM（大语言模型）
# 或者使用环境变量
llm = ChatOpenAI(
    temperature=0.6,
    model="glm-5",
    openai_api_key=os.getenv("ZAI_API_KEY"),
    openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
)

# 3. 定义工具（Agent 可以使用的能力）
@tool
def add(a: int, b: int) -> int:
    """计算两个数字的和"""
    return a + b

@tool
def multiply(a: int, b: int) -> int:
    """计算两个数字的乘积"""
    return a * b

# 4. 工具列表
tools = [add, multiply]

# 5. 创建 Agent（使用 langgraph 的 create_react_agent）
agent = create_agent(llm, tools)

# 6. 运行 Agent
if __name__ == "__main__":
    print("=" * 50)
    print("LangChain Agent Demo - 使用智谱 GLM-4")
    print("=" * 50)
    
    # 测试问题
    question = "用 add 工具计算 3+5，再用 multiply 工具把结果乘以 2"
    
    print(f"\n问题: {question}\n")
    
    # 调用 agent
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})
    
    # 打印完整的消息历史，查看 tool 调用过程
    print("\n" + "=" * 50)
    print("消息历史（可以看到 Tool 调用）:")
    print("=" * 50)
    
    for i, msg in enumerate(result["messages"]):
        msg_type = type(msg).__name__
        print(f"\n[{i+1}] {msg_type}:")
        
        if msg_type == "HumanMessage":
            print(f"    用户: {msg.content}")
        elif msg_type == "AIMessage":
            if msg.tool_calls:
                print(f"    🤖 AI 决定调用工具:")
                for tc in msg.tool_calls:
                    print(f"       → {tc['name']}({tc['args']})")
            if msg.content:
                print(f"    🤖 AI: {msg.content[:100]}...")
        elif msg_type == "ToolMessage":
            print(f"    🔧 工具 [{msg.name}] 返回: {msg.content}")
    
    print("\n" + "=" * 50)
    print(f"最终答案: {result['messages'][-1].content}")
