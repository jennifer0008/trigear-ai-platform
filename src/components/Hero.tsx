import React from 'react';
import { Info, Zap, Target, Award } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex items-center min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              你的运动
              <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                AI贴身管家
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              根据你的运动水平、预算、和目标，推荐合适的装备，为你保驾护航。
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="bg-black w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">智能对话</h3>
              <p className="text-gray-300 text-sm">通过自然对话了解你的需求</p>
            </div>

            <div className="rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">帮你淘、精准推</h3>
              <p className="text-gray-300 text-sm">AI分析商品数据，找到性价高、品质好的装备</p>
            </div>

            <div className="rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="bg-gray-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">专业指导</h3>
              <p className="text-gray-300 text-sm">专业教练经验融入AI，提供个性化训练装备建议</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10000+</div>
              <div className="text-blue-200 text-sm">精选商品</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-300 text-sm">推荐准确率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5000+</div>
              <div className="text-gray-300 text-sm">满意用户</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;