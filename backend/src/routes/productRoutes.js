// Mengimpor Router dan controller Produk
import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const router = Router();

// Membuat instance controller
const productController = new ProductController();

// Route GET /products - Mengambil semua produk
router.get("/products", productController.list);

// Route GET /products/slug/:slug - Mengambil produk berdasarkan slug atau ID
router.get("/products/slug/:slug", productController.getBySlug);

// Route POST /products - Membuat produk baru
router.post("/products", productController.create);

// Route PUT /products/:id - Mengupdate produk berdasarkan ID
router.put("/products/:id", productController.update);

// Route DELETE /products/:id - Menghapus produk berdasarkan ID
router.delete("/products/:id", productController.remove);

export default router;
