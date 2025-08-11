import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Edit2, Trash2, Book, Target } from 'lucide-react';

interface Development {
  id: string;
  date: string;
  category: string;
  activity: string;
  duration: number; // minutes
  progress: number; // percentage 0-100
  notes: string;
  createdAt: string;
}

export default function PersonalDevelopment() {
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    activity: '',
    duration: '',
    progress: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('developments');
    if (stored) {
      setDevelopments(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('developments', JSON.stringify(developments));
  }, [developments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setDevelopments(developments.map(development => 
        development.id === editingId 
          ? { 
              ...development, 
              ...formData, 
              duration: parseInt(formData.duration),
              progress: parseInt(formData.progress)
            }
          : development
      ));
      setEditingId(null);
    } else {
      const newDevelopment: Development = {
        id: Date.now().toString(),
        date: formData.date,
        category: formData.category,
        activity: formData.activity,
        duration: parseInt(formData.duration),
        progress: parseInt(formData.progress),
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      setDevelopments([...developments, newDevelopment]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      activity: '',
      duration: '',
      progress: '',
      notes: ''
    });
  };

  const handleEdit = (development: Development) => {
    setFormData({
      date: development.date,
      category: development.category,
      activity: development.activity,
      duration: development.duration.toString(),
      progress: development.progress.toString(),
      notes: development.notes
    });
    setEditingId(development.id);
  };

  const handleDelete = (id: string) => {
    setDevelopments(developments.filter(development => development.id !== id));
  };

  const averageProgress = developments.length > 0 
    ? developments.reduce((sum, dev) => sum + dev.progress, 0) / developments.length 
    : 0;

  const totalDuration = developments.reduce((sum, dev) => sum + dev.duration, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 rounded-2xl p-8 text-center">
        <TrendingUp className="w-12 h-12 text-pink-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-pink-900 mb-2">Pengembangan Diri</h1>
        <p className="text-pink-700">Catat progress pembelajaran dan pengembangan diri</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Progress</p>
              <p className="text-3xl font-bold text-pink-600">{averageProgress.toFixed(0)}%</p>
            </div>
            <Target className="w-8 h-8 text-pink-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Learning Time</p>
              <p className="text-3xl font-bold text-purple-600">{totalDuration}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <Book className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Aktivitas' : 'Catat Aktivitas Pengembangan Diri'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Belajar, Membaca, Kursus, dll."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aktivitas</label>
            <input
              type="text"
              required
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Baca buku, ikut webinar, dll."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi (menit)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="75"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Catatan pembelajaran..."
            />
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Aktivitas' : 'Catat Aktivitas'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], category: '', activity: '', duration: '', progress: '', notes: '' });
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100 overflow-hidden">
        <div className="p-6 border-b border-pink-100">
          <h3 className="text-xl font-semibold text-gray-900">Riwayat Pengembangan Diri</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aktivitas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Durasi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catatan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {developments.map((development) => (
                <tr key={development.id} className="hover:bg-pink-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(development.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{development.category}</td>
                  <td className="px-6 py-4 text-gray-900">{development.activity}</td>
                  <td className="px-6 py-4 text-gray-600">{development.duration} min</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${development.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {development.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{development.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(development)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(development.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {developments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data pengembangan diri. Mulai catat aktivitas pembelajaran Anda!
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