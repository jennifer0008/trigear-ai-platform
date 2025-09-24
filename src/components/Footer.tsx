import React from 'react';
import { Bot, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">T3</span>
              </div>
              <span className="text-xl font-bold">TriGear AI导购平台</span>
            </div>
            <p className="text-gray-400 mb-4">
              专业的铁人三项装备AI导购平台，为每位铁三爱好者提供个性化装备推荐。
            </p>
            <div className="flex space-x-4">
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Bot className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI导购</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">品牌合作</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">用户评价</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">装备分类</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">游泳装备</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">自行车装备</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">跑步装备</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">营养补给</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-3" />
                <span>support@trigear.ai</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-3" />
                <span>400-123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-3" />
                <span>北京市朝阳区</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 TriGear AI. 保留所有权利. | 
            <a href="#" className="hover:text-white ml-2">隐私政策</a> | 
            <a href="#" className="hover:text-white ml-2">服务条款</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;