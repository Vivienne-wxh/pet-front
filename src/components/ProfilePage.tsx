import { Plus, Clock, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { PetProfileCard } from './PetProfileCard';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface Pet {
  id?: number;
  name: string;
  type: '狗' | '猫' | '其他';
  breed: string;
  age: string;
  weight: string;
  avatar: string;
  allergies?: string[];
}

interface ProfilePageProps {
  pets: Pet[];
  onAddPet: () => void;
  onEditPet: (pet: Pet) => void;
}

const recentSearches = [
  { food: '巧克力', result: '高危', time: '2小时前' },
  { food: '苹果', result: '安全', time: '1天前' },
  { food: '洋葱', result: '高危', time: '2天前' },
];

export function ProfilePage({ pets, onAddPet, onEditPet }: ProfilePageProps) {

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-white mb-1">宠物主人</h1>
            <p className="text-sm text-white/80">守护 {pets.length} 只爱宠的健康</p>
          </div>
        </div>
      </header>

      {/* Pet Profiles Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-emerald-900">我的爱宠</h2>
          <Button
            onClick={onAddPet}
            variant="outline"
            className="h-8 rounded-full border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          >
            <Plus size={16} className="mr-1" />
            添加宠物
          </Button>
        </div>

        <div className="space-y-3">
          {pets.map((pet) => (
            <PetProfileCard key={pet.id} pet={pet} onEdit={() => onEditPet(pet)} />
          ))}
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Recent Searches */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-emerald-600" />
          <h2 className="text-emerald-900">最近查询</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-3 ${
                index !== recentSearches.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {search.result === '高危' ? '⚠️' : '✅'}
                </span>
                <div>
                  <p className="text-gray-900">{search.food}</p>
                  <p className="text-xs text-gray-400">{search.time}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  search.result === '高危'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {search.result}
              </span>
            </div>
          ))}
        </div>

        <button className="w-full text-center text-emerald-600 text-sm mt-3 py-2">
          查看全部查询记录 →
        </button>
      </div>

      <Separator className="bg-gray-200" />

      {/* Settings Menu */}
      <div className="px-6 py-6">
        <h2 className="text-emerald-900 mb-4">设置与帮助</h2>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-600" />
              <span className="text-gray-900">提醒设置</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-600" />
              <span className="text-gray-900">隐私政策</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle size={20} className="text-gray-600" />
              <span className="text-gray-900">帮助中心</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <span className="text-gray-900">通用设置</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-6">
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <LogOut size={18} className="mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
