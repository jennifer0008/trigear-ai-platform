import React, { useState } from 'react';
import { X, Bot, Settings, HelpCircle, FileText, Shield, ExternalLink } from 'lucide-react';
import ConfigurationGuide from './ConfigurationGuide';
import LogViewer from './LogViewer';
import CORSDiagnostics from './CORSDiagnostics';

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [showLogViewer, setShowLogViewer] = useState(false);
  const [showCORSDiagnostics, setShowCORSDiagnostics] = useState(false);
  const [useIframe, setUseIframe] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI装备助手</h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">专业铁三装备导购</p>
                <div className="flex items-center text-xs">
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    已连接
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setUseIframe(!useIframe)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              title={useIframe ? '切换到API模式' : '切换到iframe模式'}
            >
              <ExternalLink className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setShowConfigGuide(true)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              title="配置指南"
            >
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setShowCORSDiagnostics(true)}
              className="p-2 hover:bg-blue-100 rounded-xl transition-colors duration-200 bg-blue-50"
              title="CORS诊断"
            >
              <Shield className="h-5 w-5 text-blue-600" />
            </button>
            <button
              onClick={() => setShowLogViewer(true)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              title="查看日志"
            >
              <FileText className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>


        {/* Chat Interface */}
        <div className="flex-1 p-6">
          {useIframe ? (
            <div className="h-full rounded-xl overflow-hidden border border-gray-200">
              <iframe 
                key={iframeKey}
                src="https://teach.excelmaster.ai/chatbot/kX2Mcc2xV30qNjqB" 
                className="w-full h-full min-h-[500px]"
                frameBorder="0"
                allow="microphone; camera; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups"
                title="TriGear AI装备助手"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl">
              <div className="text-center">
                <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">API模式</h4>
                <p className="text-gray-600 mb-4">需要配置Dify API密钥才能使用</p>
                <button
                  onClick={() => setShowConfigGuide(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  查看配置指南
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              💡 提示：点击 <ExternalLink className="inline h-4 w-4" /> 可以切换聊天模式
            </div>
            <div className="text-gray-500">
              Powered by Dify AI
            </div>
          </div>
        </div>
      </div>
      
      {showConfigGuide && (
        <ConfigurationGuide onClose={() => setShowConfigGuide(false)} />
      )}
      
      {showLogViewer && (
        <LogViewer onClose={() => setShowLogViewer(false)} />
      )}
      
      {showCORSDiagnostics && (
        <CORSDiagnostics 
          onClose={() => setShowCORSDiagnostics(false)} 
          apiUrl="http://teach.excelmaster.ai/v1"
        />
      )}
    </div>
  );
};

export default AIAssistant;