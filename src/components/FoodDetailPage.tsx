import { ArrowLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface FoodDetailPageProps {
  foodName: string;
  onBack: () => void;
}

// Mock data - in real app, this would come from API
const getFoodData = (name: string) => {
  const dangerousFoods: Record<string, any> = {
    '巧克力': {
      safetyLevel: '高危',
      icon: '🍫',
      description: '巧克力对犬猫有剧毒',
      toxicSubstance: '可可碱（Theobromine）',
      symptoms: ['呕吐', '腹泻', '心跳加速', '癫痫', '严重时可致死'],
      dosage: '每公斤体重20mg可可碱即可引起中毒',
      firstAid: [
        '立即停止喂食',
        '尽快联系兽医',
        '如刚食用，可在兽医指导下催吐',
        '送医治疗，可能需要洗胃'
      ],
      alternatives: ['宠物专用零食', '胡萝卜条', '苹果片（去籽）'],
    },
    '葡萄': {
      safetyLevel: '高危',
      icon: '🍇',
      description: '葡萄和葡萄干可能导致犬只急性肾衰竭',
      toxicSubstance: '未知毒性物质（研究中）',
      symptoms: ['呕吐', '腹泻', '食欲不振', '腹痛', '少尿或无尿', '肾衰竭'],
      dosage: '少量即可能引起中毒，个体差异大',
      firstAid: [
        '立即停止喂食',
        '紧急就医，越早越好',
        '可能需要输液治疗',
        '密切监测肾功能'
      ],
      alternatives: ['蓝莓', '西瓜', '香蕉'],
    },
    '洋葱': {
      safetyLevel: '高危',
      icon: '🧅',
      description: '洋葱会破坏宠物的红细胞，导致贫血',
      toxicSubstance: '硫化物',
      symptoms: ['贫血', '虚弱', '呼吸急促', '尿液变红', '牙龈苍白'],
      dosage: '体重的0.5%即可引起中毒',
      firstAid: [
        '立即停止喂食',
        '联系兽医',
        '可能需要输血治疗',
        '补充营养支持'
      ],
      alternatives: ['南瓜', '胡萝卜', '西兰花（少量）'],
    },
  };

  const safeFoods: Record<string, any> = {
    '苹果': {
      safetyLevel: '安全',
      icon: '🍎',
      description: '苹果是安全的宠物零食，富含维生素和纤维',
      benefits: ['富含维生素C和A', '提供膳食纤维', '帮助清洁牙齿'],
      precautions: [
        '必须去除果核和种子（含氰化物）',
        '适量喂食，避免糖分过多',
        '切成小块，防止窒息'
      ],
      servingSize: '每天1-2片，根据宠物体型调整',
      suitableFor: ['狗', '猫（少量）'],
    },
    '西瓜': {
      safetyLevel: '安全',
      icon: '🍉',
      description: '西瓜水分充足，适合夏季喂食',
      benefits: ['补充水分', '富含维生素A和C', '低热量'],
      precautions: [
        '去除种子和外皮',
        '不要过量，可能引起腹泻',
        '切成小块'
      ],
      servingSize: '少量作为零食，不超过总食量的10%',
      suitableFor: ['狗', '猫'],
    },
  };

  return dangerousFoods[name] || safeFoods[name] || {
    safetyLevel: '未知',
    icon: '🔍',
    description: '暂无该食物的详细安全信息',
    recommendation: '建议咨询专业兽医',
  };
};

export function FoodDetailPage({ foodName, onBack }: FoodDetailPageProps) {
  const foodData = getFoodData(foodName);
  const isDangerous = foodData.safetyLevel === '高危' || foodData.safetyLevel === '中危';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      {/* Header */}
      <header className="pt-12 pb-4 px-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-600 mb-3"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-4xl">
            {foodData.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-emerald-900 mb-1">{foodName}</h1>
            <Badge
              variant={isDangerous ? 'destructive' : 'default'}
              className={`${
                isDangerous 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isDangerous ? <AlertTriangle size={14} className="mr-1" /> : <CheckCircle size={14} className="mr-1" />}
              {foodData.safetyLevel}
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-start gap-3">
            <Info size={20} className={isDangerous ? 'text-red-500' : 'text-emerald-500'} />
            <div>
              <h2 className="text-gray-900 mb-2">基本信息</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{foodData.description}</p>
            </div>
          </div>
        </div>

        {/* Dangerous Food Details */}
        {isDangerous && (
          <>
            {/* Toxic Substance */}
            {foodData.toxicSubstance && (
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <h2 className="text-red-900 mb-3">毒性物质</h2>
                <p className="text-red-700 text-sm">{foodData.toxicSubstance}</p>
                {foodData.dosage && (
                  <p className="text-red-600 text-xs mt-2">⚠️ {foodData.dosage}</p>
                )}
              </div>
            )}

            {/* Symptoms */}
            {foodData.symptoms && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h2 className="text-gray-900 mb-3">中毒症状</h2>
                <ul className="space-y-2">
                  {foodData.symptoms.map((symptom: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* First Aid */}
            {foodData.firstAid && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                <h2 className="text-amber-900 mb-3">紧急处理</h2>
                <ol className="space-y-2">
                  {foodData.firstAid.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-amber-800">
                      <span className="flex-shrink-0 w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Alternatives */}
            {foodData.alternatives && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h2 className="text-gray-900 mb-3">安全替代品</h2>
                <div className="flex flex-wrap gap-2">
                  {foodData.alternatives.map((alt: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Safe Food Details */}
        {!isDangerous && foodData.benefits && (
          <>
            {/* Benefits */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h2 className="text-gray-900 mb-3">营养益处</h2>
              <ul className="space-y-2">
                {foodData.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Precautions */}
            {foodData.precautions && (
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h2 className="text-blue-900 mb-3">喂食注意</h2>
                <ul className="space-y-2">
                  {foodData.precautions.map((precaution: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Serving Size */}
            {foodData.servingSize && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h2 className="text-gray-900 mb-2">建议份量</h2>
                <p className="text-gray-600 text-sm">{foodData.servingSize}</p>
              </div>
            )}
          </>
        )}

        {/* Emergency Contact */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white">
          <h2 className="mb-2">紧急情况？</h2>
          <p className="text-sm text-white/90 mb-4">
            如果您的宠物误食了危险食物，请立即联系兽医或宠物急救中心
          </p>
          <Button
            className="w-full bg-white text-emerald-600 hover:bg-white/90"
          >
            拨打急救电话
          </Button>
        </div>
      </div>
    </div>
  );
}
