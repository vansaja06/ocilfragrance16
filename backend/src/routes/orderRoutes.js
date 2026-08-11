import { Router } from "express";
import OrderController from "../controllers/OrderController.js";

const router = Router();

const orderController = new OrderController();

router.get("/orders", orderController.list);
router.get("/orders/:id", orderController.getById);
router.post("/orders", orderController.create);
router.patch("/orders/:id/status", orderController.updateStatus);

export default router;
