import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, CheckCircle, Target } from 'lucide-react';
import WeeklyCompletionChart from '../components/charts/WeeklyCompletionChart';
import ExpenseBreakdownChart from '../components/charts/ExpenseBreakdownChart';
import MoodTrackerChart from '../components/charts/MoodTrackerChart';
import ProgressBarChart from '../components/charts/ProgressBarChart';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalExpenses: number;
  averageMood: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalExpenses: 0,
    averageMood: 7
  });

  useEffect(() => {
    // Calculate stats from localStorage data
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const expenses = JSON.parse(localStorage.getItem('finances') || '[]');
    const moods = JSON.parse(localStorage.getItem('health-mood') || '[]');

    const totalTasks = todos.length;
    const completedTasks = todos.filter((todo: any) => todo.completed).length;
    const totalExpenses = expenses.reduce((sum: number, item: any) => 
      item.type === 'expense' ? sum + item.amount : sum, 0);
    const averageMood = moods.length > 0 
      ? moods.reduce((sum: number, item: any) => sum + item.mood, 0) / moods.length
      : 7;

    setStats({ totalTasks, completedTasks, totalExpenses, averageMood });
  }, []);

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Dashboard Produktivitas
        </h1>
        <p className="text-gray-600">Ringkasan aktivitas dan progress Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{completionRate.toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Mood</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageMood.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-100 to-pink-200 rounded-xl">
              <TrendingUp className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Completion</h3>
          <WeeklyCompletionChart />
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <ExpenseBreakdownChart />
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Mood Tracker</h3>
          <MoodTrackerChart />
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h3>
          <ProgressBarChart />
        </div>
      </div>
    </div>
  );
}