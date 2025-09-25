import React, { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { ProductGrid } from './ProductCard'
import { ProductService, AuthService, type Product } from '../services/database'

interface FeaturedProductsProps {
  selectedCategory?: string
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ selectedCategory }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [priceFilter, setPriceFilter] = useState<string>('all')

  // 获取当前用户
  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await AuthService.getCurrentUser()
      setCurrentUser(user)
    }
    getCurrentUser()
  }, [])

  // 获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let productData: Product[]
        
        if (currentUser) {
          // 如果用户已登录，获取个性化推荐
          productData = await ProductService.getRecommendedProducts(
            currentUser.id, 
            selectedCategory === 'all' ? undefined : selectedCategory
          )
          
          // 如果推荐产品不够，补充通用产品
          if (productData.length < 8) {
            const generalProducts = await ProductService.getProducts({
              category: selectedCategory === 'all' ? undefined : selectedCategory,
              limit: 12
            })
            
            // 合并并去重
            const existingIds = productData.map(p => p.id)
            const additionalProducts = generalProducts.filter(p => !existingIds.includes(p.id))
            productData = [...productData, ...additionalProducts].slice(0, 12)
          }
        } else {
          // 未登录用户显示热门产品
          productData = await ProductService.getProducts({
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            limit: 12
          })
        }
        
        setProducts(productData)
        setFilteredProducts(productData)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, currentUser])

  // 过滤产品
  useEffect(() => {
    let filtered = [...products]

    // 分类过滤
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => product.category === activeFilter)
    }

    // 价格过滤
    if (priceFilter !== 'all') {
      filtered = filtered.filter(product => product.price_range === priceFilter)
    }

    setFilteredProducts(filtered)
  }, [products, activeFilter, priceFilter])

  const handleFavoriteChange = (productId: string, isFavorited: boolean) => {
    // 可以在这里添加UI反馈或刷新逻辑
    console.log(`Product ${productId} ${isFavorited ? 'added to' : 'removed from'} favorites`)
  }

  const categories = [
    { id: 'all', name: '全部', icon: '🏆' },
    { id: 'swimming', name: '游泳装备', icon: '🏊‍♂️' },
    { id: 'cycling', name: '自行车装备', icon: '🚴‍♂️' },
    { id: 'running', name: '跑步装备', icon: '🏃‍♂️' },
    { id: 'nutrition', name: '营养补给', icon: '🥤' }
  ]

  const priceRanges = [
    { id: 'all', name: '全部价位' },
    { id: 'budget', name: '经济型' },
    { id: 'mid-range', name: '中档' },
    { id: 'premium', name: '高端' }
  ]

  return (
    <section id="featured-products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {currentUser ? '为您推荐' : '精选好物'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentUser 
              ? '基于您的偏好和运动水平，为您精心挑选的专业装备' 
              : '专业团队精选的优质铁三装备，助力您的运动表现'
            }
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Price Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {priceRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={filteredProducts}
          userId={currentUser?.id}
          loading={loading}
          emptyMessage={
            selectedCategory && selectedCategory !== 'all'
              ? `暂无${categories.find(c => c.id === selectedCategory)?.name}产品`
              : '暂无产品'
          }
          onFavoriteChange={handleFavoriteChange}
        />

        {/* Load More Button */}
        {!loading && filteredProducts.length > 0 && filteredProducts.length >= 12 && (
          <div className="text-center mt-12">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-xl border-2 border-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200">
              查看更多产品
            </button>
          </div>
        )}

        {/* User Recommendation Notice */}
        {currentUser && (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-800">
              <span className="text-lg">💡</span>
              <p className="text-sm">
                <strong>个性化推荐：</strong>
                基于您的运动水平({currentUser.sport_level})和偏好为您推荐。
                <button className="ml-2 underline hover:no-underline">
                  更新偏好设置
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts