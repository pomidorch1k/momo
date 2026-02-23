import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, user } = useApp();

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    if (user?.role !== 'guest' && product.stock > 0) {
      addToCart(product);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex gap-3 p-3">
        {/* Картинка слева */}
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Информация справа */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              {/* Цена */}
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-gray-900">
                  {finalPrice.toLocaleString('ru-RU')} ₽
                </span>
                {product.discount && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </div>

              {/* Скидка (красный) */}
              {product.discount && (
                <div className="inline-block mt-1">
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    -{product.discount}%
                  </span>
                </div>
              )}

              {/* Количество в наличии */}
              <div className="mt-1">
                {product.stock === 0 ? (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Нет в наличии
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">
                    В наличии: {product.stock} шт
                  </span>
                )}
              </div>
            </div>

            {/* Кнопка добавить в корзину */}
            {user?.role !== 'guest' && (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  product.stock === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
