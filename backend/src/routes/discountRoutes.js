// Mengimpor Router dan controller Diskon
import { Router } from "express";
import DiscountController from "../controllers/DiscountController.js";

const router = Router();

// Membuat instance controller
const discountController = new DiscountController();

// Route GET /discounts - Mengambil semua diskon
router.get("/discounts", discountController.list);

// Route GET /discounts/active - Mengambil hanya diskon yang aktif
router.get("/discounts/active", discountController.active);

// Route GET /discounts/by-product - Mengambil diskon berdasarkan produk (?productId=...)
router.get("/discounts/by-product", discountController.byProduct);

// Route POST /discounts - Membuat diskon baru
router.post("/discounts", discountController.create);

// Route PUT /discounts/:id - Mengupdate diskon berdasarkan ID
router.put("/discounts/:id", discountController.update);

// Route DELETE /discounts/:id - Menghapus diskon berdasarkan ID
router.delete("/discounts/:id", discountController.remove);

export default router;
