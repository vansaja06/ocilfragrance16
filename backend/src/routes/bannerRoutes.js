import { Router } from "express";
import BannerController from "../controllers/BannerController.js";

const router = Router();

const bannerController = new BannerController();

router.get("/banners", bannerController.list);
router.get("/banners/active", bannerController.active);
router.post("/banners", bannerController.create);
router.put("/banners/:id", bannerController.update);
router.delete("/banners/:id", bannerController.remove);

export default router;
