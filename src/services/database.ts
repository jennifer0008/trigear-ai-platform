import { supabase } from '../lib/supabase'

// 数据库类型定义
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  sport_level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  primary_sport: 'swimming' | 'cycling' | 'running' | 'triathlon'
  budget_range: 'budget' | 'mid-range' | 'premium' | 'unlimited'
  preferred_brands?: string[]
  training_frequency: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  category: 'swimming' | 'cycling' | 'running' | 'nutrition'
  subcategory?: string
  brand: string
  model?: string
  price_range: 'budget' | 'mid-range' | 'premium'
  price_min?: number
  price_max?: number
  features?: string[]
  target_level?: string[]
  affiliate_url?: string
  image_urls?: string[]
  rating: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  product_id: string
  notes?: string
  priority: number
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id?: string
  session_id: string
  message_type: 'user' | 'assistant'
  content: string
  ai_model?: string
  tokens_used?: number
  response_time_ms?: number
  recommended_products?: string[]
  created_at: string
}

// =============================================
// 用户相关服务
// =============================================
export class UserService {
  // 获取用户配置
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  // 创建或更新用户配置
  static async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Error upserting user profile:', error)
      return null
    }

    return data
  }

  // 更新用户偏好
  static async updateUserPreferences(userId: string, preferences: {
    sport_level?: string
    primary_sport?: string
    budget_range?: string
    preferred_brands?: string[]
    training_frequency?: number
  }): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .update(preferences)
      .eq('id', userId)

    if (error) {
      console.error('Error updating user preferences:', error)
      return false
    }

    return true
  }
}

// =============================================
// 产品相关服务
// =============================================
export class ProductService {
  // 获取所有产品
  static async getProducts(options?: {
    category?: string
    priceRange?: string
    limit?: number
    offset?: number
  }): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (options?.category) {
      query = query.eq('category', options.category)
    }

    if (options?.priceRange) {
      query = query.eq('price_range', options.priceRange)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    query = query.order('rating', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  }

  // 根据用户偏好获取推荐产品
  static async getRecommendedProducts(userId: string, category?: string): Promise<Product[]> {
    const { data, error } = await supabase
      .rpc('get_recommended_products', {
        user_profile_id: userId,
        category_filter: category,
        limit_count: 10
      })

    if (error) {
      console.error('Error fetching recommended products:', error)
      return []
    }

    return data || []
  }

  // 搜索产品
  static async searchProducts(searchTerm: string, category?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return data || []
  }

  // 获取单个产品详情
  static async getProduct(productId: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  }
}

// =============================================
// 收藏相关服务
// =============================================
export class FavoriteService {
  // 获取用户收藏
  static async getUserFavorites(userId: string): Promise<(UserFavorite & { product: Product })[]> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user favorites:', error)
      return []
    }

    return data || []
  }

  // 添加收藏
  static async addFavorite(userId: string, productId: string, notes?: string, priority?: number): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        product_id: productId,
        notes,
        priority: priority || 1
      })

    if (error) {
      console.error('Error adding favorite:', error)
      return false
    }

    return true
  }

  // 移除收藏
  static async removeFavorite(userId: string, productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      console.error('Error removing favorite:', error)
      return false
    }

    return true
  }

  // 检查是否已收藏
  static async isFavorited(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking favorite status:', error)
      return false
    }

    return !!data
  }
}

// =============================================
// 聊天历史服务
// =============================================
export class ChatService {
  // 保存聊天消息
  static async saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await supabase
      .from('chat_history')
      .insert(message)

    if (error) {
      console.error('Error saving chat message:', error)
      return false
    }

    return true
  }

  // 获取聊天历史
  static async getChatHistory(userId: string, sessionId?: string, limit = 50): Promise<ChatMessage[]> {
    let query = supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching chat history:', error)
      return []
    }

    return data || []
  }

  // 获取用户的聊天会话列表
  static async getChatSessions(userId: string): Promise<{ session_id: string; latest_message: string; created_at: string }[]> {
    const { data, error } = await supabase
      .from('chat_history')
      .select('session_id, content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching chat sessions:', error)
      return []
    }

    // 按session_id分组，获取每个会话的最新消息
    const sessions = new Map<string, { latest_message: string; created_at: string }>()
    
    data?.forEach(msg => {
      if (!sessions.has(msg.session_id)) {
        sessions.set(msg.session_id, {
          latest_message: msg.content.slice(0, 100) + (msg.content.length > 100 ? '...' : ''),
          created_at: msg.created_at
        })
      }
    })

    return Array.from(sessions.entries()).map(([session_id, info]) => ({
      session_id,
      ...info
    }))
  }

  // 删除聊天会话
  static async deleteChatSession(userId: string, sessionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', userId)
      .eq('session_id', sessionId)

    if (error) {
      console.error('Error deleting chat session:', error)
      return false
    }

    return true
  }
}

// =============================================
// 认证相关服务
// =============================================
export class AuthService {
  // 获取当前用户
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // 监听认证状态变化
  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })
  }

  // 登出
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      return false
    }
    return true
  }
}

// 导出所有服务
export {
  UserService,
  ProductService,
  FavoriteService,
  ChatService,
  AuthService
}