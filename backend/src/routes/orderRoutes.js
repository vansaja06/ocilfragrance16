// Mengimpor Router dan controller Pesanan
import { Router } from "express";
import OrderController from "../controllers/OrderController.js";

const router = Router();

// Membuat instance controller
const orderController = new OrderController();

// Route GET /orders - Mengambil semua pesanan (?limit= untuk batas jumlah)
router.get("/orders", orderController.list);

// Route GET /orders/:id - Mengambil detail pesanan berdasarkan ID
router.get("/orders/:id", orderController.getById);

// Route POST /orders - Membuat pesanan baru
router.post("/orders", orderController.create);

// Route PATCH /orders/:id/status - Mengupdate status pesanan
router.patch("/orders/:id/status", orderController.updateStatus);

export default router;
