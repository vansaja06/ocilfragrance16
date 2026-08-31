// Mengimpor Router dan controller Subscriber
import { Router } from "express";
import SubscriberController from "../controllers/SubscriberController.js";

const router = Router();

// Membuat instance controller
const subscriberController = new SubscriberController();

// Route GET /subscribers - Mengambil semua subscriber
router.get("/subscribers", subscriberController.list);

// Route GET /subscribers/status - Mengecek status langganan berdasarkan email
router.get("/subscribers/status", subscriberController.checkStatus);

// Route POST /subscribers - Mendaftar sebagai subscriber baru
router.post("/subscribers", subscriberController.subscribe);

// Route PATCH /subscribers/:id/approve - Menyetujui subscriber (admin)
router.patch("/subscribers/:id/approve", subscriberController.approve);

// Route PATCH /subscribers/:id/reject - Menolak subscriber (admin)
router.patch("/subscribers/:id/reject", subscriberController.reject);

// Route PATCH /subscribers/cancel - Membatalkan langganan
router.patch("/subscribers/cancel", subscriberController.cancel);

export default router;
