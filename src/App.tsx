import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TodoLists from './pages/TodoLists';
import Exercise from './pages/Exercise';
import Finance from './pages/Finance';
import PersonalDevelopment from './pages/PersonalDevelopment';
import Worship from './pages/Worship';
import HouseWork from './pages/HouseWork';
import HealthMood from './pages/HealthMood';
import DailyReflection from './pages/DailyReflection';
import Food from './pages/Food';
import TrackerPlanner from './pages/TrackerPlanner';

export type Page = 
  | 'dashboard' 
  | 'tracker-planner'
  | 'todo-lists' 
  | 'exercise' 
  | 'personal-development' 
  | 'worship' 
  | 'house-work' 
  | 'health-mood' 
  | 'daily-reflection' 
  | 'finance' 
  | 'food';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'tracker-planner': return <TrackerPlanner />;
      case 'todo-lists': return <TodoLists />;
      case 'exercise': return <Exercise />;
      case 'personal-development': return <PersonalDevelopment />;
      case 'worship': return <Worship />;
      case 'house-work': return <HouseWork />;
      case 'health-mood': return <HealthMood />;
      case 'daily-reflection': return <DailyReflection />;
      case 'finance': return <Finance />;
      case 'food': return <Food />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 hover:bg-white transition-all duration-300"
        >
          <Menu className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-80 min-h-screen p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;