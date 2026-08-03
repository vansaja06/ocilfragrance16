import { Router } from "express";
import StatsController from "../controllers/StatsController.js";

const router = Router();

const statsController = new StatsController();

router.get("/stats", statsController.summary);

export default router;
