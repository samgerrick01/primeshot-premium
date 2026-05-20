import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

/** Map DB row (snake_case) to our Product interface (camelCase) */
function mapProduct(row: Record<string, unknown>): Product {
  // Safely extract images - handles TEXT[], JSON, or single string
  const rawImages = row.images;
  let images: string[] = [];

  if (Array.isArray(rawImages)) {
    images = rawImages.filter(
      (url): url is string => typeof url === 'string' && url.length > 0,
    );
  } else if (typeof rawImages === 'string') {
    // Single string URL or JSON array string
    try {
      const parsed = JSON.parse(rawImages);
      images = Array.isArray(parsed) ? parsed : [rawImages];
    } catch {
      images = rawImages ? [rawImages] : [];
    }
  }

  return {
    id: String(row.id),
    name: (row.product_name as string) || '',
    description: (row.description as string) || '',
    price: Number(row.price) || 0,
    images,
    category: (row.category as string) || '',
    stock: Number(row.stocks) || 0,
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    featured: Boolean(row.featured),
    created_at: (row.created_at as string) || '',
    grains: (row.grains as string) || undefined,
    diameter: (row.diameter as string) || undefined,
  };
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapProduct);
    },
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);

      if (error) throw error;
      return (data || []).map(mapProduct);
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return mapProduct(data as Record<string, unknown>);
    },
    enabled: !!id,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    enabled: !!category,
  });
}

export function useCategoryCounts() {
  return useQuery<Record<string, number>>({
    queryKey: ['products', 'category-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category');

      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((row) => {
        const category = row.category as string;
        counts[category] = (counts[category] || 0) + 1;
      });

      return counts;
    },
  });
}
