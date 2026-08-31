// Mengimpor Router dan controller Koleksi
import { Router } from "express";
import CollectionController from "../controllers/CollectionController.js";

const router = Router();

// Membuat instance controller
const collectionController = new CollectionController();

// Route GET /collections - Mengambil data koleksi produk yang aktif
router.get("/collections", collectionController.get);

// Route PUT /collections - Mengupdate data koleksi produk
router.put("/collections", collectionController.update);

export default router;
