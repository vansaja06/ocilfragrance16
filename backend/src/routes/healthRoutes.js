// Mengimpor Router dan controller Health Check
import { Router } from "express";
import HealthController from "../controllers/HealthController.js";

const router = Router();

// Membuat instance controller
const healthController = new HealthController();

// Route GET /test-db - Menguji koneksi ke database MongoDB
router.get("/test-db", healthController.testDb);

export default router;
