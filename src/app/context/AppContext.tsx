import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Product, CartItem, User } from '../types';
import { api } from '../lib/api';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Смартфон Pro X',
    price: 89990,
    discount: 15,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1764744334719-22edc4099b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZ2FkZ2V0JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE2MTc2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Флагманский смартфон с продвинутой камерой',
  },
  {
    id: '2',
    name: 'Ноутбук Ultra',
    price: 129990,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1vZGVybnxlbnwxfHx8fDE3NzE1NzcwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Мощный ноутбук для работы и игр',
  },
  {
    id: '3',
    name: 'Наушники AirMax',
    price: 24990,
    discount: 20,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1640300065113-738f2abb8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW8lMjB3aXJlbGVzc3xlbnwxfHx8fDE3NzE2NjYwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Беспроводные наушники с шумоподавлением',
  },
  {
    id: '4',
    name: 'Камера Pro 4K',
    price: 79990,
    discount: 10,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzE1OTE0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Профессиональная камера для фото и видео',
  },
  {
    id: '5',
    name: 'Смарт-часы Fit',
    price: 19990,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1665860455418-017fa50d29bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwZml0bmVzcyUyMHRyYWNrZXJ8ZW58MXx8fHwxNzcxNjQxNTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Фитнес-трекер с мониторингом здоровья',
  },
  {
    id: '6',
    name: 'Планшет Tab Pro',
    price: 59990,
    discount: 25,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1769603795371-ad63bd85d524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBkaWdpdGFsfGVufDF8fHx8MTc3MTY1NzgwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Планшет для творчества и развлечений',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>('');

  // Инициализация - проверка сессии и загрузка данных
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Проверяем сессию пользователя
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          setAccessToken(session.access_token);
          
          // Получаем роль пользователя
          const { role, userId } = await api.getRole(session.access_token);
          setUser({
            id: userId,
            username: session.user.email || 'User',
            role: role,
          });

          // Загружаем корзину пользователя
          try {
            const { cart: userCart } = await api.getCart(session.access_token);
            setCart(userCart);
          } catch (error) {
            console.error('Failed to load cart:', error);
          }
        }

        // Загружаем товары
        try {
          const { products: serverProducts } = await api.getProducts();
          
          if (serverProducts.length === 0) {
            // Если товаров нет, инициализируем начальными данными
            console.log('Initializing products with default data');
            
            // Сохраняем начальные товары в базу данных
            const savePromises = initialProducts.map(product =>
              fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-d7366547/products/init`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${publicAnonKey}`,
                  },
                  body: JSON.stringify({ key: `product:${product.id}`, value: product }),
                }
              ).catch(err => console.error('Failed to save product:', product.name, err))
            );
            
            await Promise.all(savePromises);
            
            setProducts(initialProducts);
          } else {
            setProducts(serverProducts);
          }
        } catch (error) {
          console.error('Failed to load products, using defaults:', error);
          setProducts(initialProducts);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Синхронизация корзины с сервером
  useEffect(() => {
    if (user && accessToken && cart.length > 0) {
      api.updateCart(cart, accessToken).catch((error) => {
        console.error('Failed to sync cart:', error);
      });
    }
  }, [cart, user, accessToken]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!accessToken) return;

    try {
      const newProduct = await api.addProduct(product, accessToken);
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Не удалось добавить товар');
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      if (accessToken) {
        await api.updateProduct(id, updatedProduct, accessToken);
      }
      setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)));
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Не удалось обновить товар');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!accessToken) return;

    try {
      await api.deleteProduct(id, accessToken);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Не удалось удалить товар');
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;

    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        updateProduct(product.id, { stock: product.stock - 1 });
      }
    } else {
      setCart([...cart, { product, quantity: 1 }]);
      updateProduct(product.id, { stock: product.stock - 1 });
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((item) => item.product.id === productId);
    if (item) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        updateProduct(productId, { stock: product.stock + item.quantity });
      }
      setCart(cart.filter((item) => item.product.id !== productId));
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const item = cart.find((item) => item.product.id === productId);
    const product = products.find((p) => p.id === productId);

    if (!item || !product) return;

    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    const diff = quantity - item.quantity;
    const newStock = product.stock - diff;

    if (newStock < 0) return;

    updateProduct(productId, { stock: newStock });
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.product.id);
      if (product) {
        updateProduct(item.product.id, { stock: product.stock + item.quantity });
      }
    });
    setCart([]);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        console.error('Login error:', error);
        return false;
      }

      setAccessToken(data.session.access_token);

      // Получаем роль пользователя
      const { role, userId } = await api.getRole(data.session.access_token);
      setUser({
        id: userId,
        username: email,
        role: role,
      });

      // Загружаем корзину
      try {
        const { cart: userCart } = await api.getCart(data.session.access_token);
        setCart(userCart);
      } catch (error) {
        console.error('Failed to load cart after login:', error);
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return false;
      }

      if (data.user) {
        // Устанавливаем роль по умолчанию
        await api.setRole(data.user.id, 'user');
        
        // Логируем ID для установки админа
        console.log('🎉 Регистрация успешна! ID пользователя:', data.user.id);
        console.log('Чтобы сделать этого пользователя админом, перейдите на /set-admin');
        
        // Автоматически входим после регистрации
        return await login(email, password);
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken('');
      clearCart();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        user,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};