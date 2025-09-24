// Dify配置文件
export const DIFY_CONFIG = {
  // 请替换为你的Dify API配置
  API_KEY: import.meta.env.VITE_DIFY_API_KEY || 'your-dify-api-key',
  BASE_URL: import.meta.env.VITE_DIFY_BASE_URL || 'https://teach.excelmaster.ai/v1',
  
  // 默认配置
  DEFAULT_USER: 'triathlon-user',
  RESPONSE_MODE: 'streaming' as const,
  
  // 用户上下文配置
  USER_CONTEXTS: {
    BEGINNER: {
      user_level: 'beginner',
      budget_range: 'low',
      experience_years: '0-1'
    },
    INTERMEDIATE: {
      user_level: 'intermediate', 
      budget_range: 'medium',
      experience_years: '1-3'
    },
    ADVANCED: {
      user_level: 'advanced',
      budget_range: 'high', 
      experience_years: '3+'
    }
  }
};

// 环境变量验证
export const validateDifyConfig = () => {
  if (!DIFY_CONFIG.API_KEY || DIFY_CONFIG.API_KEY === 'your-dify-api-key') {
    console.warn('⚠️ Dify API Key未配置，请按以下步骤配置：\n1. 复制.env.example为.env\n2. 在.env中设置VITE_DIFY_API_KEY=你的API密钥\n3. 在.env中设置VITE_DIFY_BASE_URL=https://api.dify.ai/v1\n4. 重启开发服务器 (npm run dev)');
    return false;
  }
  
  if (!DIFY_CONFIG.BASE_URL || !DIFY_CONFIG.BASE_URL.startsWith('http')) {
    console.warn('⚠️ Dify Base URL配置无效，请检查VITE_DIFY_BASE_URL配置。当前值:', DIFY_CONFIG.BASE_URL);
    return false;
  }
  
  console.log('✅ Dify配置验证通过:', {
    baseUrl: DIFY_CONFIG.BASE_URL,
    hasApiKey: !!DIFY_CONFIG.API_KEY && DIFY_CONFIG.API_KEY !== 'your-dify-api-key'
  });
  
  return true;
};