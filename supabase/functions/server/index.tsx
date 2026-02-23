import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Проверка авторизации для защищенных маршрутов
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Регистрация пользователя
app.post('/make-server-d7366547/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Автоматически подтверждаем email, так как email-сервер не настроен
      email_confirm: true,
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Sign up error during request processing: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Получить все товары
app.get('/make-server-d7366547/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products });
  } catch (error) {
    console.log(`Error fetching products: ${error}`);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Инициализировать товар (публичный маршрут для первичной инициализации)
app.post('/make-server-d7366547/products/init', async (c) => {
  try {
    const { key, value } = await c.req.json();
    await kv.set(key, value);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error initializing product: ${error}`);
    return c.json({ error: 'Failed to initialize product' }, 500);
  }
});

// Добавить товар (только для админа)
app.post('/make-server-d7366547/products', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Проверка роли админа
    const userRole = await kv.get(`user_role:${user.id}`);
    if (userRole !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const product = await c.req.json();
    const productId = `product:${Date.now()}`;
    
    await kv.set(productId, product);

    return c.json({ id: productId, ...product });
  } catch (error) {
    console.log(`Error adding product: ${error}`);
    return c.json({ error: 'Failed to add product' }, 500);
  }
});

// Обновить товар (только для админа)
app.put('/make-server-d7366547/products/:id', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = await kv.get(`user_role:${user.id}`);
    if (userRole !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(productId);
    if (!existing) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const updated = { ...existing, ...updates };
    await kv.set(productId, updated);

    return c.json(updated);
  } catch (error) {
    console.log(`Error updating product: ${error}`);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Удалить товар (только для админа)
app.delete('/make-server-d7366547/products/:id', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = await kv.get(`user_role:${user.id}`);
    if (userRole !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    await kv.del(productId);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting product: ${error}`);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Получить корзину пользователя
app.get('/make-server-d7366547/cart', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const cart = await kv.get(`cart:${user.id}`) || [];
    return c.json({ cart });
  } catch (error) {
    console.log(`Error fetching cart: ${error}`);
    return c.json({ error: 'Failed to fetch cart' }, 500);
  }
});

// Обновить корзину
app.post('/make-server-d7366547/cart', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { cart } = await c.req.json();
    await kv.set(`cart:${user.id}`, cart);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error updating cart: ${error}`);
    return c.json({ error: 'Failed to update cart' }, 500);
  }
});

// Установить роль пользователя (для демо-целей)
app.post('/make-server-d7366547/set-role', async (c) => {
  try {
    const { userId, role } = await c.req.json();
    await kv.set(`user_role:${userId}`, role);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error setting user role: ${error}`);
    return c.json({ error: 'Failed to set role' }, 500);
  }
});

// Получить роль пользователя
app.get('/make-server-d7366547/role', async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ role: 'guest' });
    }

    const role = await kv.get(`user_role:${user.id}`) || 'user';
    return c.json({ role, userId: user.id });
  } catch (error) {
    console.log(`Error fetching role: ${error}`);
    return c.json({ error: 'Failed to fetch role' }, 500);
  }
});

Deno.serve(app.fetch);