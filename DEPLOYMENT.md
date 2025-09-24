# Vercel 部署指南

## 🚀 部署步骤

### 1. 准备代码
确保你的代码已经提交到Git仓库（GitHub、GitLab等）。

### 2. 连接Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择你的仓库
5. 点击 "Import"

### 3. 配置环境变量
在Vercel项目设置中添加以下环境变量：

```bash
# Dify AI配置（可选 - 用于API模式聊天）
VITE_DIFY_API_KEY=your-dify-api-key-here
VITE_DIFY_BASE_URL=https://api.dify.ai/v1

# 聊天机器人URL配置（可选 - 用于Iframe模式）
VITE_CHATBOT_URL=https://teach.excelmaster.ai/chatbot/kX2Mcc2xV30qNjqB
```

### 4. 部署设置
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔧 解决Iframe空白问题

### 问题原因
1. **HTTPS/HTTP混合内容错误**
2. **CORS策略限制**
3. **X-Frame-Options阻止嵌入**
4. **网络连接问题**

### 解决方案

#### 1. 使用HTTPS URL
确保iframe源地址使用HTTPS：
```typescript
src="https://teach.excelmaster.ai/chatbot/kX2Mcc2xV30qNjqB"
```

#### 2. 配置CSP头部
项目已包含 `vercel.json` 配置文件，设置了适当的内容安全策略。

#### 3. 错误处理和备用方案
- 添加了加载状态指示器
- 提供了重试功能
- 当iframe失败时，可以切换到本地聊天模式（需要配置API密钥）

#### 4. 调试方法
在浏览器开发者工具中检查：
- **Console**: 查看是否有CORS或网络错误
- **Network**: 检查iframe请求是否成功
- **Security**: 查看是否有混合内容警告

## 🛠️ 故障排除

### 常见问题

#### 1. Iframe显示空白
**原因**: 外部服务不允许嵌入
**解决**: 
- 检查外部服务是否支持iframe嵌入
- 使用本地聊天模式作为备用方案

#### 2. 环境变量不生效
**原因**: 环境变量未正确配置
**解决**:
- 在Vercel项目设置中重新配置环境变量
- 重新部署项目

#### 3. 构建失败
**原因**: 依赖或配置问题
**解决**:
- 检查 `package.json` 中的依赖版本
- 确保所有必要的环境变量都已设置

### 调试命令
```bash
# 本地测试构建
npm run build
npm run preview

# 检查环境变量
npm run dev
```

## 📱 部署后验证

1. **访问部署的URL**
2. **测试Iframe聊天功能**
3. **如果iframe失败，测试本地聊天模式**
4. **检查控制台是否有错误**

## 🔄 更新部署

每次代码更新后，Vercel会自动重新部署。如果需要手动触发：

1. 在Vercel控制台点击 "Redeploy"
2. 或者推送新的代码到Git仓库

## 📞 技术支持

如果遇到问题：
1. 检查Vercel部署日志
2. 查看浏览器控制台错误
3. 确认环境变量配置正确
4. 测试本地开发环境是否正常