export interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  stock: number;
  image: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}
