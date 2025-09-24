import React, { useState } from 'react';
import { Bot, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { useDifyChat } from '../hooks/useDifyChat';

interface IframeChatProps {
  onClose: () => void;
}

const IframeChat: React.FC<IframeChatProps> = ({ onClose }) => {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalChat, setUseLocalChat] = useState(false);
  const { messages, isLoading: chatLoading, error: chatError, sendMessage, configStatus } = useDifyChat();

  const handleIframeLoad = () => {
    setIsLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
    console.error('Iframe加载失败，可能是CORS或网络问题');
  };

  const retryLoad = () => {
    setIsLoading(true);
    setIframeError(false);
    // 强制重新加载iframe
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const switchToLocalChat = () => {
    setUseLocalChat(true);
    setIframeError(false);
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">运动AI贴身管家</h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">专业运动装备推荐助手</p>
                <div className="flex items-center text-xs">
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    已连接
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Iframe Content */}
        <div className="flex-1 p-6">
          <div className="h-full rounded-xl overflow-hidden border border-gray-200 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">正在加载AI助手...</p>
                </div>
              </div>
            )}
            
            {iframeError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
                  <p className="text-gray-600 mb-4">
                    无法加载AI助手，可能是网络问题或服务不可用
                  </p>
                  <div className="space-y-3">
                    <div className="flex space-x-3 justify-center">
                      <button
                        onClick={retryLoad}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>重试</span>
                      </button>
                      {configStatus.hasApiKey && (
                        <button
                          onClick={switchToLocalChat}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>使用本地聊天</span>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      如果问题持续，请检查网络连接或稍后重试
                    </p>
                  </div>
                </div>
              </div>
            ) : useLocalChat ? (
              <div className="h-full flex flex-col">
                {/* 聊天消息区域 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>开始与AI助手对话吧！</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          <span className="text-sm">AI正在思考...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 错误提示 */}
                {chatError && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-400">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{chatError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 输入区域 */}
                <div className="border-t p-4">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                      if (input.value.trim()) {
                        await handleSendMessage(input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="flex space-x-2"
                  >
                    <input
                      type="text"
                      placeholder="输入你的问题..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      发送
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <iframe 
                src={import.meta.env.VITE_CHATBOT_URL || "https://teach.excelmaster.ai/chatbot/kX2Mcc2xV30qNjqB"} 
                className="w-full h-full"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  minHeight: '500px',
                  border: 'none'
                }}
                frameBorder="0" 
                allow="microphone; camera; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-top-navigation"
                title="运动AI贴身管家"
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-center text-sm text-gray-600">
            💡 提示：AI助手正在为您搜索网页获取最新的运动装备信息
          </div>
        </div>
      </div>
    </div>
  );
};

export default IframeChat;