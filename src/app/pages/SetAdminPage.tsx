import { useState } from 'react';
import { Shield } from 'lucide-react';
import { api } from '../lib/api';

export const SetAdminPage = () => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('admin');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.setRole(userId, role);
      setMessage(`Роль "${role}" успешно назначена пользователю ${userId}`);
      setUserId('');
    } catch (error) {
      setMessage('Ошибка: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Назначить роль
          </h1>
          <p className="text-gray-600 text-sm">
            Служебная страница для управления ролями пользователей
          </p>
        </div>

        <form onSubmit={handleSetRole} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID пользователя
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Введите ID пользователя"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              ID можно найти в консоли браузера после входа
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Роль
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="admin">Админ</option>
              <option value="user">Пользователь</option>
              <option value="guest">Гость</option>
            </select>
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded-xl text-sm ${
                message.includes('Ошибка')
                  ? 'bg-red-50 border border-red-200 text-red-600'
                  : 'bg-green-50 border border-green-200 text-green-600'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Применение...' : 'Назначить роль'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            Как найти ID пользователя:
          </p>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Войдите в аккаунт</li>
            <li>Откройте консоль браузера (F12)</li>
            <li>Введите: console.log(await supabase.auth.getUser())</li>
            <li>Скопируйте ID из вывода</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
