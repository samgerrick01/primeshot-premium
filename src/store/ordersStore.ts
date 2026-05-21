import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface OrdersState {
  /** Timestamp (ms) of when the user last viewed the orders page */
  lastViewedAt: number | null;
  /** Unviewed order count (cached after fetch) */
  unviewedCount: number;
  /** Whether we've fetched the count */
  fetched: boolean;
  /** Set last viewed timestamp */
  markViewed: () => void;
  /** Fetch & store the count of orders created after lastViewedAt */
  fetchUnviewedCount: (userId: string) => Promise<void>;
  /** Reset (e.g. on sign out) */
  reset: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      lastViewedAt: null,
      unviewedCount: 0,
      fetched: false,

      markViewed: () => {
        set({ lastViewedAt: Date.now(), unviewedCount: 0 });
      },

      fetchUnviewedCount: async (userId: string) => {
        const { lastViewedAt } = get();
        let query = supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (lastViewedAt) {
          const date = new Date(lastViewedAt).toISOString();
          query = query.gt('created_at', date);
        }

        const { count, error } = await query;

        if (!error) {
          set({ unviewedCount: count ?? 0, fetched: true });
        } else {
          console.error('[ordersStore] fetchUnviewedCount error:', error);
          set({ fetched: true });
        }
      },

      reset: () => {
        set({ lastViewedAt: null, unviewedCount: 0, fetched: false });
      },
    }),
    {
      name: 'orders-storage',
      partialize: (state) => ({ lastViewedAt: state.lastViewedAt }),
    },
  ),
);
