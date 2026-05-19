import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// ============================================================
// Types
// ============================================================

export interface Diameter {
  id: number;
  value: string;
  created_at: string;
}

export interface Grain {
  id: number;
  value: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: string;
  customer_email: string | null;
  customer_name: string | null;
  total: number;
  status: string;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Profile {
  id: number;
  uuid: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  banned: boolean;
  city: string;
  province: string;
  created_at?: string;
}

export interface DashboardData {
  orders: Order[];
  productCount: number;
  userCount: number;
}

// ============================================================
// Query Keys
// ============================================================

export const QUERY_KEYS = {
  diameters: ['diameters'] as const,
  grains: ['grains'] as const,
  categories: ['categories'] as const,
  orders: ['orders'] as const,
  orderItems: (orderId: number) => ['orderItems', orderId] as const,
  profiles: ['profiles'] as const,
  productsCount: ['productsCount'] as const,
  usersCount: ['usersCount'] as const,
  dashboard: ['dashboard'] as const,
} as const;

// ============================================================
// Dashboard
// ============================================================

async function fetchDashboardData(): Promise<DashboardData> {
  const [ordersRes, productCountRes, userCountRes] = await Promise.all([
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  if (ordersRes.error) throw ordersRes.error;

  return {
    orders: ordersRes.data || [],
    productCount: productCountRes.count || 0,
    userCount: userCountRes.count || 0,
  };
}

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: fetchDashboardData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

// ============================================================
// Orders
// ============================================================

async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: fetchOrders,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}

async function fetchOrderItems(orderId: number): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return data || [];
}

export function useOrderItems(orderId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.orderItems(orderId ?? 0),
    queryFn: () => fetchOrderItems(orderId!),
    enabled: orderId !== null,
    staleTime: 30_000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: number;
      newStatus: string;
    }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
    },
    onMutate: async ({ orderId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.orders });
      const previousOrders = queryClient.getQueryData<Order[]>(
        QUERY_KEYS.orders,
      );

      queryClient.setQueryData<Order[]>(QUERY_KEYS.orders, (old) =>
        old?.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(QUERY_KEYS.orders, context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

// ============================================================
// Diameters
// ============================================================

async function fetchDiameters(): Promise<Diameter[]> {
  const { data, error } = await supabase
    .from('diameters')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

export function useDiameters() {
  return useQuery({
    queryKey: QUERY_KEYS.diameters,
    queryFn: fetchDiameters,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useAddDiameter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: string) => {
      const { error } = await supabase.from('diameters').insert({ value });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diameters });
    },
  });
}

export function useDeleteDiameter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('diameters').delete().eq('id', id);
      if (error) {
        console.error('[adminQueries] deleteDiameter error:', error);
        if (error.message?.includes('foreign key constraint')) {
          throw new Error(
            'Cannot delete: This diameter is still being used by one or more products.',
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.diameters });
    },
  });
}

// ============================================================
// Profiles / Users
// ============================================================

async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return (data || []).map((p: any) => ({
    ...p,
    banned: p.banned === true,
  }));
}

export function useProfiles() {
  return useQuery({
    queryKey: QUERY_KEYS.profiles,
    queryFn: fetchProfiles,
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Profile>;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) {
        console.error('[adminQueries] deleteProfile error:', error);
        if (
          error.message?.includes('permission denied') ||
          error.message?.includes('policy')
        ) {
          throw new Error(
            'Permission denied: You do not have the required admin role to delete users. Make sure your profile has role="admin".',
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
    },
  });
}

// ============================================================
// Products
// ============================================================

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Record<string, any>) => {
      const { error } = await supabase.from('products').insert(product);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('[adminQueries] deleteProduct error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number | string;
      updates: Record<string, any>;
    }) => {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      if (error) {
        console.error('[adminQueries] updateProduct error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ============================================================
// Grains
// ============================================================

async function fetchGrains(): Promise<Grain[]> {
  const { data, error } = await supabase
    .from('grains')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

export function useGrains() {
  return useQuery({
    queryKey: QUERY_KEYS.grains,
    queryFn: fetchGrains,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useAddGrain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: string) => {
      const { error } = await supabase.from('grains').insert({ value });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grains });
    },
  });
}

export function useDeleteGrain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('grains').delete().eq('id', id);
      if (error) {
        console.error('[adminQueries] deleteGrain error:', error);
        if (error.message?.includes('foreign key constraint')) {
          throw new Error(
            'Cannot delete: This grain is still being used by one or more products.',
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grains });
    },
  });
}

// ============================================================
// Categories
// ============================================================

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: fetchCategories,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from('categories').insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        console.error('[adminQueries] deleteCategory error:', error);
        if (error.message?.includes('foreign key constraint')) {
          throw new Error(
            'Cannot delete: This category is still being used by one or more products.',
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}
