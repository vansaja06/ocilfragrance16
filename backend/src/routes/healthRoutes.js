import { Router } from "express";
import HealthController from "../controllers/HealthController.js";

const router = Router();

const healthController = new HealthController();

router.get("/test-db", healthController.testDb);

export default router;
