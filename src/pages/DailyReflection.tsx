import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Trash2, Star } from 'lucide-react';

interface Reflection {
  id: string;
  date: string;
  gratitude: string;
  achievement: string;
  challenge: string;
  improvement: string;
  mood: number; // 1-10
  rating: number; // 1-5 stars
  createdAt: string;
}

export default function DailyReflection() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    gratitude: '',
    achievement: '',
    challenge: '',
    improvement: '',
    mood: '',
    rating: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('reflections');
    if (stored) {
      setReflections(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reflections', JSON.stringify(reflections));
  }, [reflections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setReflections(reflections.map(reflection => 
        reflection.id === editingId 
          ? { 
              ...reflection, 
              ...formData, 
              mood: parseInt(formData.mood),
              rating: parseInt(formData.rating)
            }
          : reflection
      ));
      setEditingId(null);
    } else {
      const newReflection: Reflection = {
        id: Date.now().toString(),
        date: formData.date,
        gratitude: formData.gratitude,
        achievement: formData.achievement,
        challenge: formData.challenge,
        improvement: formData.improvement,
        mood: parseInt(formData.mood),
        rating: parseInt(formData.rating),
        createdAt: new Date().toISOString()
      };
      setReflections([...reflections, newReflection]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      gratitude: '',
      achievement: '',
      challenge: '',
      improvement: '',
      mood: '',
      rating: ''
    });
  };

  const handleEdit = (reflection: Reflection) => {
    setFormData({
      date: reflection.date,
      gratitude: reflection.gratitude,
      achievement: reflection.achievement,
      challenge: reflection.challenge,
      improvement: reflection.improvement,
      mood: reflection.mood.toString(),
      rating: reflection.rating.toString()
    });
    setEditingId(reflection.id);
  };

  const handleDelete = (id: string) => {
    setReflections(reflections.filter(reflection => reflection.id !== id));
  };

  const averageRating = reflections.length > 0 
    ? reflections.reduce((sum, r) => sum + r.rating, 0) / reflections.length 
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 rounded-2xl p-8 text-center">
        <BookOpen className="w-12 h-12 text-amber-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Refleksi Harian</h1>
        <p className="text-amber-700">Evaluasi dan refleksi hari Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reflections</p>
              <p className="text-3xl font-bold text-amber-600">{reflections.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Refleksi' : 'Refleksi Harian Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apa yang saya syukuri hari ini?</label>
            <textarea
              required
              rows={3}
              value={formData.gratitude}
              onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Tuliskan hal-hal yang Anda syukuri hari ini..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pencapaian hari ini</label>
            <textarea
              required
              rows={3}
              value={formData.achievement}
              onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Apa yang berhasil Anda capai hari ini?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tantangan yang dihadapi</label>
            <textarea
              required
              rows={3}
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Tantangan apa yang Anda hadapi dan bagaimana mengatasinya?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area untuk perbaikan</label>
            <textarea
              required
              rows={3}
              value={formData.improvement}
              onChange={(e) => setFormData({ ...formData, improvement: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Apa yang bisa diperbaiki untuk hari esok?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating hari ini (1-5 bintang)</label>
            <select
              required
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Pilih rating</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Refleksi' : 'Simpan Refleksi'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], gratitude: '', achievement: '', challenge: '', improvement: '', mood: '', rating: '' });
                }}
                className="ml-4 px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Data Cards */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900">Riwayat Refleksi</h3>
        
        {reflections.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-amber-100">
            <BookOpen className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Belum ada refleksi harian. Mulai tulis refleksi pertama Anda!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reflections.map((reflection) => (
              <div key={reflection.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {new Date(reflection.date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex">{renderStars(reflection.rating)}</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Mood: <span className="font-medium">{reflection.mood}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(reflection)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reflection.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-green-800 mb-1">Rasa Syukur</h5>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{reflection.gratitude}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-blue-800 mb-1">Pencapaian</h5>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{reflection.achievement}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-orange-800 mb-1">Tantangan</h5>
                    <p className="text-gray-700 bg-orange-50 p-3 rounded-lg">{reflection.challenge}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-purple-800 mb-1">Area Perbaikan</h5>
                    <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">{reflection.improvement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}