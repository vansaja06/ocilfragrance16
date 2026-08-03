export type OrderStatus = "Menunggu" | "Diproses" | "Selesai" | "Dibatalkan";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  category?: string | Category | null;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  rating: number;
  sold: number;
  featured: boolean;
  sizes?: string[];
  createdAt?: string;
}

export interface OrderItem {
  product?: string | { _id: string; name: string; image?: string };
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  _id: string;
  invoice: string;
  customerName: string;
  customerEmail?: string;
  phone?: string;
  address?: string;
  items: OrderItem[];
  total: number;
  payment?: string;
  status: OrderStatus;
  createdAt?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt?: string;
}

export interface Banner {
  _id: string;
  subtitle?: string;
  title: string;
  description?: string;
  button?: string;
  image?: string;
  active: boolean;
  createdAt?: string;
}

export interface Settings {
  storeName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface Stats {
  revenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalCategories: number;
}
