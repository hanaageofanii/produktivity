import React, { useState, useEffect } from 'react';
import { Plus, Home, Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';

interface HouseWork {
  id: string;
  date: string;
  task: string;
  room: string;
  duration: number; // minutes
  completed: boolean;
  notes: string;
  createdAt: string;
}

export default function HouseWork() {
  const [houseWorks, setHouseWorks] = useState<HouseWork[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    room: '',
    duration: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('houseworks');
    if (stored) {
      setHouseWorks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('houseworks', JSON.stringify(houseWorks));
  }, [houseWorks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setHouseWorks(houseWorks.map(houseWork => 
        houseWork.id === editingId 
          ? { 
              ...houseWork, 
              ...formData, 
              duration: parseInt(formData.duration)
            }
          : houseWork
      ));
      setEditingId(null);
    } else {
      const newHouseWork: HouseWork = {
        id: Date.now().toString(),
        date: formData.date,
        task: formData.task,
        room: formData.room,
        duration: parseInt(formData.duration),
        completed: false,
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      setHouseWorks([...houseWorks, newHouseWork]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      task: '',
      room: '',
      duration: '',
      notes: ''
    });
  };

  const handleEdit = (houseWork: HouseWork) => {
    setFormData({
      date: houseWork.date,
      task: houseWork.task,
      room: houseWork.room,
      duration: houseWork.duration.toString(),
      notes: houseWork.notes
    });
    setEditingId(houseWork.id);
  };

  const handleDelete = (id: string) => {
    setHouseWorks(houseWorks.filter(houseWork => houseWork.id !== id));
  };

  const toggleComplete = (id: string) => {
    setHouseWorks(houseWorks.map(houseWork =>
      houseWork.id === id ? { ...houseWork, completed: !houseWork.completed } : houseWork
    ));
  };

  const completedTasks = houseWorks.filter(hw => hw.completed).length;
  const totalTasks = houseWorks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-indigo-200 rounded-2xl p-8 text-center">
        <Home className="w-12 h-12 text-indigo-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">Pekerjaan Rumah</h1>
        <p className="text-indigo-700">Kelola tugas rumah tangga Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-indigo-600">{totalTasks}</p>
            </div>
            <Home className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-600">{completionRate.toFixed(0)}%</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">{completionRate.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Pekerjaan Rumah' : 'Tambah Pekerjaan Rumah'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tugas</label>
            <input
              type="text"
              required
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Menyapu, mencuci piring, dll."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ruangan</label>
            <input
              type="text"
              required
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Dapur, Kamar tidur, dll."
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="30"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Tugas' : 'Tambah Tugas'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], task: '', room: '', duration: '', notes: '' });
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-100 overflow-hidden">
        <div className="p-6 border-b border-indigo-100">
          <h3 className="text-xl font-semibold text-gray-900">Daftar Pekerjaan Rumah</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tugas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ruangan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Durasi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catatan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-100">
              {houseWorks.map((houseWork) => (
                <tr key={houseWork.id} className={`hover:bg-indigo-50 transition-colors ${
                  houseWork.completed ? 'bg-green-25 opacity-75' : ''
                }`}>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleComplete(houseWork.id)}
                      className="flex items-center"
                    >
                      {houseWork.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-green-600 transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(houseWork.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${houseWork.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {houseWork.task}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{houseWork.room}</td>
                  <td className="px-6 py-4 text-gray-600">{houseWork.duration} min</td>
                  <td className="px-6 py-4 text-gray-600">{houseWork.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(houseWork)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(houseWork.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {houseWorks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data pekerjaan rumah. Mulai tambah tugas rumah tangga Anda!
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