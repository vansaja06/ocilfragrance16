// Mengimpor Router dan controller autentikasi
import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

// Membuat instance controller
const authController = new AuthController();

// Route POST /admin/login - Login admin (menerima email & password)
router.post("/admin/login", authController.login);

// Route POST /admin/register - Register admin baru (menerima name, email, password)
router.post("/admin/register", authController.register);

// Route POST /admin/logout - Logout admin (menghapus cookie token)
router.post("/admin/logout", authController.logout);

export default router;
