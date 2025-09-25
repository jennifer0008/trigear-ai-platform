import React, { useState, useEffect } from 'react'
import { Heart, Star, ExternalLink, ShoppingCart } from 'lucide-react'
import { FavoriteService, type Product } from '../services/database'

interface ProductCardProps {
  product: Product
  userId?: string
  showFavorite?: boolean
  onFavoriteChange?: (productId: string, isFavorited: boolean) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  userId, 
  showFavorite = true,
  onFavoriteChange 
}) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (userId) {
        const favorited = await FavoriteService.isFavorited(userId, product.id)
        setIsFavorited(favorited)
      }
    }

    checkFavoriteStatus()
  }, [userId, product.id])

  const handleFavoriteToggle = async () => {
    if (!userId) return

    setFavoriteLoading(true)
    
    let success = false
    if (isFavorited) {
      success = await FavoriteService.removeFavorite(userId, product.id)
    } else {
      success = await FavoriteService.addFavorite(userId, product.id)
    }

    if (success) {
      setIsFavorited(!isFavorited)
      onFavoriteChange?.(product.id, !isFavorited)
    }

    setFavoriteLoading(false)
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      swimming: '🏊‍♂️',
      cycling: '🚴‍♂️', 
      running: '🏃‍♂️',
      nutrition: '🥤'
    }
    return icons[category as keyof typeof icons] || '🏆'
  }

  const getPriceRangeText = (priceRange: string) => {
    const ranges = {
      budget: 'Budget-friendly',
      'mid-range': 'Mid-range',
      premium: 'Premium'
    }
    return ranges[priceRange as keyof typeof ranges] || priceRange
  }

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return null
    if (min && max && min !== max) return `$${min} - $${max}`
    return `$${min || max}`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Product Image */}
      <div className="relative aspect-w-16 aspect-h-12 bg-gray-100">
        {product.image_urls && product.image_urls[0] ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl">{getCategoryIcon(product.category)}</span>
          </div>
        )}
        
        {/* Favorite Button */}
        {showFavorite && userId && (
          <button
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
            } ${favoriteLoading ? 'opacity-50' : ''}`}
          >
            <Heart 
              size={18} 
              fill={isFavorited ? 'currentColor' : 'none'}
              className={favoriteLoading ? 'animate-pulse' : ''}
            />
          </button>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
          {product.category}
        </div>

        {/* Price Range Badge */}
        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
          product.price_range === 'budget' 
            ? 'bg-green-100 text-green-800' 
            : product.price_range === 'mid-range'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {getPriceRangeText(product.price_range)}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{product.brand}</span>
          <div className="flex items-center space-x-1">
            <Star size={14} fill="currentColor" className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {product.features.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{product.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Target Level */}
        {product.target_level && product.target_level.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs text-gray-500">Suitable for:</span>
            {product.target_level.map((level, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full capitalize"
              >
                {level}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {formatPrice(product.price_min, product.price_max) && (
          <div className="text-lg font-bold text-gray-900 mb-3">
            {formatPrice(product.price_min, product.price_max)}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {product.affiliate_url && (
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <ShoppingCart size={16} />
              <span>Buy Now</span>
              <ExternalLink size={14} />
            </a>
          )}
          
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

// Product Grid Component
interface ProductGridProps {
  products: Product[]
  userId?: string
  loading?: boolean
  emptyMessage?: string
  onFavoriteChange?: (productId: string, isFavorited: boolean) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  userId, 
  loading = false,
  emptyMessage = "No products found",
  onFavoriteChange
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex space-x-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                  <div className="w-20 h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Try adjusting your search criteria or browse different categories.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          userId={userId}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  )
}