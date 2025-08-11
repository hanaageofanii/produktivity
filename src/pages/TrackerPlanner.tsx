import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Edit2, Trash2, Clock, CheckCircle, Circle } from 'lucide-react';

interface Plan {
  id: string;
  date: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  createdAt: string;
}

export default function TrackerPlanner() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    priority: 'medium' as const,
    category: '',
    startTime: '',
    endTime: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('plans');
    if (stored) {
      setPlans(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('plans', JSON.stringify(plans));
  }, [plans]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setPlans(plans.map(plan => 
        plan.id === editingId 
          ? { ...plan, ...formData }
          : plan
      ));
      setEditingId(null);
    } else {
      const newPlan: Plan = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setPlans([...plans, newPlan]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      startTime: '',
      endTime: ''
    });
  };

  const handleEdit = (plan: Plan) => {
    setFormData({
      date: plan.date,
      title: plan.title,
      description: plan.description,
      priority: plan.priority,
      category: plan.category,
      startTime: plan.startTime,
      endTime: plan.endTime
    });
    setEditingId(plan.id);
  };

  const handleDelete = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const toggleComplete = (id: string) => {
    setPlans(plans.map(plan =>
      plan.id === id ? { ...plan, completed: !plan.completed } : plan
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const todayPlans = plans.filter(plan => plan.date === new Date().toISOString().split('T')[0]);
  const completedToday = todayPlans.filter(plan => plan.completed).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-2xl p-8 text-center">
        <Calendar className="w-12 h-12 text-blue-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Tracker & Planner</h1>
        <p className="text-blue-700">Rencanakan dan lacak aktivitas harian Anda</p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Plans</p>
              <p className="text-3xl font-bold text-blue-600">{todayPlans.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-3xl font-bold text-purple-600">
                {todayPlans.length > 0 ? Math.round((completedToday / todayPlans.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xs">
                {todayPlans.length > 0 ? Math.round((completedToday / todayPlans.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Plan' : 'Tambah Rencana Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Rencana</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Judul rencana..."
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Deskripsi detail rencana..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kerja, Personal, Olahraga, dll."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Selesai</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Plan' : 'Tambah Plan'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], title: '', description: '', priority: 'medium', category: '', startTime: '', endTime: '' });
                }}
                className="ml-4 px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100 overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-semibold text-gray-900">Daftar Rencana</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Judul</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Deskripsi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Waktu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {plans.map((plan) => (
                <tr key={plan.id} className={`hover:bg-blue-50 transition-colors ${
                  plan.completed ? 'bg-green-25 opacity-75' : ''
                }`}>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleComplete(plan.id)}
                      className="flex items-center"
                    >
                      {plan.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-green-600 transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(plan.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${plan.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {plan.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{plan.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(plan.priority)}`}>
                      {plan.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{plan.category}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-blue-500" />
                      {plan.startTime} - {plan.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {plans.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Belum ada rencana. Mulai buat rencana harian Anda!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}