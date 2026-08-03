import { Router } from "express";
import OrderController from "../controllers/OrderController.js";

const router = Router();

const orderController = new OrderController();

router.get("/orders", orderController.list);
router.patch("/orders/:id/status", orderController.updateStatus);

export default router;
