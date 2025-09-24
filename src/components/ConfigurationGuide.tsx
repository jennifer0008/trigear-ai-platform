import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, AlertCircle, Settings } from 'lucide-react';

interface ConfigurationGuideProps {
  onClose: () => void;
}

const ConfigurationGuide: React.FC<ConfigurationGuideProps> = ({ onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const systemPrompt = `你是一个专业的铁人三项装备导购专家。你需要：

1. 了解用户的运动水平（新手/中级/高级）
2. 确认用户的预算范围
3. 明确用户的训练目标和比赛计划
4. 根据用户需求推荐合适的装备
5. 提供专业的产品对比和选购建议

请用友好、专业的语调与用户交流，并提供具体的产品推荐。`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Dify Agent 配置指南</h3>
              <p className="text-sm text-gray-500">连接你的AI助手到Dify平台</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Step 1: 注册Dify账号 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900">注册Dify账号</h4>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-gray-600">首先需要在Dify平台注册账号并创建应用</p>
              <a
                href="https://dify.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                访问 Dify.ai
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Step 2: 创建Agent应用 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900">创建Agent应用</h4>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-gray-600">在Dify控制台中创建一个新的Agent应用</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">操作步骤：</h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>登录Dify控制台</li>
                  <li>点击"创建应用"</li>
                  <li>选择"Agent"类型</li>
                  <li>输入应用名称：TriGear AI Assistant</li>
                  <li>选择合适的模型（推荐GPT-4或Claude）</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 3: 配置系统提示词 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900">配置系统提示词</h4>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-gray-600">将以下提示词复制到Dify应用的系统提示词中：</p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
{systemPrompt}
                </pre>
                <button
                  onClick={() => copyToClipboard(systemPrompt, 3)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {copiedStep === 3 ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step 4: 设置输入变量 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <h4 className="text-lg font-semibold text-gray-900">设置输入变量</h4>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-gray-600">在Dify应用中添加以下输入变量：</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h6 className="font-medium text-gray-900">user_level</h6>
                  <p className="text-sm text-gray-700">用户运动水平</p>
                  <p className="text-xs text-gray-600 mt-1">类型: Text</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h6 className="font-medium text-gray-900">budget_range</h6>
                  <p className="text-sm text-gray-700">预算范围</p>
                  <p className="text-xs text-gray-600 mt-1">类型: Text</p>
                </div>
                <div className="bg-gray-200 p-4 rounded-lg">
                  <h6 className="font-medium text-gray-900">sport_focus</h6>
                  <p className="text-sm text-gray-700">关注的运动项目</p>
                  <p className="text-xs text-gray-600 mt-1">类型: Text</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: 获取API密钥 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <h4 className="text-lg font-semibold text-gray-900">获取API密钥</h4>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-gray-600">从Dify应用中获取API密钥并配置到项目中</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">操作步骤：</h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>在Dify应用页面，点击"API访问"</li>
                  <li>复制"API密钥"</li>
                  <li>将密钥粘贴到项目根目录的 .env 文件中</li>
                </ol>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h6 className="font-medium text-yellow-900">配置环境变量</h6>
                    <p className="text-sm text-yellow-700 mt-1">
                      编辑项目根目录的 <code className="bg-yellow-100 px-1 rounded">.env</code> 文件：
                    </p>
                    <div className="mt-2 relative">
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
VITE_DIFY_API_KEY=your-actual-api-key-here
VITE_DIFY_BASE_URL=http://teach.excelmaster.ai/v1
                      </pre>
                      <button
                        onClick={() => copyToClipboard('VITE_DIFY_API_KEY=your-actual-api-key-here\nVITE_DIFY_BASE_URL=http://teach.excelmaster.ai/v1', 5)}
                        className="absolute top-1 right-1 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        {copiedStep === 5 ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6: 测试连接 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-semibold">
                6
              </div>
              <h4 className="text-lg font-semibold text-gray-900">配置服务器CORS</h4>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-gray-600">服务器端必须配置CORS头以允许跨域访问</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h6 className="font-medium text-red-900">⚠️ 重要：服务器端CORS配置</h6>
                <p className="text-sm text-red-700 mt-2 mb-3">
                  请联系服务器管理员在 <code className="bg-red-100 px-1 rounded">teach.excelmaster.ai</code> 服务器上添加以下CORS配置：
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Nginx 配置示例
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

# Express.js 配置示例
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

# Python Flask 配置示例
from flask_cors import CORS
CORS(app, origins="*", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`# Nginx 配置示例
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
}`, 6)}
                    className="absolute top-1 right-1 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    {copiedStep === 6 ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 7: 测试连接 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-semibold">
                7
              </div>
              <h4 className="text-lg font-semibold text-gray-900">测试连接</h4>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-gray-600">服务器配置CORS后，测试连接</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h6 className="font-medium text-green-900">验证步骤：</h6>
                <ol className="list-decimal list-inside space-y-1 text-sm text-green-700 mt-2">
                  <li>确认服务器已配置CORS并重启</li>
                  <li>刷新Bolt应用页面</li>
                  <li>点击右上角的AI助手按钮</li>
                  <li>点击🛡️按钮运行CORS诊断</li>
                  <li>发送测试消息验证连接</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              <span>需要帮助？查看 README.md 文件获取更多详细信息</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              完成配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationGuide;