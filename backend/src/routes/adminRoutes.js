import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

const authController = new AuthController();

router.post("/admin/login", authController.login);
router.post("/admin/register", authController.register);
router.post("/admin/logout", authController.logout);

export default router;
