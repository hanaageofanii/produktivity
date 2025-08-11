import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Edit2, Trash2, Calendar } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';
type Status = 'Planned' | 'In Progress' | 'Done';

interface Todo {
  id: string;
  task: string;
  priority: Priority;
  status: Status;
  category: string;
  dueDate: string;
  completed?: boolean;
}

interface FormData {
  task: string;
  priority: Priority;
  status: Status;
  category: string;
  dueDate: string;
}

export default function TodoLists(): JSX.Element {
  const API_BASE = 'http://localhost:4000/api/todos';

  const [todos, setTodos] = useState<Todo[]>([]);
  const [formData, setFormData] = useState<FormData>({
    task: '',
    priority: 'medium',
    status: 'Planned',
    category: '',
    dueDate: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_BASE, { signal: ac.signal });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        const data = await res.json();
        const mapped = (data as any[]).map((item) => ({
          id: item._id ?? item.id,
          task: item.task,
          priority: (item.priority ?? 'medium') as Priority,
          status: (item.status ?? 'Planned') as Status,
          category: item.category ?? '',
          dueDate: item.dueDate ? new Date(item.dueDate).toISOString().substring(0, 10) : '',
          completed: item.completed ?? false,
        }));
        if (mounted) setTodos(mapped);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError(err.message ?? 'Gagal memuat todos');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      task: formData.task.trim(),
      priority: formData.priority,
      status: formData.status,
      category: formData.category.trim(),
      dueDate: formData.dueDate || null,
    };

    try {
      if (editingId) {
        // preserve completed field when updating
        const existing = todos.find((t) => t.id === editingId);
        const body = { ...payload, completed: existing?.completed ?? false };

        const res = await fetch(`${API_BASE}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
        const updated = await res.json();

        setTodos((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? {
                  id: updated._id ?? editingId,
                  task: updated.task ?? body.task,
                  priority: (updated.priority ?? body.priority) as Priority,
                  status: (updated.status ?? body.status) as Status,
                  category: updated.category ?? body.category,
                  dueDate: updated.dueDate
                    ? new Date(updated.dueDate).toISOString().substring(0, 10)
                    : body.dueDate ?? '',
                  completed: updated.completed ?? body.completed,
                }
              : t
          )
        );

        setEditingId(null);
      } else {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, completed: false }),
        });

        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
        const saved = await res.json();

        const newTodo: Todo = {
          id: saved._id ?? saved.id,
          task: saved.task ?? payload.task,
          priority: (saved.priority ?? payload.priority) as Priority,
          status: (saved.status ?? payload.status) as Status,
          category: saved.category ?? payload.category,
          dueDate: saved.dueDate ? new Date(saved.dueDate).toISOString().substring(0, 10) : payload.dueDate ?? '',
          completed: saved.completed ?? false,
        };

        setTodos((prev) => [...prev, newTodo]);
      }

      setFormData({ task: '', priority: 'medium', status: 'Planned', category: '', dueDate: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Gagal mengirim data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (todo: Todo) => {
    setFormData({ task: todo.task, priority: todo.priority, status: todo.status, category: todo.category, dueDate: todo.dueDate });
    setEditingId(todo.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus task ini?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Gagal menghapus');
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const newCompleted = !todo.completed;

    // optimistic UI update
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)));

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH', // gunakan PATCH untuk partial update. Ganti ke PUT jika backend memerlukan seluruh object.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newCompleted }),
      });

      if (!res.ok) throw new Error(`Toggle failed: ${res.status}`);
      const updated = await res.json();

      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: updated.completed ?? newCompleted } : t)));
    } catch (err: any) {
      console.error(err);
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: todo.completed ?? false } : t)));
      setError(err.message ?? 'Gagal update status');
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 via-green-300 to-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-700 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-900 mb-2">To-Do Lists</h1>
        <p className="text-green-700">Kelola tugas dan aktivitas harian Anda</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>
      )}

      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{editingId ? 'Edit Task' : 'Tambah Task Baru'}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span">
            <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
            <input
              type="text"
              required
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Masukkan task..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Kategori..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="lg:col-span-4 flex items-center">
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {submitting ? (editingId ? 'Updating...' : 'Saving...') : editingId ? 'Update Task' : 'Tambah Task'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ task: '', priority: 'medium', status: 'Planned', category: '', dueDate: '' });
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
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-green-100 overflow-hidden">
        <div className="p-6 border-b border-green-100 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Daftar Tasks</h3>
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Task</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100">
              {todos.map((todo) => (
                <tr key={todo.id} className={`hover:bg-green-50 transition-colors ${todo.completed ? 'opacity-75' : ''}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleComplete(todo.id)} className="flex items-center">
                      {todo.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-green-600 transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{todo.task}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(todo.priority)}`}>{todo.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{todo.category}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {todo.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(todo.dueDate).toLocaleDateString('id-ID')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(todo)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(todo.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {todos.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Belum ada tasks. Tambahkan task pertama Anda!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
