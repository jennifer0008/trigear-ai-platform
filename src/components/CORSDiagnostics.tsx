import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, RefreshCw, Globe, Shield, Server } from 'lucide-react';

interface CORSDiagnosticsProps {
  onClose: () => void;
  apiUrl: string;
}

interface DiagnosticResult {
  test: string;
  status: 'pending' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

const CORSDiagnostics: React.FC<CORSDiagnosticsProps> = ({ onClose, apiUrl }) => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const diagnosticTests = [
    {
      name: 'network',
      title: '网络连通性测试',
      icon: Globe,
      test: async () => {
        try {
          const response = await fetch(apiUrl, { method: 'HEAD', mode: 'no-cors' });
          return {
            status: 'success' as const,
            message: '网络连接正常',
            details: '服务器可以访问'
          };
        } catch (error) {
          return {
            status: 'error' as const,
            message: '网络连接失败',
            details: `无法连接到 ${apiUrl}`
          };
        }
      }
    },
    {
      name: 'cors-preflight',
      title: 'CORS预检请求',
      icon: Shield,
      test: async () => {
        try {
          const response = await fetch(apiUrl, {
            method: 'OPTIONS',
            headers: {
              'Origin': window.location.origin,
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'Content-Type, Authorization'
            }
          });

          const corsOrigin = response.headers.get('access-control-allow-origin');
          const corsMethods = response.headers.get('access-control-allow-methods');
          const corsHeaders = response.headers.get('access-control-allow-headers');

          if (response.ok || response.status === 200) {
            return {
              status: 'success' as const,
              message: 'CORS预检通过',
              details: `允许的源: ${corsOrigin || '未设置'}\n允许的方法: ${corsMethods || '未设置'}\n允许的头: ${corsHeaders || '未设置'}`
            };
          } else if (response.status === 405) {
            return {
              status: 'warning' as const,
              message: 'OPTIONS方法不支持',
              details: '服务器不支持OPTIONS请求，但这可能是正常的'
            };
          } else {
            return {
              status: 'error' as const,
              message: `CORS预检失败 (${response.status})`,
              details: '服务器可能未配置CORS或拒绝跨域请求'
            };
          }
        } catch (error) {
          return {
            status: 'error' as const,
            message: 'CORS预检请求失败',
            details: error instanceof Error ? error.message : '未知错误'
          };
        }
      }
    },
    {
      name: 'api-endpoint',
      title: 'API端点测试',
      icon: Server,
      test: async () => {
        try {
          const response = await fetch(`${apiUrl}/chat-messages`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.status === 401) {
            return {
              status: 'warning' as const,
              message: 'API端点存在但需要认证',
              details: '端点正常，但需要有效的API密钥'
            };
          } else if (response.status === 405) {
            return {
              status: 'success' as const,
              message: 'API端点存在',
              details: 'GET方法不支持，但端点存在'
            };
          } else if (response.ok) {
            return {
              status: 'success' as const,
              message: 'API端点正常',
              details: '端点响应正常'
            };
          } else {
            return {
              status: 'error' as const,
              message: `API端点错误 (${response.status})`,
              details: `HTTP ${response.status}: ${response.statusText}`
            };
          }
        } catch (error) {
          return {
            status: 'error' as const,
            message: 'API端点不可访问',
            details: error instanceof Error ? error.message : '未知错误'
          };
        }
      }
    }
  ];

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    for (const diagnostic of diagnosticTests) {
      // 添加pending状态
      setResults(prev => [...prev, {
        test: diagnostic.name,
        status: 'pending',
        message: `正在测试 ${diagnostic.title}...`,
      }]);

      try {
        const result = await diagnostic.test();
        setResults(prev => prev.map(r => 
          r.test === diagnostic.name 
            ? { test: diagnostic.name, ...result }
            : r
        ));
      } catch (error) {
        setResults(prev => prev.map(r => 
          r.test === diagnostic.name 
            ? {
                test: diagnostic.name,
                status: 'error' as const,
                message: '测试失败',
                details: error instanceof Error ? error.message : '未知错误'
              }
            : r
        ));
      }

      // 添加延迟以便用户看到进度
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pending':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">CORS 连接诊断</h3>
              <p className="text-sm text-gray-500">检查跨域访问配置</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              title="重新运行诊断"
            >
              <RefreshCw className={`h-5 w-5 text-gray-500 ${isRunning ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* API URL */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">测试地址</h4>
          <code className="text-sm bg-gray-100 px-3 py-2 rounded-lg block">{apiUrl}</code>
        </div>

        {/* Results */}
        <div className="p-6 space-y-4">
          {results.map((result, index) => {
            const diagnostic = diagnosticTests.find(d => d.name === result.test);
            const IconComponent = diagnostic?.icon || Globe;
            
            return (
              <div
                key={result.test}
                className={`border rounded-xl p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="h-6 w-6 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        {diagnostic?.title || result.test}
                      </h5>
                      {getStatusIcon(result.status)}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                    {result.details && (
                      <details className="text-xs text-gray-600">
                        <summary className="cursor-pointer hover:text-gray-800">
                          查看详情
                        </summary>
                        <pre className="mt-2 p-2 bg-white rounded border whitespace-pre-wrap">
                          {result.details}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Solutions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">常见解决方案</h4>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-medium text-red-900 mb-2">🚨 服务器端CORS配置（必需）</h5>
              <div className="space-y-2 text-sm text-red-700">
                <div className="flex items-start space-x-2">
                  <span className="font-medium">1.</span>
                  <span>联系 <code className="bg-red-100 px-1 rounded">http://teach.excelmaster.ai</code> 服务器管理员</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">2.</span>
                  <span>要求添加CORS头：<code className="bg-red-100 px-1 rounded">Access-Control-Allow-Origin: *</code></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">3.</span>
                  <span>支持OPTIONS预检请求和POST方法</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">4.</span>
                  <span>允许Authorization头用于API密钥认证</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">5.</span>
                  <span>确保服务器支持HTTP协议（非HTTPS）</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">🔧 客户端检查项</h5>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <span className="font-medium">1.</span>
                  <span>确认API地址正确：<code className="bg-blue-100 px-1 rounded">https://teach.excelmaster.ai/v1</code></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">2.</span>
                  <span>验证API密钥格式正确</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-medium">3.</span>
                  <span>检查网络连接和防火墙设置</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CORSDiagnostics;