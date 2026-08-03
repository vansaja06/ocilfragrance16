import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Image as ImageIcon,
  Settings,
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
    title: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];
