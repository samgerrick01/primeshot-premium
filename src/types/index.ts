export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes?: string[];
  colors?: string[];
  details?: string[];
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  full_address?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  zipcode?: string;
  uuid?: string;
  role?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  created_at: string;
}

export type Theme = 'light' | 'dark';
