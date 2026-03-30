#!/bin/bash

# 激活虚拟环境（从项目根目录）
source "$(dirname "$0")/../../.venv/bin/activate"

# 设置 API Key
export ZHIPU_API_KEY="87d066b707514d128dd6929ebce7959e.DjjZdsvdQ1ockUnN"

# 运行 Agent
python "$(dirname "$0")/agent_with_tools.py"
