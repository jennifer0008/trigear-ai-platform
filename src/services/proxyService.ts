// 代理服务 - 用于绕过CORS限制
import { logger } from '../utils/logger';

interface ProxyResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class ProxyService {
  private corsProxyUrls = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://cors.sh/'
  ];

  async makeRequest(url: string, options: RequestInit): Promise<Response> {
    logger.info('PROXY_SERVICE', '尝试直接请求');
    
    // 首先尝试直接请求
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors'
      });
      
      if (response.ok || response.status < 500) {
        logger.info('PROXY_SERVICE', '直接请求成功');
        return response;
      }
    } catch (error) {
      logger.warn('PROXY_SERVICE', '直接请求失败，尝试代理', {}, error as Error);
    }

    // 尝试使用CORS代理
    for (const proxyUrl of this.corsProxyUrls) {
      try {
        logger.info('PROXY_SERVICE', `尝试代理: ${proxyUrl}`);
        
        const proxiedUrl = proxyUrl + encodeURIComponent(url);
        const response = await fetch(proxiedUrl, {
          ...options,
          mode: 'cors',
          headers: {
            ...options.headers,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.ok) {
          logger.info('PROXY_SERVICE', `代理请求成功: ${proxyUrl}`);
          return response;
        }
      } catch (error) {
        logger.warn('PROXY_SERVICE', `代理失败: ${proxyUrl}`, {}, error as Error);
        continue;
      }
    }

    throw new Error('所有代理方法都失败了');
  }

  async postJSON(url: string, data: any, headers: Record<string, string> = {}): Promise<any> {
    const response = await this.makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  async streamRequest(
    url: string, 
    data: any, 
    headers: Record<string, string> = {},
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const response = await this.makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...headers
      },
      body: JSON.stringify(data)
    });

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    let fullResponse = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.answer) {
              fullResponse += data.answer;
              onChunk(data.answer);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    return fullResponse;
  }
}

export const proxyService = new ProxyService();