import { Router } from "express";
import SubscriberController from "../controllers/SubscriberController.js";

const router = Router();

const subscriberController = new SubscriberController();

router.get("/subscribers", subscriberController.list);
router.post("/subscribers", subscriberController.subscribe);

export default router;
