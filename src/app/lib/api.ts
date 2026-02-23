import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d7366547`;

export const api = {
  async getProducts() {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching products:', error);
      throw new Error(error.error || 'Failed to fetch products');
    }
    
    return response.json();
  },

  async signup(email: string, password: string, name: string) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error signing up:', error);
      throw new Error(error.error || 'Failed to sign up');
    }

    return response.json();
  },

  async addProduct(product: any, accessToken: string) {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error adding product:', error);
      throw new Error(error.error || 'Failed to add product');
    }
    
    return response.json();
  },

  async updateProduct(id: string, product: any, accessToken: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error updating product:', error);
      throw new Error(error.error || 'Failed to update product');
    }
    
    return response.json();
  },

  async deleteProduct(id: string, accessToken: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error deleting product:', error);
      throw new Error(error.error || 'Failed to delete product');
    }
    
    return response.json();
  },

  async getCart(accessToken: string) {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching cart:', error);
      throw new Error(error.error || 'Failed to fetch cart');
    }
    
    return response.json();
  },

  async updateCart(cart: any[], accessToken: string) {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ cart }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error updating cart:', error);
      throw new Error(error.error || 'Failed to update cart');
    }
    
    return response.json();
  },

  async getRole(accessToken: string) {
    const response = await fetch(`${API_URL}/role`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching role:', error);
      throw new Error(error.error || 'Failed to fetch role');
    }
    
    return response.json();
  },

  async setRole(userId: string, role: string) {
    const response = await fetch(`${API_URL}/set-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, role }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error setting role:', error);
      throw new Error(error.error || 'Failed to set role');
    }
    
    return response.json();
  },
};
