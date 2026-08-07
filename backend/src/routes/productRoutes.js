import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const router = Router();

const productController = new ProductController();

router.get("/products", productController.list);
router.get("/products/slug/:slug", productController.getBySlug);
router.post("/products", productController.create);
router.put("/products/:id", productController.update);
router.delete("/products/:id", productController.remove);

export default router;
