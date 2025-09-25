-- =============================================
-- TriGear AI Platform Database Schema
-- =============================================

-- 启用Row Level Security (RLS)
-- Supabase推荐的安全最佳实践

-- =============================================
-- 用户配置表 (User Profiles)
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- 运动相关信息
  sport_level TEXT CHECK (sport_level IN ('beginner', 'intermediate', 'advanced', 'professional')) DEFAULT 'beginner',
  primary_sport TEXT CHECK (primary_sport IN ('swimming', 'cycling', 'running', 'triathlon')) DEFAULT 'triathlon',
  
  -- 预算偏好
  budget_range TEXT CHECK (budget_range IN ('budget', 'mid-range', 'premium', 'unlimited')) DEFAULT 'mid-range',
  
  -- 个人偏好
  preferred_brands TEXT[], -- 偏好品牌数组
  training_frequency INTEGER DEFAULT 3, -- 每周训练次数
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS政策：用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- 产品表 (Products)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('swimming', 'cycling', 'running', 'nutrition')),
  subcategory TEXT, -- 子分类如：wetsuit, bike, shoes等
  
  -- 产品信息
  brand TEXT NOT NULL,
  model TEXT,
  price_range TEXT CHECK (price_range IN ('budget', 'mid-range', 'premium')) NOT NULL,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  
  -- 产品详情
  features TEXT[], -- 特性数组
  target_level TEXT[] CHECK (target_level && ARRAY['beginner', 'intermediate', 'advanced', 'professional']), -- 适合级别
  
  -- 外部链接
  affiliate_url TEXT,
  image_urls TEXT[], -- 产品图片URLs
  
  -- 评分和状态
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 产品表不需要RLS，所有用户都可以查看产品
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price_range ON products(price_range);

-- =============================================
-- 用户收藏表 (User Favorites)
-- =============================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  
  -- 收藏信息
  notes TEXT, -- 用户笔记
  priority INTEGER DEFAULT 1, -- 优先级 1-5
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保用户不能重复收藏同一产品
  UNIQUE(user_id, product_id)
);

-- 启用RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS政策：用户只能访问自己的收藏
CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_product_id ON user_favorites(product_id);

-- =============================================
-- AI对话历史表 (Chat History)
-- =============================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- 对话内容
  session_id TEXT NOT NULL, -- 会话ID
  message_type TEXT CHECK (message_type IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  
  -- AI响应元数据
  ai_model TEXT, -- 使用的AI模型
  tokens_used INTEGER, -- 消耗的token数
  response_time_ms INTEGER, -- 响应时间(毫秒)
  
  -- 推荐产品关联
  recommended_products UUID[], -- 推荐的产品ID数组
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- RLS政策：用户只能访问自己的对话历史
CREATE POLICY "Users can view own chat history" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);

-- =============================================
-- 产品评价表 (Product Reviews)
-- =============================================
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  
  -- 评价内容
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  content TEXT,
  
  -- 评价维度（针对运动装备）
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  comfort_rating INTEGER CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
  durability_rating INTEGER CHECK (durability_rating >= 1 AND durability_rating <= 5),
  
  -- 使用情况
  usage_duration TEXT, -- 使用时长
  usage_frequency TEXT CHECK (usage_frequency IN ('daily', 'weekly', 'monthly', 'occasionally')),
  
  -- 推荐度
  would_recommend BOOLEAN,
  
  -- 状态
  is_verified BOOLEAN DEFAULT FALSE, -- 是否验证购买
  is_published BOOLEAN DEFAULT TRUE,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保用户只能对同一产品评价一次
  UNIQUE(user_id, product_id)
);

-- 启用RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS政策：用户可以查看已发布的评价，管理自己的评价
CREATE POLICY "Anyone can view published reviews" ON product_reviews
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Users can manage own reviews" ON product_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);

-- =============================================
-- 更新时间戳触发器
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间戳触发器
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at 
  BEFORE UPDATE ON product_reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 初始化示例数据
-- =============================================

-- 插入示例产品数据
INSERT INTO products (name, description, category, subcategory, brand, price_range, price_min, price_max, features, target_level, image_urls, rating) VALUES
-- 游泳装备
('Zone3 Aspire Wetsuit', '高性能铁三湿衣，提供卓越浮力和灵活性', 'swimming', 'wetsuit', 'Zone3', 'mid-range', 299.99, 399.99, ARRAY['柔性面板', '浮力优化', '快速脱卸'], ARRAY['beginner', 'intermediate'], ARRAY['https://example.com/wetsuit1.jpg'], 4.5),
('Speedo Fastskin Goggles', '专业竞技泳镜，低阻力设计', 'swimming', 'goggles', 'Speedo', 'budget', 29.99, 49.99, ARRAY['防雾', '防紫外线', '舒适贴合'], ARRAY['beginner', 'intermediate', 'advanced'], ARRAY['https://example.com/goggles1.jpg'], 4.3),

-- 自行车装备  
('Trek Domane AL 2', '入门级公路车，舒适骑行体验', 'cycling', 'bike', 'Trek', 'mid-range', 849.99, 849.99, ARRAY['铝合金车架', '碳纤维前叉', '16速变速'], ARRAY['beginner', 'intermediate'], ARRAY['https://example.com/bike1.jpg'], 4.4),
('Giro Synthe Helmet', '轻量化专业头盔，优秀通风性', 'cycling', 'helmet', 'Giro', 'premium', 199.99, 249.99, ARRAY['MIPS防护', '25个通风孔', '轻量设计'], ARRAY['intermediate', 'advanced'], ARRAY['https://example.com/helmet1.jpg'], 4.6),

-- 跑步装备
('Nike Vaporfly Next%', '顶级马拉松竞赛跑鞋', 'running', 'shoes', 'Nike', 'premium', 249.99, 249.99, ARRAY['碳纤维板', 'ZoomX泡沫', '轻量透气'], ARRAY['advanced', 'professional'], ARRAY['https://example.com/shoes1.jpg'], 4.8),
('Garmin Forerunner 945', '专业铁三GPS运动表', 'running', 'watch', 'Garmin', 'premium', 599.99, 599.99, ARRAY['GPS导航', '心率监测', '50小时续航'], ARRAY['intermediate', 'advanced', 'professional'], ARRAY['https://example.com/watch1.jpg'], 4.7),

-- 营养补给
('GU Energy Gel', '快速能量补给，多种口味', 'nutrition', 'energy-gel', 'GU', 'budget', 1.50, 2.50, ARRAY['快速吸收', '电解质补充', '多种口味'], ARRAY['beginner', 'intermediate', 'advanced'], ARRAY['https://example.com/gel1.jpg'], 4.2),
('Nuun Sport Tablets', '电解质补充片，低糖配方', 'nutrition', 'electrolyte', 'Nuun', 'budget', 6.99, 8.99, ARRAY['低糖配方', '快速溶解', '天然香料'], ARRAY['beginner', 'intermediate', 'advanced'], ARRAY['https://example.com/nuun1.jpg'], 4.1);

-- =============================================
-- 视图和函数
-- =============================================

-- 用户统计视图
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  up.id,
  up.full_name,
  COUNT(DISTINCT uf.id) as favorite_count,
  COUNT(DISTINCT pr.id) as review_count,
  COUNT(DISTINCT ch.session_id) as chat_sessions,
  up.created_at as join_date
FROM user_profiles up
LEFT JOIN user_favorites uf ON up.id = uf.user_id
LEFT JOIN product_reviews pr ON up.id = pr.user_id
LEFT JOIN chat_history ch ON up.id = ch.user_id
GROUP BY up.id, up.full_name, up.created_at;

-- 产品推荐函数（基于用户偏好）
CREATE OR REPLACE FUNCTION get_recommended_products(
  user_profile_id UUID,
  category_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  brand TEXT,
  category TEXT,
  price_range TEXT,
  rating DECIMAL,
  match_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.brand,
    p.category,
    p.price_range,
    p.rating,
    -- 简单匹配算法：根据级别、预算、品牌偏好计算分数
    (CASE 
      WHEN up.sport_level = ANY(p.target_level) THEN 40 
      ELSE 0 
    END +
    CASE 
      WHEN up.budget_range = p.price_range THEN 30 
      ELSE 0 
    END +
    CASE 
      WHEN p.brand = ANY(up.preferred_brands) THEN 20 
      ELSE 0 
    END +
    CASE 
      WHEN up.primary_sport = p.category OR up.primary_sport = 'triathlon' THEN 10 
      ELSE 0 
    END) as match_score
  FROM products p
  CROSS JOIN user_profiles up
  WHERE up.id = user_profile_id
    AND p.is_active = TRUE
    AND (category_filter IS NULL OR p.category = category_filter)
  ORDER BY match_score DESC, p.rating DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;