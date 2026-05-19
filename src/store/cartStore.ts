import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    size?: string,
    color?: string,
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, size, color) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product_id === product.id &&
              item.size === size &&
              item.color === color,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product_id === product.id &&
                item.size === size &&
                item.color === color
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          const newItem: CartItem = {
            id: crypto.randomUUID(),
            product_id: product.id,
            product,
            quantity,
            size,
            color,
          };

          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'primeshot-cart',
    },
  ),
);
