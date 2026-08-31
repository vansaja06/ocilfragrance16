// Mengimpor Router dan controller Banner
import { Router } from "express";
import BannerController from "../controllers/BannerController.js";

const router = Router();

// Membuat instance controller
const bannerController = new BannerController();

// Route GET /banners - Mengambil semua banner
router.get("/banners", bannerController.list);

// Route GET /banners/active - Mengambil hanya banner yang aktif
router.get("/banners/active", bannerController.active);

// Route POST /banners - Membuat banner baru
router.post("/banners", bannerController.create);

// Route PUT /banners/:id - Mengupdate banner berdasarkan ID
router.put("/banners/:id", bannerController.update);

// Route DELETE /banners/:id - Menghapus banner berdasarkan ID
router.delete("/banners/:id", bannerController.remove);

export default router;
