import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Image as ImageIcon,
  LayoutGrid,
  Settings,
  Crown,
  Percent,
  Zap,
} from "lucide-react";

export const menus = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Produk",
    href: "/admin/products",
    icon: Package,
  },

  {
    title: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingCart,
  },

  {
    title: "Pelanggan",
    href: "/admin/customers",
    icon: Users,
  },

  {
    title: "Subscriber",
    href: "/admin/subscribers",
    icon: Crown,
  },

  {
    title: "Diskon",
    href: "/admin/discounts",
    icon: Percent,
  },

  {
    title: "Limited Offer",
    href: "/admin/limited-offer",
    icon: Zap,
  },

  {
    title: "Kategori",
    href: "/admin/categories",
    icon: Tags,
  },

  {
    title: "Banner",
    href: "/admin/banner",
    icon: ImageIcon,
  },

  {
    title: "Collection",
    href: "/admin/collection",
    icon: LayoutGrid,
  },

  {
    title: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];
