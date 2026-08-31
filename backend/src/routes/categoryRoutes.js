// Mengimpor Router dan controller Kategori
import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";

const router = Router();

// Membuat instance controller
const categoryController = new CategoryController();

// Route GET /categories - Mengambil semua kategori
router.get("/categories", categoryController.list);

// Route POST /categories - Membuat kategori baru
router.post("/categories", categoryController.create);

// Route DELETE /categories/:id - Menghapus kategori berdasarkan ID
router.delete("/categories/:id", categoryController.remove);

export default router;
