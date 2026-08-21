import { Router } from "express";
import SubscriberController from "../controllers/SubscriberController.js";

const router = Router();

const subscriberController = new SubscriberController();

router.get("/subscribers", subscriberController.list);
router.get("/subscribers/status", subscriberController.checkStatus);
router.post("/subscribers", subscriberController.subscribe);
router.patch("/subscribers/:id/approve", subscriberController.approve);
router.patch("/subscribers/:id/reject", subscriberController.reject);
router.patch("/subscribers/cancel", subscriberController.cancel);

export default router;
