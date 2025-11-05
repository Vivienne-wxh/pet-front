import { useState } from 'react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

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

interface AddEditPetPageProps {
  pet?: Pet;
  onSave: (pet: Pet) => void;
  onDelete?: (petId: number) => void;
  onBack: () => void;
}

const petAvatars = {
  '狗': ['🐕', '🐶', '🦮', '🐕‍🦺', '🐩'],
  '猫': ['🐱', '🐈', '🐈‍⬛', '😺', '😸'],
  '其他': ['🐰', '🐹', '🐦', '🐢', '🐠'],
};

const commonAllergies = [
  '牛肉', '鸡肉', '羊肉', '鱼肉',
  '小麦', '玉米', '大豆', '乳制品',
  '鸡蛋', '花生'
];

export function AddEditPetPage({ pet, onSave, onDelete, onBack }: AddEditPetPageProps) {
  const isEditing = !!pet;
  const [formData, setFormData] = useState<Pet>(pet || {
    name: '',
    type: '狗',
    breed: '',
    age: '',
    weight: '',
    avatar: '🐕',
    allergies: [],
  });

  const [newAllergy, setNewAllergy] = useState('');

  const handleChange = (field: keyof Pet, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAllergy = (allergy: string) => {
    if (allergy && !formData.allergies?.includes(allergy)) {
      handleChange('allergies', [...(formData.allergies || []), allergy]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    handleChange('allergies', formData.allergies?.filter(a => a !== allergy) || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed) {
      alert('请填写宠物姓名和品种');
      return;
    }
    onSave(formData);
  };

  const handleDelete = () => {
    if (pet?.id && onDelete) {
      onDelete(pet.id);
    }
  };

  const availableAvatars = petAvatars[formData.type] || petAvatars['其他'];

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
        <h1 className="text-emerald-900">{isEditing ? '编辑宠物档案' : '添加新宠物'}</h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Avatar Selection */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <Label className="text-gray-900 mb-3 block">选择头像</Label>
          <div className="flex gap-3 justify-center">
            {availableAvatars.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleChange('avatar', emoji)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                  formData.avatar === emoji
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 scale-110'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
          <h2 className="text-gray-900">基本信息</h2>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700">宠物姓名 *</Label>
            <Input
              id="name"
              type="text"
              placeholder="例如：旺财"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 h-11 rounded-xl border-gray-200"
              required
            />
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type" className="text-gray-700">宠物类型 *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                handleChange('type', value as '狗' | '猫' | '其他');
                handleChange('avatar', petAvatars[value as '狗' | '猫' | '其他'][0]);
              }}
            >
              <SelectTrigger className="mt-1 h-11 rounded-xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="狗">狗</SelectItem>
                <SelectItem value="猫">猫</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Breed */}
          <div>
            <Label htmlFor="breed" className="text-gray-700">品种 *</Label>
            <Input
              id="breed"
              type="text"
              placeholder="例如：金毛、英短等"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              className="mt-1 h-11 rounded-xl border-gray-200"
              required
            />
          </div>

          {/* Age and Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="age" className="text-gray-700">年龄</Label>
              <Input
                id="age"
                type="text"
                placeholder="例如：3岁"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                className="mt-1 h-11 rounded-xl border-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-gray-700">体重</Label>
              <Input
                id="weight"
                type="text"
                placeholder="例如：5kg"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className="mt-1 h-11 rounded-xl border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
          <h2 className="text-gray-900">过敏信息</h2>

          {/* Current Allergies */}
          {formData.allergies && formData.allergies.length > 0 && (
            <div>
              <Label className="text-gray-700 mb-2 block">已添加的过敏源</Label>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-red-50 text-red-600 pr-1"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="ml-1 hover:text-red-800"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Common Allergies */}
          <div>
            <Label className="text-gray-700 mb-2 block">常见过敏源（点击添加）</Label>
            <div className="flex flex-wrap gap-2">
              {commonAllergies.filter(a => !formData.allergies?.includes(a)).map((allergy, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAddAllergy(allergy)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                >
                  + {allergy}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Allergy Input */}
          <div>
            <Label htmlFor="newAllergy" className="text-gray-700">自定义过敏源</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="newAllergy"
                type="text"
                placeholder="输入其他过敏源"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy(newAllergy);
                  }
                }}
                className="h-11 rounded-xl border-gray-200"
              />
              <Button
                type="button"
                onClick={() => handleAddAllergy(newAllergy)}
                variant="outline"
                className="rounded-xl"
              >
                添加
              </Button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          <Save size={20} className="mr-2" />
          {isEditing ? '保存修改' : '添加宠物'}
        </Button>

        {/* Delete Button - Only shown when editing */}
        {isEditing && onDelete && pet?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 size={20} className="mr-2" />
                删除此档案
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认删除宠物档案？</AlertDialogTitle>
                <AlertDialogDescription>
                  您确定要删除 {pet.name} 的档案吗？此操作无法撤销，所有相关数据将被永久删除。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  确认删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </form>
    </div>
  );
}
