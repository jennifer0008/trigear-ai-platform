# 本地运行指南

## 📦 项目信息

- **项目名称**: TriGear AI - 铁三装备导购平台
- **仓库地址**: https://github.com/jennifer0008/trigear-ai-platform
- **分支**: claude/open-project-011CUtky2NpLARUQmVK8iG7d

## 🚀 快速开始

### 1️⃣ 克隆项目到本地

```bash
# 克隆仓库
git clone https://github.com/jennifer0008/trigear-ai-platform.git

# 进入项目目录
cd trigear-ai-platform

# 切换到开发分支
git checkout claude/open-project-011CUtky2NpLARUQmVK8iG7d
```

### 2️⃣ 安装依赖

项目支持多种包管理器，选择其中一个即可：

**使用 pnpm（推荐 - 更快更节省空间）:**
```bash
# 如果没有安装 pnpm，先安装
npm install -g pnpm

# 安装项目依赖
pnpm install
```

**使用 npm:**
```bash
npm install
```

**使用 yarn:**
```bash
yarn install
```

### 3️⃣ 配置环境变量（可选）

如果您想使用完整的AI对话功能，需要配置Dify API密钥：

```bash
# 创建 .env 文件
touch .env
```

编辑 `.env` 文件，添加以下内容：

```env
# Dify AI配置（用于API模式聊天）
VITE_DIFY_API_KEY=your-dify-api-key-here
VITE_DIFY_BASE_URL=https://api.dify.ai/v1

# 可选：聊天机器人URL配置（用于Iframe模式）
VITE_CHATBOT_URL=http://teach.excelmaster.ai/chatbot/kX2Mcc2xV30qNjqB
```

**注意**：
- 如果不配置 API 密钥，应用将使用 Iframe 模式的聊天功能
- 要获取 Dify API 密钥，请访问 [dify.ai](https://dify.ai)

### 4️⃣ 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

启动成功后，您将看到：

```
VITE v5.4.20  ready in 316 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

### 5️⃣ 在浏览器中访问

打开浏览器，访问：**http://localhost:3000/**

🎉 您现在可以看到完整的 TriGear AI 装备导购平台了！

## 📱 应用功能

- **🏠 首页** - 精美的英雄区域和产品展示
- **🤖 AI 导购助手** - 点击右下角的聊天按钮，开启智能导购对话
- **🏊‍♂️ 装备分类** - 游泳、自行车、跑步、营养补给四大类别
- **💬 智能对话** - 两种模式：
  - API模式（需要配置Dify密钥）
  - Iframe模式（无需配置，开箱即用）

## 🛠️ 其他命令

### 类型检查
```bash
pnpm type-check
# 或
npm run type-check
```

### 代码检查
```bash
pnpm lint
# 或
npm run lint
```

### 代码修复
```bash
pnpm lint:fix
# 或
npm run lint:fix
```

### 构建生产版本
```bash
pnpm build
# 或
npm run build
```

### 预览生产构建
```bash
pnpm preview
# 或
npm run preview
```

## 🔧 故障排除

### 端口被占用
如果 3000 端口已被占用，Vite 会自动使用下一个可用端口（如 3001）。

您也可以手动指定端口：
```bash
pnpm dev -- --port 3001
```

### 依赖安装失败
如果遇到依赖安装问题，尝试：
```bash
# 清除缓存
rm -rf node_modules pnpm-lock.yaml
# 或 npm
rm -rf node_modules package-lock.json

# 重新安装
pnpm install
```

### 热更新不生效
有时需要清除 Vite 缓存：
```bash
rm -rf node_modules/.vite
pnpm dev
```

## 📚 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式框架**: Tailwind CSS 3
- **图标库**: Lucide React
- **AI 服务**: Dify Agent API

## 🎯 下一步

- 探索应用的各个功能
- 配置 Dify API 以体验完整的 AI 对话
- 根据需求修改和定制应用
- 查看 `DEPLOYMENT.md` 了解如何部署到生产环境

## 💡 提示

- 项目使用响应式设计，在移动设备上也有良好体验
- AI 助手会根据您的问题推荐合适的铁三装备
- 可以通过修改 `src/components` 中的组件来定制界面

---

祝您使用愉快！如有问题，请查看项目的 README.md 文件。
