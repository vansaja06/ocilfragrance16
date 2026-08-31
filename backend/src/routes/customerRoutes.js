// Mengimpor Router dan controller Pelanggan
import { Router } from "express";
import CustomerController from "../controllers/CustomerController.js";

const router = Router();

// Membuat instance controller
const customerController = new CustomerController();

// Route GET /customers - Mengambil semua pelanggan
router.get("/customers", customerController.list);

// Route POST /customers - Membuat pelanggan baru
router.post("/customers", customerController.create);

export default router;
