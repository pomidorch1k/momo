import { Home, ShoppingCart, Settings, LogOut, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const { user, logout, cart } = useApp();
  const location = useLocation();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg border-t border-gray-200 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
              isActive('/')
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Главная</span>
          </Link>

          <Link
            to="/cart"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative ${
              isActive('/cart')
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Корзина</span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/admin')
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Админ</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-600 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-xs font-medium">Выход</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/login')
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <LogIn className="w-6 h-6" />
              <span className="text-xs font-medium">Вход</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
