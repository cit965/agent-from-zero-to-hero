#!/bin/bash

# 激活虚拟环境（从项目根目录）
source "$(dirname "$0")/.venv/bin/activate"

# 设置 API Key
export ZHIPU_API_KEY="87d066b707514d128dd6929ebce7959e.DjjZdsvdQ1ockUnN"

# 安装 Flask（如果没有安装）
pip install flask -q

# 运行 Web 应用
python "$(dirname "$0")/app.py"
