import { ORDER_STATUS, THEME } from '@/constants/enums';

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
  grains?: string;
  diameter?: string;
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
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
  shipping_address: Address;
  payment_receipt_url?: string;
  tracking_number?: string;
  courier_service?: string;
  created_at: string;
  updated_at?: string;
  payment_verified_at?: string;
}

export interface PaymentSession {
  order_id: string;
  expires_at: string;
  created_at: string;
}

export type Theme = (typeof THEME)[keyof typeof THEME];
