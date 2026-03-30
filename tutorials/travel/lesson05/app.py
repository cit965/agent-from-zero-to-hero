"""
第五课：构建完整的 Agent 应用
Flask Web 服务
"""

import os
import uuid
from flask import Flask, request, jsonify, render_template
from agent import create_agent

# 设置 API Key
os.environ["ZHIPU_API_KEY"] = os.getenv("ZHIPU_API_KEY", "")

app = Flask(__name__)
agent = create_agent()


@app.route('/')
def index():
    """主页"""
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    try:
        data = request.json
        user_message = data.get('message', '')
        thread_id = data.get('thread_id', str(uuid.uuid4()))
        
        if not user_message:
            return jsonify({"error": "消息不能为空"}), 400
        
        # 调用 Agent
        config = {"configurable": {"thread_id": thread_id}}
        result = agent.invoke(
            {"messages": [{"role": "user", "content": user_message}]},
            config
        )
        
        # 提取工具调用信息
        tool_calls = []
        for msg in result["messages"]:
            if type(msg).__name__ == "ToolMessage":
                tool_calls.append({
                    "tool": msg.name,
                    "result": msg.content[:100] + "..." if len(msg.content) > 100 else msg.content
                })
        
        return jsonify({
            "response": result["messages"][-1].content,
            "thread_id": thread_id,
            "tool_calls": tool_calls
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/new_chat', methods=['POST'])
def new_chat():
    """创建新对话"""
    thread_id = str(uuid.uuid4())
    return jsonify({"thread_id": thread_id})


if __name__ == '__main__':
    print("=" * 50)
    print("🤖 旅行规划助手已启动")
    print("=" * 50)
    print("访问地址: http://localhost:8080")
    print("=" * 50)
    app.run(debug=True, port=8080, host='0.0.0.0')
