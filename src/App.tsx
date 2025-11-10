import { useState } from 'react';
import { SearchSection } from './components/SearchSection';
import { DangerousFoodsList } from './components/DangerousFoodsList';
import { AIChatPage } from './components/AIChatPage';
import { ProfilePage } from './components/ProfilePage';
import { FoodDetailPage } from './components/FoodDetailPage';
import { AddEditPetPage } from './components/AddEditPetPage';
import { BottomNav } from './components/BottomNav';
import { BetaAccessBanner } from './components/BetaAccessBanner';

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

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [currentPage, setCurrentPage] = useState<'main' | 'food-detail' | 'add-pet' | 'edit-pet'>('main');
  const [selectedFood, setSelectedFood] = useState<string>('');
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>(undefined);
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      name: '旺财',
      type: '狗',
      breed: '金毛',
      age: '3岁',
      weight: '28kg',
      avatar: '🐕',
      allergies: ['牛肉', '小麦'],
    },
    {
      id: 2,
      name: '咪咪',
      type: '猫',
      breed: '英短',
      age: '2岁',
      weight: '4.5kg',
      avatar: '🐱',
    },
  ]);
  
  // 将AI对话消息状态提升到App层级，避免切换tab时丢失
  const [aiChatMessages, setAiChatMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: '您好！我是AI宠物营养顾问，很高兴为您服务。您可以问我任何关于宠物饮食安全和营养的问题。',
      timestamp: new Date(),
    },
  ]);

  const handleFoodSearch = (foodName: string) => {
    setSelectedFood(foodName);
    setCurrentPage('food-detail');
  };

  const handleAddPet = () => {
    setSelectedPet(undefined);
    setCurrentPage('add-pet');
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentPage('edit-pet');
  };

  const handleSavePet = (pet: Pet) => {
    if (pet.id) {
      // Update existing pet
      setPets(pets.map(p => p.id === pet.id ? pet : p));
    } else {
      // Add new pet
      setPets([...pets, { ...pet, id: Date.now() }]);
    }
    setCurrentPage('main');
    setActiveTab('profile');
  };

  const handleDeletePet = (petId: number) => {
    setPets(pets.filter(p => p.id !== petId));
    setCurrentPage('main');
    setActiveTab('profile');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  // Show special pages
  if (currentPage === 'food-detail' && selectedFood) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white max-w-md mx-auto">
        <FoodDetailPage foodName={selectedFood} onBack={handleBackToMain} />
      </div>
    );
  }

  if (currentPage === 'add-pet' || currentPage === 'edit-pet') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white max-w-md mx-auto">
        <AddEditPetPage
          pet={selectedPet}
          onSave={handleSavePet}
          onDelete={handleDeletePet}
          onBack={handleBackToMain}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col max-w-md mx-auto">
      {/* Main Content Area */}
      {activeTab === 'search' && (
        <div className="flex-1 pb-20">
          {/* Header */}
          <header className="pt-12 pb-6 px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
            </div>
            <h1 className="text-emerald-900 mb-1">AI宠物食品安全助手</h1>
            <p className="text-emerald-600/70 text-sm">守护爱宠健康每一餐</p>
          </header>

          {/* 内测申请横幅 */}
          <BetaAccessBanner />

          {/* Search Section */}
          <SearchSection onSearch={handleFoodSearch} />

          {/* Dangerous Foods List */}
          <DangerousFoodsList onFoodClick={handleFoodSearch} />
        </div>
      )}

      {activeTab === 'ai-chat' && (
        <AIChatPage 
          pets={pets} 
          messages={aiChatMessages}
          setMessages={setAiChatMessages}
        />
      )}

      {activeTab === 'profile' && (
        <ProfilePage
          pets={pets}
          onAddPet={handleAddPet}
          onEditPet={handleEditPet}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
