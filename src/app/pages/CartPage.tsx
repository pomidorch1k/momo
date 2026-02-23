import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, user } = useApp();
  const navigate = useNavigate();

  if (user?.role === 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto text-purple-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Войдите в аккаунт
          </h2>
          <p className="text-gray-600 mb-6">
            Гости могут только просматривать товары. Войдите или зарегистрируйтесь, чтобы добавлять товары в корзину.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Корзина</h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300"
            >
              Очистить
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Корзина пуста
            </h2>
            <p className="text-gray-600 mb-6">
              Добавьте товары из каталога
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Перейти к покупкам
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              const finalPrice = item.product.discount
                ? item.product.price * (1 - item.product.discount / 100)
                : item.product.price;

              return (
                <div
                  key={item.product.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.product.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-bold text-lg text-gray-900">
                          {finalPrice.toLocaleString('ru-RU')} ₽
                        </span>
                        {item.product.discount && (
                          <span className="text-xs font-semibold text-red-600">
                            -{item.product.discount}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 shadow-md">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:shadow-lg transition-all duration-300 active:scale-95"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= item.product.stock + item.quantity}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:shadow-lg transition-all duration-300 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Итого */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  Итого:
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
