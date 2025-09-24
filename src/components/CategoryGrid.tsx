import React from 'react';
import { Waves, Bike, Footprints, Zap } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: '游泳装备',
    icon: Waves,
    description: '游泳装备AI专家 - 泳衣、护目镜、防寒衣等',
    color: 'from-gray-800 to-gray-900',
    textColor: 'text-gray-800'
  },
  {
    id: 2,
    name: '自行车装备',
    icon: Bike,
    description: '自行车装备AI管家 - 公路车、铁三车、骑行服等',
    color: 'from-gray-700 to-gray-800',
    textColor: 'text-gray-700'
  },
  {
    id: 3,
    name: '跑步装备',
    icon: Footprints,
    description: '跑步装备AI管家 - 跑鞋、跑步服、配件等',
    color: 'from-gray-600 to-gray-700',
    textColor: 'text-gray-600'
  },
  {
    id: 4,
    name: '营养补给',
    icon: Zap,
    description: '营养补给AI管家 - 能量胶、电解质、恢复饮品',
    color: 'from-gray-500 to-gray-600',
    textColor: 'text-gray-500'
  }
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            铁三装备分类
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专业分类，精准定位你需要的每一件装备
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <IconComponent className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold ${category.textColor} mb-2`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 ${category.textColor}`}>
                      探索更多
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;