import { AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

const dangerousFoods = [
  { name: '巧克力', risk: '高危', icon: '🍫', description: '含可可碱，对宠物有毒' },
  { name: '葡萄', risk: '高危', icon: '🍇', description: '可能导致肾衰竭' },
  { name: '洋葱', risk: '高危', icon: '🧅', description: '破坏红细胞，引起贫血' },
  { name: '木糖醇', risk: '高危', icon: '🍬', description: '导致低血糖、肝衰竭' },
  { name: '牛油果', risk: '中危', icon: '🥑', description: '含毒性物质persin' },
  { name: '生鸡蛋', risk: '中危', icon: '🥚', description: '可能含有沙门氏菌' },
];

interface DangerousFoodsListProps {
  onFoodClick: (foodName: string) => void;
}

export function DangerousFoodsList({ onFoodClick }: DangerousFoodsListProps) {
  return (
    <div className="px-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={18} className="text-red-500" />
        <h2 className="text-emerald-900">热门危险食物</h2>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-2 gap-3">
        {dangerousFoods.map((food, index) => (
          <button
            key={index}
            className="bg-white rounded-2xl p-4 text-left hover:shadow-md transition-shadow duration-200 border border-gray-100"
            onClick={() => onFoodClick(food.name)}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{food.icon}</span>
              <Badge 
                variant={food.risk === '高危' ? 'destructive' : 'secondary'}
                className="text-xs rounded-full"
              >
                {food.risk}
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">{food.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{food.description}</p>
          </button>
        ))}
      </div>

      {/* View More Link */}
      <button className="w-full text-center text-emerald-600 text-sm mt-4 py-2">
        查看完整危险食物列表 →
      </button>
    </div>
  );
}
