import { useState, useCallback, useRef } from 'react';
import { createDifyService } from '../services/difyService';
import { DIFY_CONFIG, validateDifyConfig } from '../config/dify';
import { logger } from '../utils/logger';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ConfigStatus {
  isConfigured: boolean;
  hasApiKey: boolean;
  connectionStatus: 'unknown' | 'testing' | 'connected' | 'failed';
  error?: string;
}
interface UseDifyChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  configStatus: ConfigStatus;
  testConnection: () => Promise<void>;
}

export const useDifyChat = (): UseDifyChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({
    isConfigured: validateDifyConfig(),
    hasApiKey: !!DIFY_CONFIG.API_KEY && DIFY_CONFIG.API_KEY !== 'your-dify-api-key',
    connectionStatus: 'unknown'
  });
  
  const conversationIdRef = useRef<string | null>(null);
  const messageIdRef = useRef(1);
  
  const difyService = createDifyService(DIFY_CONFIG.API_KEY, DIFY_CONFIG.BASE_URL);

  const testConnection = useCallback(async () => {
    logger.info('CHAT_HOOK', '开始测试Dify连接');

    if (!configStatus.hasApiKey) {
      logger.warn('CHAT_HOOK', 'API密钥未配置，跳过连接测试');
      setConfigStatus(prev => ({
        ...prev,
        connectionStatus: 'failed',
        error: 'API密钥未配置或无效\n请检查.env文件中的VITE_DIFY_API_KEY配置\n\n当前API地址: ' + DIFY_CONFIG.BASE_URL
      }));
      return;
    }

    setConfigStatus(prev => ({ ...prev, connectionStatus: 'testing' }));
    
    try {
      const result = await difyService.testConnection();
      
      if (result.success) {
        logger.info('CHAT_HOOK', 'Dify连接测试成功');
        setConfigStatus(prev => ({
          ...prev,
          connectionStatus: 'connected',
          error: undefined
        }));
      } else {
        logger.error('CHAT_HOOK', 'Dify连接测试失败', { error: result.error });
        setConfigStatus(prev => ({
          ...prev,
          connectionStatus: 'failed',
          error: result.error + '\n\n🔧 故障排除：\n1. 检查网络连接\n2. 确认API地址: ' + DIFY_CONFIG.BASE_URL + '\n3. 验证API密钥是否正确\n4. 确认服务器是否运行'
        }));
      }
    } catch (err) {
      logger.error('CHAT_HOOK', 'Dify连接测试异常', {}, err as Error);
      setConfigStatus(prev => ({
        ...prev,
        connectionStatus: 'failed',
        error: '连接测试异常: ' + (err instanceof Error ? err.message : String(err)) + '\n\n当前配置:\nAPI地址: ' + DIFY_CONFIG.BASE_URL
      }));
    }
  }, [difyService, configStatus.hasApiKey]);
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    logger.info('CHAT_HOOK', '用户发送消息', {
      messageLength: content.length,
      hasApiKey: configStatus.hasApiKey,
      connectionStatus: configStatus.connectionStatus
    });

    // 检查配置状态
    if (!configStatus.hasApiKey || !configStatus.isConfigured) {
      logger.error('CHAT_HOOK', 'Dify未配置，无法发送消息');
      setError('Dify API未配置，请先配置API密钥\n\n配置步骤：\n1. 创建.env文件\n2. 设置VITE_DIFY_API_KEY=你的API密钥\n3. 设置VITE_DIFY_BASE_URL=https://api.dify.ai/v1\n4. 重启开发服务器');
      return;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: messageIdRef.current++,
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // 使用真实的Dify API
      let aiResponse = '';
      logger.debug('CHAT_HOOK', '开始调用Dify API');
      
      const result = await difyService.sendStreamingMessage(
        content,
        (chunk: string) => {
          aiResponse += chunk;
          // 实时更新AI消息
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.type === 'ai') {
              lastMessage.content = aiResponse;
            } else {
              newMessages.push({
                id: messageIdRef.current++,
                type: 'ai',
                content: aiResponse,
                timestamp: new Date()
              });
            }
            return newMessages;
          });
        },
        conversationIdRef.current || undefined
      );
      
      // 更新会话ID
      if (result.conversationId) {
        conversationIdRef.current = result.conversationId;
      }
      
      // 更新连接状态为成功
      setConfigStatus(prev => ({
        ...prev,
        connectionStatus: 'connected',
        error: undefined
      }));

    } catch (err) {
      logger.error('CHAT_HOOK', 'Dify API调用失败', { content: content.substring(0, 100) }, err as Error);
      
      // 设置错误状态
      setConfigStatus(prev => ({
        ...prev,
        connectionStatus: 'failed',
        error: err instanceof Error ? err.message : '连接失败',
      }));

      // 显示具体错误信息
      if (err instanceof Error) {
        if (err.message.startsWith('NETWORK_ERROR:')) {
          const errorMessage = err.message.replace('NETWORK_ERROR:', '');
          setError(errorMessage);
        } else {
          setError(`API调用失败: ${err.message}\n\n请检查：\n• 网络连接是否正常\n• API密钥是否正确\n• 服务器地址是否可访问\n• 运行CORS诊断`);
        }
      } else {
        setError(`发送消息失败: 未知错误\n\n请尝试：\n• 刷新页面重试\n• 检查网络连接\n• 运行CORS诊断`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [configStatus.isConfigured, configStatus.hasApiKey, difyService]);


  const clearMessages = useCallback(() => {
    logger.info('CHAT_HOOK', '清空对话历史');
    setMessages([]);
    messageIdRef.current = 1;
    conversationIdRef.current = null;
    setError(null);
    setConfigStatus(prev => ({
      ...prev,
      connectionStatus: 'unknown',
      error: undefined
    }));
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    configStatus,
    testConnection
  };
};