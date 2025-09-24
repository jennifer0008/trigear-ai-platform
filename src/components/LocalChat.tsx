import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { createDifyService } from '../services/difyService';
import { DIFY_CONFIG, validateDifyConfig } from '../config/dify';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface LocalChatProps {
  onClose: () => void;
}

const LocalChat: React.FC<LocalChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好！我是您的运动AI贴身管家。请告诉我您的运动项目和需求，我会为您推荐最适合的装备。',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isConfigValid, setIsConfigValid] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const difyService = useRef<ReturnType<typeof createDifyService> | null>(null);

  useEffect(() => {
    // 验证配置
    const configValid = validateDifyConfig();
    setIsConfigValid(configValid);
    
    if (configValid) {
      difyService.current = createDifyService(DIFY_CONFIG.API_KEY, DIFY_CONFIG.BASE_URL);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping || !difyService.current || !isConfigValid) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      let botResponse = '';
      const startTime = Date.now();
      
      // 使用流式响应
      const result = await difyService.current.sendStreamingMessage(
        inputText,
        (chunk: string) => {
          botResponse += chunk;
          // 实时更新回复消息
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            if (lastMessage && lastMessage.sender === 'bot' && lastMessage.id.startsWith('streaming_')) {
              // 更新现有的流式消息
              lastMessage.text = botResponse;
            } else {
              // 创建新的流式消息
              newMessages.push({
                id: `streaming_${Date.now()}`,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
              });
            }
            
            return newMessages;
          });
        },
        conversationId
      );

      // 设置对话ID以保持上下文
      if (result.conversationId) {
        setConversationId(result.conversationId);
      }

      // 最终确认消息内容
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (lastMessage && lastMessage.sender === 'bot') {
          lastMessage.text = result.fullResponse || botResponse;
          lastMessage.id = (Date.now() + 1).toString(); // 给最终消息一个正式的ID
        }
        
        return newMessages;
      });

      const duration = Date.now() - startTime;
      console.log(`Dify API 响应完成，耗时: ${duration}ms`);
      
    } catch (error) {
      console.error('Dify API 调用失败:', error);
      
      let errorMessage = '抱歉，AI助手暂时无法回复，请稍后重试。';
      
      if (error instanceof Error) {
        if (error.message.includes('网络连接失败') || error.message.includes('NETWORK_ERROR')) {
          errorMessage = '网络连接失败，请检查网络连接或稍后重试。';
        } else if (error.message.includes('API密钥无效')) {
          errorMessage = 'API密钥无效，请联系管理员。';
        } else if (error.message.includes('连接超时')) {
          errorMessage = '连接超时，服务器响应时间过长，请稍后重试。';
        }
      }
      
      setError(errorMessage);
      
      // 添加错误消息到聊天记录
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isConfigValid) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">配置错误</h3>
          <p className="text-gray-600 mb-6">
            Dify API 配置未正确设置。请检查环境变量配置。
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-500">由Dify AI驱动</p>
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

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </div>
                </div>
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="请描述您的运动项目和装备需求..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px] max-h-32"
                rows={2}
                disabled={isTyping || !isConfigValid}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 提示：可以询问游泳、骑行、跑步等装备推荐
              </p>
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping || !isConfigValid}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocalChat;