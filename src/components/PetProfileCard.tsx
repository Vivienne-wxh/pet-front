import { Edit2 } from 'lucide-react';
import { Badge } from './ui/badge';

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

interface PetProfileCardProps {
  pet: Pet;
  onEdit: () => void;
}

export function PetProfileCard({ pet, onEdit }: PetProfileCardProps) {

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
          {pet.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-gray-900 mb-1">{pet.name}</h3>
              <p className="text-sm text-gray-500">
                {pet.breed} · {pet.type}
              </p>
            </div>
            <button
              onClick={onEdit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 size={16} className="text-gray-400" />
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">年龄</span>
              <span className="text-sm text-gray-700">{pet.age}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">体重</span>
              <span className="text-sm text-gray-700">{pet.weight}</span>
            </div>
          </div>

          {/* Allergies */}
          {pet.allergies && pet.allergies.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">过敏源：</p>
              <div className="flex flex-wrap gap-1">
                {pet.allergies.map((allergy, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-red-50 text-red-600 rounded-full"
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
