import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn, User, Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      
      if (isSignup) {
        if (!name.trim()) {
          setError('Введите ваше имя');
          setLoading(false);
          return;
        }
        success = await signup(email, password, name);
        if (!success) {
          setError('Не удалось зарегистрироваться. Возможно, пользователь уже существует.');
        }
      } else {
        success = await login(email, password);
        if (!success) {
          setError('Неверный email или пароль');
        }
      }

      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    navigate('/');
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {isSignup ? 'Регистрация' : 'Вход в систему'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isSignup
              ? 'Создайте аккаунт для использования всех функций'
              : 'Войдите, чтобы добавлять товары в корзину'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="Введите ваше имя"
                  required={isSignup}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="Введите email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="Введите пароль"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Подождите...' : isSignup ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300"
          >
            {isSignup ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleGuestMode}
            className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-300"
          >
            Продолжить как гость
          </button>
        </div>

        {!isSignup && (
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <p className="text-sm text-gray-700 font-semibold mb-2">
              Для создания админа:
            </p>
            <p className="text-xs text-gray-600">
              Зарегистрируйтесь, а затем обратитесь к администратору системы для назначения роли админа
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
