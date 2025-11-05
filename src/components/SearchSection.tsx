import { useState } from 'react';
import { Search, Camera } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleCameraClick = () => {
    alert('正在打开相机识别配料表...\n\n此功能将调用设备相机，使用AI识别配料表中的成分');
    // TODO: Implement camera/photo upload functionality
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="px-6 mb-8">
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
          <Search size={20} />
        </div>
        <Input
          type="text"
          placeholder="输入食物名称，如：葡萄、巧克力"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-4 h-14 rounded-2xl border-2 border-emerald-100 focus:border-emerald-400 bg-white shadow-sm text-base"
        />
      </div>

      {/* Camera Recognition Button */}
      <Button
        onClick={handleCameraClick}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
      >
        <Camera size={20} className="mr-2" />
        拍照识别配料表
      </Button>

      {/* Quick Tip */}
      <p className="text-center text-xs text-emerald-600/60 mt-3">
        使用AI快速识别食物成分，保护爱宠安全
      </p>
    </div>
  );
}
