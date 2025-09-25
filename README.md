# TriGear AI - 铁三装备导购平台

专业的AI驱动铁人三项装备导购平台，为每位铁三爱好者提供个性化装备推荐。

## 功能特性

- 🤖 **AI智能导购** - 基于Dify Agent的专业装备推荐
- 🏊‍♂️ **分类浏览** - 游泳、自行车、跑步、营养补给四大类别
- 💬 **智能对话** - 支持两种模式：API模式和Iframe模式
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎯 **个性化推荐** - 根据运动水平、预算、目标精准推荐

## 聊天模式

### API模式（推荐）
- 需要配置Dify API密钥
- 支持完整的对话上下文
- 可自定义AI行为
- 支持流式响应

### Iframe模式（备用）
- 无需配置，开箱即用
- 使用外部聊天机器人
- 适合快速演示

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **图标库**: Lucide React
- **AI服务**: Dify Agent API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件并配置你的Dify API信息：

```bash
# 创建.env文件
touch .env
```

编辑 `.env` 文件：

```env
# Dify AI配置（必需 - 用于API模式聊天）
VITE_DIFY_API_KEY=your-dify-api-key-here
VITE_DIFY_BASE_URL=https://api.dify.ai/v1

# 可选：聊天机器人URL配置（用于Iframe模式）
VITE_CHATBOT_URL=http://teach.excelmaster.ai/chatbot/kX2Mcc2xV30qNjqB
```

**重要说明**：
- 如果不配置 `VITE_DIFY_API_KEY`，应用将只支持Iframe模式的聊天
- 配置了API密钥后，可以使用完整的Dify API功能

### 3. 启动开发服务器

```bash
npm run dev
```

## Dify Agent 配置

### 获取API密钥

1. 访问 [Dify控制台](https://dify.ai)
2. 创建或选择你的应用
3. 在"API访问"页面获取API密钥
4. 将API密钥配置到环境变量中

### 服务器端CORS配置

**重要：** 如果遇到跨域访问问题，需要在服务器端配置CORS。

#### Nginx配置示例
```nginx
location /v1/ {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
    
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    proxy_pass http://backend;
}
```

#### Express.js配置示例
```javascript
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));
```

#### Python Flask配置示例
```python
from flask_cors import CORS

CORS(app, origins="*", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
```

### Agent设置建议

为了获得最佳的铁三装备导购效果，建议在Dify中配置以下内容：

**系统提示词示例**：
```
你是一个专业的铁人三项装备导购专家。你需要：

1. 了解用户的运动水平（新手/中级/高级）
2. 确认用户的预算范围
3. 明确用户的训练目标和比赛计划
4. 根据用户需求推荐合适的装备
5. 提供专业的产品对比和选购建议

请用友好、专业的语调与用户交流，并提供具体的产品推荐。
```

**输入变量**：
- `user_level`: 用户运动水平
- `budget_range`: 预算范围
- `sport_focus`: 关注的运动项目

## 项目结构

```
src/
├── components/          # React组件
│   ├── Header.tsx      # 头部导航
│   ├── Hero.tsx        # 英雄区域
│   ├── CategoryGrid.tsx # 分类展示
│   ├── FeaturedProducts.tsx # 精选产品
│   ├── AIAssistant.tsx # AI助手
│   └── Footer.tsx      # 页脚
├── hooks/              # 自定义Hooks
│   └── useDifyChat.ts  # Dify聊天Hook
├── services/           # API服务
│   └── difyService.ts  # Dify服务封装
├── config/             # 配置文件
│   └── dify.ts         # Dify配置
└── App.tsx             # 主应用组件
```

## 部署

### 构建生产版本

```bash
npm run build
```

### 环境变量配置

确保在生产环境中正确配置以下环境变量：

- `VITE_DIFY_API_KEY`: Dify API密钥
- `VITE_DIFY_BASE_URL`: Dify API基础URL

## 开发说明

### 添加新的装备分类

1. 在 `CategoryGrid.tsx` 中添加新的分类数据
2. 更新相应的图标和颜色配置
3. 在AI助手中添加对应的处理逻辑

### 自定义AI响应

1. 修改 `useDifyChat.ts` 中的用户上下文配置
2. 在Dify控制台中更新Agent的提示词
3. 调整输入变量以传递更多用户信息

## 许可证

MIT License
