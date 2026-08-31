// Mengimpor Router dari Express dan semua file route modul
import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import healthRoutes from "./healthRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import customerRoutes from "./customerRoutes.js";
import bannerRoutes from "./bannerRoutes.js";
import collectionRoutes from "./collectionRoutes.js";
import settingRoutes from "./settingRoutes.js";
import statsRoutes from "./statsRoutes.js";
import subscriberRoutes from "./subscriberRoutes.js";
import discountRoutes from "./discountRoutes.js";
import limitedOfferRoutes from "./limitedOfferRoutes.js";

// Membuat router utama yang akan menggabungkan semua route modul
const router = Router();

// Menggabungkan semua route modul ke dalam router utama
// Semua route akan diakses dengan prefix /api (ditentukan di app.js)
router.use(adminRoutes);       // Route autentikasi admin (login, register, logout)
router.use(healthRoutes);      // Route health check (test koneksi database)
router.use(productRoutes);     // Route CRUD produk
router.use(categoryRoutes);    // Route CRUD kategori
router.use(orderRoutes);       // Route CRUD pesanan
router.use(customerRoutes);    // Route data pelanggan
router.use(bannerRoutes);      // Route CRUD banner
router.use(collectionRoutes);  // Route data koleksi produk
router.use(settingRoutes);     // Route pengaturan toko
router.use(statsRoutes);       // Route data statistik dashboard
router.use(subscriberRoutes);  // Route data subscriber/langganan
router.use(discountRoutes);    // Route CRUD diskon
router.use(limitedOfferRoutes);// Route data penawaran terbatas

// Mengekspor router utama
export default router;
