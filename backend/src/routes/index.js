import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use(adminRoutes);
router.use(healthRoutes);

export default router;
