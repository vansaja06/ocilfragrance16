// Mengimpor Router dan controller Statistik
import { Router } from "express";
import StatsController from "../controllers/StatsController.js";

const router = Router();

// Membuat instance controller
const statsController = new StatsController();

// Route GET /stats - Mengambil ringkasan statistik dashboard
router.get("/stats", statsController.summary);

export default router;
