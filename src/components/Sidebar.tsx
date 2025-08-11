import React from 'react';
import { 
  BarChart3, 
  Calendar, 
  CheckSquare, 
  Dumbbell, 
  TrendingUp, 
  Heart, 
  Home, 
  Brain, 
  BookOpen, 
  DollarSign, 
  Utensils,
  X
} from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-purple-600' },
  { id: 'tracker-planner', label: 'Tracker & Planner', icon: Calendar, color: 'text-blue-600' },
  { id: 'todo-lists', label: 'To-Do Lists', icon: CheckSquare, color: 'text-green-600' },
  { id: 'exercise', label: 'Olahraga', icon: Dumbbell, color: 'text-orange-600' },
  { id: 'personal-development', label: 'Pengembangan Diri', icon: TrendingUp, color: 'text-pink-600' },
  { id: 'worship', label: 'Ibadah', icon: Heart, color: 'text-rose-600' },
  { id: 'house-work', label: 'Pekerjaan Rumah', icon: Home, color: 'text-indigo-600' },
  { id: 'health-mood', label: 'Kesehatan & Mood', icon: Brain, color: 'text-teal-600' },
  { id: 'daily-reflection', label: 'Refleksi Harian', icon: BookOpen, color: 'text-amber-600' },
  { id: 'finance', label: 'Keuangan', icon: DollarSign, color: 'text-emerald-600' },
  { id: 'food', label: 'Makanan', icon: Utensils, color: 'text-red-600' },
];

export default function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const handlePageChange = (pageId: Page) => {
    setCurrentPage(pageId);
    setSidebarOpen(false);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/80 backdrop-blur-xl border-r border-purple-100 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ProductiveLife
            </h1>
            <p className="text-sm text-gray-500">Sistem Produktivitas</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto h-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handlePageChange(item.id as Page)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 shadow-sm'
                  : 'hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : item.color}`} />
              <span className={`text-sm font-medium ${
                isActive ? 'text-purple-900' : 'text-gray-700'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}