import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export const HomePage = () => {
  const { products } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Каталог товаров
        </h1>

        <div className="grid gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center text-white mt-12">
            <p className="text-xl">Товары отсутствуют</p>
            <p className="text-sm opacity-80 mt-2">
              Админ может добавить товары в админ-панели
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
