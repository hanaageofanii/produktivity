import React, { useState, useEffect } from 'react';
import { Plus, Brain, Edit2, Trash2, Heart, Smile } from 'lucide-react';

interface HealthMood {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  sleep: number; // hours
  water: number; // glasses
  notes: string;
  createdAt: string;
}

export default function HealthMood() {
  const [healthMoods, setHealthMoods] = useState<HealthMood[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: '',
    energy: '',
    sleep: '',
    water: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('health-mood');
    if (stored) {
      setHealthMoods(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('health-mood', JSON.stringify(healthMoods));
  }, [healthMoods]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setHealthMoods(healthMoods.map(healthMood => 
        healthMood.id === editingId 
          ? { 
              ...healthMood, 
              ...formData, 
              mood: parseInt(formData.mood),
              energy: parseInt(formData.energy),
              sleep: parseInt(formData.sleep),
              water: parseInt(formData.water)
            }
          : healthMood
      ));
      setEditingId(null);
    } else {
      const newHealthMood: HealthMood = {
        id: Date.now().toString(),
        date: formData.date,
        mood: parseInt(formData.mood),
        energy: parseInt(formData.energy),
        sleep: parseInt(formData.sleep),
        water: parseInt(formData.water),
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      setHealthMoods([...healthMoods, newHealthMood]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      mood: '',
      energy: '',
      sleep: '',
      water: '',
      notes: ''
    });
  };

  const handleEdit = (healthMood: HealthMood) => {
    setFormData({
      date: healthMood.date,
      mood: healthMood.mood.toString(),
      energy: healthMood.energy.toString(),
      sleep: healthMood.sleep.toString(),
      water: healthMood.water.toString(),
      notes: healthMood.notes
    });
    setEditingId(healthMood.id);
  };

  const handleDelete = (id: string) => {
    setHealthMoods(healthMoods.filter(healthMood => healthMood.id !== id));
  };

  const averageMood = healthMoods.length > 0 
    ? healthMoods.reduce((sum, hm) => sum + hm.mood, 0) / healthMoods.length 
    : 0;

  const averageEnergy = healthMoods.length > 0 
    ? healthMoods.reduce((sum, hm) => sum + hm.energy, 0) / healthMoods.length 
    : 0;

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600';
    if (mood >= 6) return 'text-yellow-600';
    if (mood >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '😐';
    if (mood >= 4) return '😕';
    return '😢';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-400 via-teal-300 to-teal-200 rounded-2xl p-8 text-center">
        <Brain className="w-12 h-12 text-teal-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-teal-900 mb-2">Kesehatan & Mood</h1>
        <p className="text-teal-700">Pantau kesehatan fisik dan mental Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Mood</p>
              <p className="text-3xl font-bold text-teal-600">{averageMood.toFixed(1)}/10</p>
            </div>
            <Smile className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Energy</p>
              <p className="text-3xl font-bold text-purple-600">{averageEnergy.toFixed(1)}/10</p>
            </div>
            <Heart className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-teal-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Data Kesehatan' : 'Catat Kesehatan & Mood Harian'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mood (1-10)</label>
            <input
              type="number"
              required
              min="1"
              max="10"
              value={formData.mood}
              onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Energy (1-10)</label>
            <input
              type="number"
              required
              min="1"
              max="10"
              value={formData.energy}
              onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sleep (hours)</label>
            <input
              type="number"
              required
              min="1"
              max="24"
              value={formData.sleep}
              onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Water (glasses)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.water}
              onChange={(e) => setFormData({ ...formData, water: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Catatan kesehatan..."
            />
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Data' : 'Catat Data'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], mood: '', energy: '', sleep: '', water: '', notes: '' });
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-teal-100 overflow-hidden">
        <div className="p-6 border-b border-teal-100">
          <h3 className="text-xl font-semibold text-gray-900">Riwayat Kesehatan & Mood</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mood</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Energy</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sleep</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Water</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catatan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-100">
              {healthMoods.map((healthMood) => (
                <tr key={healthMood.id} className="hover:bg-teal-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(healthMood.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getMoodEmoji(healthMood.mood)}</span>
                      <span className={`font-semibold ${getMoodColor(healthMood.mood)}`}>
                        {healthMood.mood}/10
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(healthMood.energy / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {healthMood.energy}/10
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{healthMood.sleep}h</td>
                  <td className="px-6 py-4 text-gray-600">{healthMood.water} glasses</td>
                  <td className="px-6 py-4 text-gray-600">{healthMood.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(healthMood)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(healthMood.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {healthMoods.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data kesehatan. Mulai catat kondisi kesehatan harian Anda!
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