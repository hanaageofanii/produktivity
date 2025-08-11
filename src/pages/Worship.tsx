import React, { useState, useEffect } from 'react';
import { Plus, Heart, Edit2, Trash2, Clock } from 'lucide-react';

interface Worship {
  id: string;
  date: string;
  type: string;
  duration: number; // minutes
  notes: string;
  completed: boolean;
  createdAt: string;
}

export default function Worship() {
  const [worships, setWorships] = useState<Worship[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('worships');
    if (stored) {
      setWorships(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('worships', JSON.stringify(worships));
  }, [worships]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setWorships(worships.map(worship => 
        worship.id === editingId 
          ? { 
              ...worship, 
              ...formData, 
              duration: parseInt(formData.duration)
            }
          : worship
      ));
      setEditingId(null);
    } else {
      const newWorship: Worship = {
        id: Date.now().toString(),
        date: formData.date,
        type: formData.type,
        duration: parseInt(formData.duration),
        notes: formData.notes,
        completed: true,
        createdAt: new Date().toISOString()
      };
      setWorships([...worships, newWorship]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: '',
      notes: ''
    });
  };

  const handleEdit = (worship: Worship) => {
    setFormData({
      date: worship.date,
      type: worship.type,
      duration: worship.duration.toString(),
      notes: worship.notes
    });
    setEditingId(worship.id);
  };

  const handleDelete = (id: string) => {
    setWorships(worships.filter(worship => worship.id !== id));
  };

  const totalDuration = worships.reduce((sum, worship) => sum + worship.duration, 0);
  const averageDuration = worships.length > 0 ? totalDuration / worships.length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 via-rose-300 to-rose-200 rounded-2xl p-8 text-center">
        <Heart className="w-12 h-12 text-rose-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-rose-900 mb-2">Ibadah</h1>
        <p className="text-rose-700">Catat aktivitas ibadah dan spiritual Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Duration</p>
              <p className="text-3xl font-bold text-rose-600">{totalDuration}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <Clock className="w-8 h-8 text-rose-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Duration</p>
              <p className="text-3xl font-bold text-purple-600">{averageDuration.toFixed(0)}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <Heart className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Ibadah' : 'Catat Ibadah'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Ibadah</label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Sholat, Doa, Dzikir, dll."
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Catatan ibadah..."
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Ibadah' : 'Catat Ibadah'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], type: '', duration: '', notes: '' });
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden">
        <div className="p-6 border-b border-rose-100">
          <h3 className="text-xl font-semibold text-gray-900">Riwayat Ibadah</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-rose-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jenis</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Durasi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catatan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {worships.map((worship) => (
                <tr key={worship.id} className="hover:bg-rose-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(worship.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{worship.type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-rose-500" />
                      {worship.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{worship.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(worship)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(worship.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {worships.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data ibadah. Mulai catat aktivitas ibadah Anda!
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