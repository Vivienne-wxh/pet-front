import { Gift, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface BetaAccessBannerProps {
  onApply?: () => void;
}

export function BetaAccessBanner({ onApply }: BetaAccessBannerProps) {
  const handleApply = () => {
    // 跳转到飞书问卷
    window.open('https://jcnx0tky2lc0.feishu.cn/share/base/form/shrcn7zPoG0kIp1ry5n5pBLvTTd', '_blank');
    if (onApply) {
      onApply();
    }
  };

  return (
    <div className="mx-6 mb-6">
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        {/* 内容 */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Gift size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">内测版上线</h3>
              <p className="text-white/90 text-sm">限时开放，抢先体验AI宠物营养顾问</p>
            </div>
          </div>
          
          <Button
            onClick={handleApply}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>领取内测资格</span>
            <ExternalLink size={18} />
          </Button>
          
          <p className="text-white/80 text-xs text-center mt-3">
            填写问卷即可获得内测资格，立即体验完整功能
          </p>
        </div>
      </div>
    </div>
  );
}

