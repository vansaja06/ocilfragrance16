import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import healthRoutes from "./healthRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import customerRoutes from "./customerRoutes.js";
import bannerRoutes from "./bannerRoutes.js";
import collectionRoutes from "./collectionRoutes.js";
import settingRoutes from "./settingRoutes.js";
import statsRoutes from "./statsRoutes.js";
import subscriberRoutes from "./subscriberRoutes.js";
import discountRoutes from "./discountRoutes.js";
import limitedOfferRoutes from "./limitedOfferRoutes.js";

const router = Router();

router.use(adminRoutes);
router.use(healthRoutes);
router.use(productRoutes);
router.use(categoryRoutes);
router.use(orderRoutes);
router.use(customerRoutes);
router.use(bannerRoutes);
router.use(collectionRoutes);
router.use(settingRoutes);
router.use(statsRoutes);
router.use(subscriberRoutes);
router.use(discountRoutes);
router.use(limitedOfferRoutes);

export default router;
