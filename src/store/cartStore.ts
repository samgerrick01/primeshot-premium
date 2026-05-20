import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  selectedItems: Set<string>;
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
  toggleItemSelection: (itemId: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  removeSelectedItems: () => void;
  getSelectedTotal: () => number;
  getSelectedItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: new Set<string>(),
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
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.product_id !== productId,
          );
          const newSelectedItems = new Set(state.selectedItems);
          state.items.forEach((item) => {
            if (item.product_id === productId) {
              newSelectedItems.delete(item.id);
            }
          });
          return {
            items: newItems,
            selectedItems: newSelectedItems,
          };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item,
          ),
        }));
      },
      clearCart: () => set({ items: [], selectedItems: new Set<string>() }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      toggleItemSelection: (itemId) => {
        set((state) => {
          const newSelectedItems = new Set(state.selectedItems);
          if (newSelectedItems.has(itemId)) {
            newSelectedItems.delete(itemId);
          } else {
            newSelectedItems.add(itemId);
          }
          return { selectedItems: newSelectedItems };
        });
      },
      selectAllItems: () => {
        set((state) => ({
          selectedItems: new Set(state.items.map((item) => item.id)),
        }));
      },
      deselectAllItems: () => {
        set({ selectedItems: new Set<string>() });
      },
      removeSelectedItems: () => {
        set((state) => {
          const selectedIds = state.selectedItems;
          return {
            items: state.items.filter((item) => !selectedIds.has(item.id)),
            selectedItems: new Set<string>(),
          };
        });
      },
      getSelectedTotal: () => {
        const state = get();
        return state.items
          .filter((item) => state.selectedItems.has(item.id))
          .reduce(
            (total, item) => total + item.product.price * item.quantity,
            0,
          );
      },
      getSelectedItemCount: () => {
        const state = get();
        return state.items
          .filter((item) => state.selectedItems.has(item.id))
          .reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'primeshot-cart',
      partialize: (state) => ({
        ...state,
        selectedItems: Array.from(state.selectedItems),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as {
          items: CartItem[];
          selectedItems: string[];
        }),
        selectedItems: new Set<string>(
          (persistedState as { selectedItems: string[] }).selectedItems || [],
        ),
      }),
    },
  ),
);
