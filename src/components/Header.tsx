import React, { useState } from 'react';
import { Search, User, Bot, Menu, X, ChevronDown, MessageSquare, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onToggleAI: () => void;
  onToggleChatbot?: () => void;
  onCategoryClick?: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleAI, onToggleChatbot, onCategoryClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const { user, login, logout } = useAuth();

  const handleCategoryClick = (categoryName: string) => {
    // 滚动到精选好物区域
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 通知父组件进行筛选
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
    
    // 关闭移动端菜单
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 这里可以添加实际的搜索逻辑
      console.log('搜索:', searchQuery);
      // 可以跳转到搜索结果页面或显示搜索结果
      alert(`搜索: ${searchQuery}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  const navigationItems = [
    {
      name: '游泳装备',
      items: [
        { name: 'Speedo Fastskin 竞速泳衣', url: 'https://www.speedo.com.cn/fastskin-lzr-pure-intent-openback-kneeskin/12508.html' },
        { name: 'Arena Cobra Ultra 游泳镜', url: 'https://www.arenawaterinstinct.com/zh-cn/cobra-ultra-swipe' },
        { name: 'Orca Predator 防寒衣', url: 'https://www.orca.com/cn/predator/' }
      ]
    },
    {
      name: '自行车装备', 
      items: [
        { name: 'Trek Speed Concept 铁三车', url: 'https://www.trekbikes.com/cn/zh_CN/bikes/road-bikes/triathlon-bikes/speed-concept/' },
        { name: 'Specialized Shiv 公路车', url: 'https://www.specialized.com/cn/zh/shiv' },
        { name: 'Castelli Free Speed 骑行服', url: 'https://www.castelli-cycling.com/cn/men/triathlon' }
      ]
    },
    {
      name: '跑步装备',
      items: [
        { name: 'Nike Vaporfly Next% 跑鞋', url: 'https://www.nike.com/cn/t/air-zoom-alphafly-next-running-shoe' },
        { name: 'Asics Gel-Nimbus 跑鞋', url: 'https://www.asics.com.cn/gel-nimbus-25' },
        { name: 'Garmin Forerunner 955 手表', url: 'https://www.garmin.com.cn/products/wearables/forerunner-955/' }
      ]
    },
    {
      name: '营养补给',
      items: [
        { name: 'Maurten Gel 100 能量胶', url: 'https://www.maurten.com/products/gel-100' },
        { name: 'Gatorade 电解质饮料', url: 'https://www.gatorade.com.cn/' },
        { name: 'Optimum Nutrition 蛋白粉', url: 'https://www.optimumnutrition.com/en-us/Products/Protein/Whey/GOLD-STANDARD-100%25-WHEY' }
      ]
    },
    {
      name: '装备评测',
      items: [
        { name: '2024年度最佳铁三车评测', url: '#' },
        { name: '防寒衣品牌对比分析', url: '#' },
        { name: '跑鞋性能测试报告', url: '#' }
      ]
    }
  ];

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-black font-bold text-sm">T3</span>
              </div>
              <span className="text-xl font-bold text-white">TriGear AI导购平台</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 relative">
            {navigationItems.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {category.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === category.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {category.items.map((item) => (
                      <a
                        key={typeof item === 'string' ? item : item.name}
                        href={typeof item === 'string' ? '#' : item.url}
                        target={typeof item === 'string' || item.url === '#' ? '_self' : '_blank'}
                        rel={typeof item === 'string' || item.url === '#' ? '' : 'noopener noreferrer'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        {typeof item === 'string' ? item : item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>


          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-lg transition-colors"
              title="搜索装备"
            >
              <Search className="h-6 w-6" />
            </button>
            
            <button
              onClick={onToggleAI}
              className="relative p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-lg transition-colors bg-gray-800 hover:bg-gray-700"
              title="AI装备助手"
            >
              <Bot className="h-6 w-6 text-red-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse">
                <span className="sr-only">AI助手</span>
              </div>
            </button>
            
            {/* User Section */}
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-lg transition-colors">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                  <span className="hidden sm:block text-sm font-medium text-white">
                    {user.name}
                  </span>
                </button>
                
                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>退出登录</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1 px-3 py-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">登录</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              {navigationItems.map((category) => (
                <div key={category.name} className="space-y-1">
                  <button 
                    onClick={() => handleCategoryClick(category.name)}
                    className="text-gray-300 font-medium px-3 py-2 text-base hover:text-white transition-colors w-full text-left"
                  >
                    {category.name}
                  </button>
                  {category.items.map((item) => (
                    <a
                      key={typeof item === 'string' ? item : item.name}
                      href={typeof item === 'string' ? '#' : item.url}
                      target={typeof item === 'string' || item.url === '#' ? '_self' : '_blank'}
                      rel={typeof item === 'string' || item.url === '#' ? '' : 'noopener noreferrer'}
                      className="text-gray-400 hover:text-white block px-6 py-1 rounded-md text-sm"
                    >
                      {typeof item === 'string' ? item : item.name}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">搜索装备</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索游泳装备、自行车、跑鞋..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSearchModal(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    搜索
                  </button>
                </div>
              </form>
              
              {/* Quick Search Suggestions */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">热门搜索</p>
                <div className="flex flex-wrap gap-2">
                  {['防寒衣', '铁三车', '跑鞋', '游泳镜', '能量胶', '骑行服'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch({ preventDefault: () => {} } as React.FormEvent);
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          login(user);
          setShowAuthModal(false);
        }}
      />
    </header>
  );
};

export default Header;