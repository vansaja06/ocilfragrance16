// Mengimpor Router dan controller Pengaturan
import { Router } from "express";
import SettingController from "../controllers/SettingController.js";

const router = Router();

// Membuat instance controller
const settingController = new SettingController();

// Route GET /settings - Mengambil semua pengaturan toko
router.get("/settings", settingController.getAll);

// Route PUT /settings - Mengupdate pengaturan toko
router.put("/settings", settingController.update);

export default router;
