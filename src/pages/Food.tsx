import React, { useState, useEffect } from 'react';
import { Plus, Utensils, Edit2, Trash2, Clock } from 'lucide-react';

interface Food {
  id: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  createdAt: string;
}

export default function Food() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    meal: 'breakfast' as const,
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('foods');
    if (stored) {
      setFoods(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('foods', JSON.stringify(foods));
  }, [foods]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setFoods(foods.map(food => 
        food.id === editingId 
          ? { 
              ...food, 
              ...formData, 
              calories: parseInt(formData.calories),
              protein: parseFloat(formData.protein),
              carbs: parseFloat(formData.carbs),
              fat: parseFloat(formData.fat)
            }
          : food
      ));
      setEditingId(null);
    } else {
      const newFood: Food = {
        id: Date.now().toString(),
        date: formData.date,
        meal: formData.meal,
        food: formData.food,
        calories: parseInt(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      setFoods([...foods, newFood]);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      meal: 'breakfast',
      food: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      notes: ''
    });
  };

  const handleEdit = (food: Food) => {
    setFormData({
      date: food.date,
      meal: food.meal,
      food: food.food,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
      notes: food.notes
    });
    setEditingId(food.id);
  };

  const handleDelete = (id: string) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);

  const getMealColor = (meal: string) => {
    switch (meal) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dinner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'snack': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-400 via-red-300 to-red-200 rounded-2xl p-8 text-center">
        <Utensils className="w-12 h-12 text-red-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-900 mb-2">Makanan</h1>
        <p className="text-red-700">Catat asupan makanan dan nutrisi harian</p>
      </div>

      {/* Nutrition Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-red-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Calories</p>
            <p className="text-2xl font-bold text-red-600">{totalCalories}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Protein</p>
            <p className="text-2xl font-bold text-blue-600">{totalProtein.toFixed(1)}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-yellow-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Carbs</p>
            <p className="text-2xl font-bold text-yellow-600">{totalCarbs.toFixed(1)}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-green-100">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Fat</p>
            <p className="text-2xl font-bold text-green-600">{totalFat.toFixed(1)}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-red-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Makanan' : 'Catat Makanan'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Makan</label>
            <select
              value={formData.meal}
              onChange={(e) => setFormData({ ...formData, meal: e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack' })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="breakfast">Sarapan</option>
              <option value="lunch">Makan Siang</option>
              <option value="dinner">Makan Malam</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Makanan</label>
            <input
              type="text"
              required
              value={formData.food}
              onChange={(e) => setFormData({ ...formData, food: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nasi goreng, ayam bakar, salad, dll."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kalori</label>
            <input
              type="number"
              required
              min="0"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="250"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="15.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Karbohidrat (g)</label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="45.2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lemak (g)</label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.fat}
              onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="8.3"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Catatan tentang makanan..."
            />
          </div>

          <div className="lg:col-span-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {editingId ? 'Update Makanan' : 'Catat Makanan'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ date: new Date().toISOString().split('T')[0], meal: 'breakfast', food: '', calories: '', protein: '', carbs: '', fat: '', notes: '' });
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-red-100 overflow-hidden">
        <div className="p-6 border-b border-red-100">
          <h3 className="text-xl font-semibold text-gray-900">Riwayat Makanan</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Waktu</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Makanan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kalori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Protein</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Karbo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lemak</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catatan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-red-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(food.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMealColor(food.meal)}`}>
                      {getMealIcon(food.meal)} {food.meal}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{food.food}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{food.calories} kcal</td>
                  <td className="px-6 py-4 text-gray-600">{food.protein}g</td>
                  <td className="px-6 py-4 text-gray-600">{food.carbs}g</td>
                  <td className="px-6 py-4 text-gray-600">{food.fat}g</td>
                  <td className="px-6 py-4 text-gray-600">{food.notes}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(food)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {foods.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data makanan. Mulai catat asupan makanan Anda!
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