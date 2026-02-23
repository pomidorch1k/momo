import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mb-6">
          Запрашиваемая страница не существует
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          <Home className="w-5 h-5" />
          На главную
        </button>
      </div>
    </div>
  );
};
