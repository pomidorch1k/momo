import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit, Trash2, X, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, user } = useApp();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    stock: '',
    image: '',
    description: '',
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Доступ запрещен
          </h2>
          <p className="text-gray-600 mb-6">
            Эта страница доступна только администраторам
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        discount: product.discount?.toString() || '',
        stock: product.stock.toString(),
        image: product.image,
        description: product.description || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        discount: '',
        stock: '',
        image: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      discount: formData.discount ? parseFloat(formData.discount) : undefined,
      stock: parseInt(formData.stock),
      image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      description: formData.description,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Админ-панель</h1>
          <button
            onClick={() => openModal()}
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Добавить товар
          </button>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="font-semibold text-gray-800">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    {product.discount && (
                      <span className="text-red-600 font-semibold">
                        -{product.discount}%
                      </span>
                    )}
                    <span
                      className={`font-medium ${
                        product.stock === 0 ? 'text-blue-600' : 'text-green-600'
                      }`}
                    >
                      {product.stock === 0
                        ? 'Нет в наличии'
                        : `В наличии: ${product.stock} шт`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openModal(product)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:shadow-lg transition-all duration-300 active:scale-95"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Удалить товар "${product.name}"?`
                        )
                      ) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:shadow-lg transition-all duration-300 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center text-white mt-12">
            <p className="text-xl">Товары отсутствуют</p>
            <p className="text-sm opacity-80 mt-2">
              Нажмите кнопку "Добавить товар" чтобы создать новый товар
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название товара *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена (₽) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Скидка (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL изображения
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                >
                  {editingProduct ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
