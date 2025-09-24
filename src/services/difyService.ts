import { DIFY_CONFIG, validateDifyConfig } from '../config/dify';
import { logger } from '../utils/logger';

interface DifyConfig {
  apiKey: string;
  baseUrl: string;
  conversationId?: string;
}

interface DifyMessage {
  query: string;
  inputs?: Record<string, any>;
  response_mode: 'streaming' | 'blocking';
  conversation_id?: string;
  user: string;
  files?: Array<{
    type: 'image';
    transfer_method: 'remote_url' | 'local_file';
    url?: string;
    upload_file_id?: string;
  }>;
  auto_generate_name?: boolean;
}

interface DifyResponse {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  metadata?: {
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      prompt_unit_price: string;
      completion_unit_price: string;
      total_price: string;
      currency: string;
      latency: number;
    };
    retriever_resources?: Array<{
      position: number;
      dataset_id: string;
      dataset_name: string;
      document_id: string;
      document_name: string;
      segment_id: string;
      score: number;
      content: string;
    }>;
  };
  created_at: number;
}

interface DifyStreamChunk {
  event: 'message' | 'agent_message' | 'agent_thought' | 'message_file' | 'message_end' | 'tts_message' | 'tts_message_end' | 'message_replace' | 'error' | 'ping';
  task_id?: string;
  message_id?: string;
  conversation_id?: string;
  answer?: string;
  created_at?: number;
  // Agent相关字段
  id?: string;
  position?: number;
  thought?: string;
  observation?: string;
  tool?: string;
  tool_input?: string;
  message_files?: string[];
  // 文件相关字段
  type?: string;
  belongs_to?: string;
  url?: string;
  // 错误相关字段
  status?: number;
  code?: string;
  message?: string;
  // 元数据
  metadata?: DifyResponse['metadata'];
}

class DifyService {
  private config: DifyConfig;

  constructor(config: DifyConfig) {
    this.config = config;
    logger.info('DIFY_SERVICE', 'DifyService initialized', {
      baseUrl: config.baseUrl,
      hasApiKey: !!config.apiKey && config.apiKey !== 'your-dify-api-key'
    });
  }

  async sendMessage(message: string, conversationId?: string): Promise<DifyResponse> {
    const requestId = Date.now().toString();
    logger.info('DIFY_API', `开始发送消息 [${requestId}]`, {
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      conversationId,
      mode: 'blocking'
    });

    const payload: DifyMessage = {
      query: message,
      response_mode: 'blocking',
      user: 'triathlon-user',
      inputs: {
        user_level: 'beginner',
        budget_range: 'medium',
        sport_focus: 'triathlon'
      },
      auto_generate_name: true
    };

    if (conversationId) {
      payload.conversation_id = conversationId;
    }

    try {
      logger.debug('DIFY_API', `发送请求 [${requestId}]`, {
        url: `${this.config.baseUrl}/chat-messages`,
        payload
      });

      // 添加更详细的请求头和错误处理
      const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        const error = new Error(`Dify API error: ${response.status} ${response.statusText} - ${errorText}`);
        logger.error('DIFY_API', `请求失败 [${requestId}]`, {
          status: response.status,
          statusText: response.statusText,
          errorText
        }, error);
        throw new Error(`Dify API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      logger.info('DIFY_API', `消息发送成功 [${requestId}]`, {
        messageId: data.message_id,
        conversationId: data.conversation_id,
        answerLength: data.answer?.length || 0
      });

      return data;
    } catch (error) {
      logger.error('DIFY_API', `消息发送异常 [${requestId}]`, {
        message: message.substring(0, 100),
        conversationId
      }, error as Error);

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`网络连接失败 - 请检查配置和网络连接\n当前API地址: ${this.config.baseUrl}`);
      }
      throw error;
    }
  }

  private async testBasicConnectivity(): Promise<{ success: boolean; error?: string }> {
    logger.info('DIFY_API', '测试基本网络连通性');
    
    try {
      // 首先测试基本的网络连通性，使用更宽松的方式
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(this.config.baseUrl, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      logger.info('DIFY_API', '基本连通性测试结果', {
        status: response.status,
        ok: response.ok
      });

      return { success: true };
    } catch (error) {
      logger.error('DIFY_API', '基本连通性测试异常', {}, error as Error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: `连接超时\n\n服务器地址: ${this.config.baseUrl}\n可能原因：\n1. 服务器响应缓慢\n2. 网络连接不稳定\n3. 服务器未运行`
          };
        }
        
        if (error.message === 'Failed to fetch') {
          return {
            success: false,
            error: `网络连接失败\n\n服务器地址: ${this.config.baseUrl}\n\n可能原因：\n1. 服务器未运行或不可访问\n2. CORS配置问题\n3. 网络连接问题\n4. 防火墙阻止连接\n\n建议：\n• 检查服务器是否正在运行\n• 联系服务器管理员配置CORS\n• 尝试在浏览器中直接访问该地址`
          };
        }
      }
      
      return {
        success: false,
        error: `连接测试失败: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    logger.info('DIFY_API', '开始测试连接', {
      baseUrl: this.config.baseUrl,
      hasApiKey: !!this.config.apiKey
    });

    try {
      // 首先测试基本的网络连通性
      const basicTest = await this.testBasicConnectivity();
      if (!basicTest.success) {
        return basicTest;
      }
      
      // 然后测试具体的API端点
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
      
      const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'connection test',
          response_mode: 'blocking',
          user: 'test-user'
        }),
      });
      
      clearTimeout(timeoutId);
      
      if (response.status === 401) {
        logger.error('DIFY_API', '连接测试失败 - API密钥无效', {
          status: response.status
        });
        return { success: false, error: 'API密钥无效' };
      } else if (response.ok || response.status === 400) {
        // 200 OK 或 400 Bad Request 都表示连接成功
        logger.info('DIFY_API', '连接测试成功');
        return { success: true };
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        logger.error('DIFY_API', '连接测试失败', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        return { success: false, error: `连接失败: ${response.status} - ${errorText}` };
      }
    } catch (error) {
      logger.error('DIFY_API', '连接测试异常', {}, error as Error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { 
            success: false, 
            error: '连接超时。请检查：\n1. 网络连接是否正常\n2. 服务器是否运行: ' + this.config.baseUrl + '\n3. 防火墙是否阻止连接' 
          };
        }
        
        if (error.message === 'Failed to fetch') {
          return { 
            success: false, 
            error: '网络连接失败。请检查：\n1. 网络连接是否正常\n2. API地址是否正确: ' + this.config.baseUrl + '\n3. 服务器是否支持CORS\n4. 防火墙是否阻止连接\n\n建议联系服务器管理员检查服务状态' 
          };
        }
      }
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '未知连接错误' 
      };
    }
  }

  async sendStreamingMessage(
    message: string, 
    onChunk: (chunk: string) => void,
    conversationId?: string
  ): Promise<{ fullResponse: string; conversationId: string }> {
    const requestId = Date.now().toString();
    logger.info('DIFY_API', `开始流式消息 [${requestId}]`, {
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      conversationId,
      mode: 'streaming'
    });

    const payload: DifyMessage = {
      query: message,
      response_mode: 'streaming',
      user: 'triathlon-user',
      inputs: {
        user_level: 'beginner',
        budget_range: 'medium',
        sport_focus: 'triathlon'
      },
      auto_generate_name: true
    };

    if (conversationId) {
      payload.conversation_id = conversationId;
    }

    try {
      logger.debug('DIFY_API', `发送流式请求 [${requestId}]`, {
        url: `${this.config.baseUrl}/chat-messages`,
        payload
      });

      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

      const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(payload),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        const error = new Error(`Dify API error: ${response.status} ${response.statusText} - ${errorText}`);
        logger.error('DIFY_API', `流式请求失败 [${requestId}]`, {
          status: response.status,
          statusText: response.statusText,
          errorText
        }, error);
        throw error;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const error = new Error('无法读取响应流');
        logger.error('DIFY_API', `无法获取响应流 [${requestId}]`, {}, error);
        throw error;
      }

      logger.debug('DIFY_API', `开始读取流式响应 [${requestId}]`);

      let fullResponse = '';
      let finalConversationId = '';
      const decoder = new TextDecoder();
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunkCount++;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: DifyStreamChunk = JSON.parse(line.slice(6));
              
              logger.debug('DIFY_API', `收到流式数据 [${requestId}]`, {
                event: data.event,
                chunkCount,
                answerLength: data.answer?.length || 0
              });
              
              // 处理不同类型的事件
              switch (data.event) {
                case 'message':
                case 'agent_message':
                  if (data.answer) {
                    fullResponse += data.answer;
                    onChunk(data.answer);
                  }
                  if (data.conversation_id) {
                    finalConversationId = data.conversation_id;
                  }
                  break;
                
                case 'message_end':
                  if (data.conversation_id) {
                    finalConversationId = data.conversation_id;
                  }
                  break;
                
                case 'error':
                  logger.error('DIFY_API', `流式响应错误 [${requestId}]`, {
                    code: data.code,
                    message: data.message
                  });
                  throw new Error(`Dify API错误: ${data.code} - ${data.message}`);
                
                case 'ping':
                  // 保持连接的ping事件，无需处理
                  break;
                
                default:
                  // 其他事件类型（agent_thought, message_file等）暂时忽略
                  break;
              }
            } catch (e) {
              // 忽略JSON解析错误，可能是不完整的数据块
              logger.warn('DIFY_API', `解析流数据失败 [${requestId}]`, {
                line: line.substring(0, 200),
                error: e instanceof Error ? e.message : String(e)
              });
            }
          }
        }
      }

      logger.info('DIFY_API', `流式消息完成 [${requestId}]`, {
        totalChunks: chunkCount,
        responseLength: fullResponse.length,
        conversationId: finalConversationId
      });

      return { fullResponse, conversationId: finalConversationId };
    } catch (error) {
      logger.error('DIFY_API', `流式消息异常 [${requestId}]`, {
        message: message.substring(0, 100),
        conversationId
      }, error as Error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`连接超时 - 服务器响应时间过长\n\n可能原因：\n• 网络连接不稳定\n• 服务器负载过高\n• API地址不正确: ${this.config.baseUrl}\n\n建议：\n• 检查网络连接\n• 运行CORS诊断\n• 稍后重试`);
        }
        
        if (error.message === 'Failed to fetch') {
          throw new Error(`NETWORK_ERROR:网络连接失败 - 无法访问 ${this.config.baseUrl}\n\n可能原因：\n• 服务器未运行或不可访问\n• 网络连接问题\n• CORS策略阻止请求\n• 防火墙或代理设置\n\n解决方案：\n• 点击🛡️按钮运行CORS诊断\n• 检查API地址是否正确\n• 联系服务器管理员\n• 确认服务器支持跨域请求`);
        }
      }
      
      throw error;
    }
  }

  private async testWithMessage(): Promise<{ success: boolean; error?: string }> {
    logger.debug('DIFY_API', '使用消息接口测试连接');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'test',
          response_mode: 'blocking',
          user: 'test-connection-user'
        }),
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 400) {
        logger.info('DIFY_API', '消息接口测试成功', {
          status: response.status
        });
        return { success: true };
      } else if (response.status === 401) {
        logger.error('DIFY_API', '消息接口测试失败 - API密钥无效');
        return { success: false, error: 'API密钥无效' };
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        logger.error('DIFY_API', '消息接口测试失败', {
          status: response.status,
          errorText
        });
        return { success: false, error: `连接测试失败: ${response.status} - ${errorText}` };
      }
    } catch (error) {
      logger.error('DIFY_API', '消息接口测试异常', {}, error as Error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: '连接超时' };
        }
        if (error.message === 'Failed to fetch') {
          return { 
            success: false, 
            error: '网络连接失败 - 请检查服务器状态和网络连接' 
          };
        }
      }
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '测试连接失败' 
      };
    }
  }

  async uploadFile(file: File, user: string): Promise<{ id: string; name: string; url?: string }> {
    logger.info('DIFY_API', '开始上传文件', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      user
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', user);

    try {
      const response = await fetch(`${this.config.baseUrl}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        const error = new Error(`文件上传失败: ${response.status} - ${errorText}`);
        logger.error('DIFY_API', '文件上传失败', {
          fileName: file.name,
          status: response.status,
          errorText
        }, error);
        throw new Error(`文件上传失败: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      logger.info('DIFY_API', '文件上传成功', {
        fileId: data.id,
        fileName: data.name,
        fileSize: data.size
      });

      return {
        id: data.id,
        name: data.name,
        url: data.url
      };
    } catch (error) {
      logger.error('DIFY_API', '文件上传异常', {
        fileName: file.name,
        user
      }, error as Error);
      throw error;
    }
  }

  async getConversations(user: string, limit: number = 20): Promise<{
    data: Array<{
      id: string;
      name: string;
      status: string;
      created_at: number;
      updated_at: number;
    }>;
    has_more: boolean;
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/conversations?user=${encodeURIComponent(user)}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`获取会话列表失败: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取会话列表错误:', error);
      throw error;
    }
  }

  async deleteConversation(conversationId: string, user: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        throw new Error(`删除会话失败: ${response.status}`);
      }
    } catch (error) {
      console.error('删除会话错误:', error);
      throw error;
    }
  }
}

// 创建默认的Dify服务实例
export const createDifyService = (apiKey: string, baseUrl: string) => {
  return new DifyService({ apiKey, baseUrl });
};

export default DifyService;