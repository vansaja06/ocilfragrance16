import { Router } from "express";
import DiscountController from "../controllers/DiscountController.js";

const router = Router();

const discountController = new DiscountController();

router.get("/discounts", discountController.list);
router.get("/discounts/active", discountController.active);
router.get("/discounts/by-product", discountController.byProduct);
router.post("/discounts", discountController.create);
router.put("/discounts/:id", discountController.update);
router.delete("/discounts/:id", discountController.remove);

export default router;
