import { Router } from "express";
import LimitedOfferController from "../controllers/LimitedOfferController.js";

const router = Router();

const limitedOfferController = new LimitedOfferController();

router.get("/limited-offers", limitedOfferController.get);
router.put("/limited-offers", limitedOfferController.update);

export default router;
