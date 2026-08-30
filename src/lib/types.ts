export type OrderStatus = "Menunggu" | "Diproses" | "Selesai" | "Dibatalkan";

export type SubscriberStatus = "Menunggu" | "Disetujui" | "Ditolak" | "Berhenti";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export interface DecantOption {
  size: string;
  price: number;
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  category?: string | Category | null;
  description?: string;
  longDescription?: string;
  price: number;
  image?: string;
  stock: number;
  rating: number;
  sold: number;
  featured: boolean;
  hasDecant?: boolean;
  decants?: DecantOption[];
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
  paymentProof?: string;
  shipping?: string;
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

export interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  payment?: string;
  paymentProof?: string;
  status: SubscriberStatus;
  expiresAt?: string;
  source?: string;
  createdAt?: string;
}

export interface Discount {
  _id: string;
  name: string;
  percentage: number;
  productId?: string | Product | null;
  active: boolean;
  createdAt?: string;
}

export interface Banner {
  _id: string;
  product?: string | Pick<Product, "_id" | "name" | "slug" | "price" | "image"> | null;
  subtitle?: string;
  title: string;
  description?: string;
  button?: string;
  image?: string;
  active: boolean;
  createdAt?: string;
}

export interface Collection {
  _id: string;
  leftProduct?: Product | null;
  topRightProduct?: Product | null;
  bottomLeftProduct?: Product | null;
  active: boolean;
  createdAt?: string;
}

export interface LimitedOffer {
  _id: string;
  product?: Product | null;
  label: string;
  discountText: string;
  description: string;
  buttonText: string;
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
  qrisImage?: string;
  bankAccount?: string;
}

export interface Stats {
  revenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalCategories: number;
}
