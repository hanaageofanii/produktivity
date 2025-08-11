import React, { useState, useEffect } from 'react';
import { Plus, Dumbbell, Edit2, Trash2, Timer, Zap } from 'lucide-react';

interface Exercise {
  id: string;
  date: string;
  type: string;
  duration: number; // minutes
  calories: number;
  notes: string;
  createdAt: string;
}

export default function Exercise() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: '',
    calories: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('exercises');
    if (stored) {
      setExercises(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  }, [exercises]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setExercises(exercises.map(exercise => 
        exercise.id === editingId 
          ? { 
              ...exercise, 
              ...formData, 
              duration: parseInt(formData.duration),
              calories: parseInt(formData.calories)
            }
          : exercise
      ));
      setEditingId(null);
    } else {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        date: formData.date,
        type: formData.type,
        duration: parseInt(formData.duration),
        calories: parseInt(formData.calories),
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      setExercises([...exercises, newExercise]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: '',
      calories: '',
      notes: ''
    });
  };

  const handleEdit = (exercise: Exercise) => {
    setFormData({
      date: exercise.date,
      type: exercise.type,
      duration: exercise.duration.toString(),
      calories: exercise.calories.toString(),
      notes: exercise.notes
    });
    setEditingId(exercise.id);
  };

  const handleDelete = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const totalDuration = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
  const totalCalories = exercises.reduce((sum, exercise) => sum + exercise.calories, 0);
  const averageDuration = exercises.length > 0 ? totalDuration / exercises.length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 rounded-2xl p-8 text-center">
        <Dumbbell className="w-12 h-12 text-orange-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-orange-900 mb-2">Olahraga</h1>
        <p className="text-orange-700">Catat aktivitas olahraga dan kebugaran Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Duration</p>
              <p className="text-3xl font-bold text-orange-600">{totalDuration}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <Timer className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Calories</p>
              <p className="text-3xl font-bold text-red-600">{totalCalories}</p>
              <p className="text-sm text-gray-500">burned</p>
            </div>
            <Zap className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Duration</p>
              <p className="text-3xl font-bold text-blue-600">{averageDuration.toFixed(0)}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <Dumbbell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Workout' : 'Catat Workout Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Olahraga</label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Running, Gym, Yoga, dll."
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kalori Terbakar</label>
            <input
              type="number"
              required
              min="1"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="250"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Catatan workout..."
            />
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Workout' : 'Catat Workout'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], type: '', duration: '', calories: '', notes: '' });
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 overflow-hidden">
        <div className="p-6 border-b border-orange-100">
          <h3 className="text-xl font-semibold text-gray-900">Riwayat Workout</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jenis</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Durasi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kalori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catatan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {exercises.map((exercise) => (
                <tr key={exercise.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(exercise.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{exercise.type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center">
                      <Timer className="w-4 h-4 mr-1 text-orange-500" />
                      {exercise.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-red-500" />
                      {exercise.calories} cal
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{exercise.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(exercise)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exercise.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {exercises.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data workout. Mulai catat aktivitas olahraga Anda!
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