// Mengimpor Router dan controller Penawaran Terbatas
import { Router } from "express";
import LimitedOfferController from "../controllers/LimitedOfferController.js";

const router = Router();

// Membuat instance controller
const limitedOfferController = new LimitedOfferController();

// Route GET /limited-offers - Mengambil data penawaran terbatas saat ini
router.get("/limited-offers", limitedOfferController.get);

// Route PUT /limited-offers - Mengupdate data penawaran terbatas
router.put("/limited-offers", limitedOfferController.update);

export default router;
