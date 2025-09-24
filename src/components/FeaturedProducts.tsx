import React from 'react';
import { Star, Heart } from 'lucide-react';

interface FeaturedProductsProps {
  selectedCategory?: string;
}
const products = [
  {
    id: 1,
    name: 'Orca Predator 竞赛级防寒衣',
    price: '¥3,299',
    originalPrice: '¥3,899',
    rating: 4.8,
    reviews: 156,
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '游泳装备',
    badge: '热销',
    brand: 'Orca', 
    description: '专业铁三防寒衣，提供卓越的浮力和灵活性，适合开放水域游泳。',
    buyUrl: 'https://www.orca.com/en-int/m/about-orca'
  },
  {
    id: 2,
    name: 'Specialized Tarmac SL8 Expert 公路车',
    price: '¥16,999',
    originalPrice: '¥18,999',
    rating: 4.9,
    reviews: 89,
    image: 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '自行车装备',
    badge: '专业推荐',
    brand: 'Specialized',
    description: '全新SL8公路车，超轻碳纤维车架，卓越的爬坡和冲刺性能。',
    buyUrl: 'https://www.orca.com/en-int/m/about-orca'
  },
  {
    id: 3,
    name: 'Nike Vaporfly Next% 2 竞速跑鞋',
    price: '¥1,799',
    originalPrice: '¥2,199',
    rating: 4.7,
    reviews: 312,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '跑步装备',
    badge: '新品',
    brand: 'Nike',
    description: '碳纤维板跑鞋，提供卓越的能量回弹和推进力。',
    buyUrl: 'https://www.asics.com.cn/'
  },
  {
    id: 4,
    name: 'Maurten Gel 100 能量胶套装',
    price: '¥299',
    originalPrice: '¥359',
    rating: 4.6,
    reviews: 234,
    image: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '营养补给',
    badge: '推荐',
    brand: 'Maurten',
    description: '专业运动营养补给，快速补充能量，易消化吸收。',
    buyUrl: 'https://www.speedo.com.cn/'
  }
];

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ selectedCategory }) => {
  // 根据选中的分类筛选商品
  const filteredProducts = selectedCategory && selectedCategory !== '装备评测' 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <section id="featured-products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory && selectedCategory !== '装备评测' 
              ? `${selectedCategory} · 精选好物` 
              : '精选好物 · 真实可购'
            }
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {selectedCategory && selectedCategory !== '装备评测'
              ? `专业${selectedCategory}推荐，知名品牌，真实价格`
              : '精选知名品牌，真实价格，一键直达购买'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden block cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.badge}
                  </span>
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-100">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
              </a>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <span className="text-xs font-medium text-black bg-gray-100 px-2 py-1 rounded-full">{product.brand}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div>
                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 text-sm block"
                  >
                    <span>立即购买</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          {selectedCategory && selectedCategory !== '装备评测' && (
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl text-sm transition-all duration-300 mr-4"
            >
              查看所有商品
            </button>
          )}
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105">
            {selectedCategory && selectedCategory !== '装备评测' 
              ? `查看更多${selectedCategory}` 
              : '查看更多真实好物'
            }
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;