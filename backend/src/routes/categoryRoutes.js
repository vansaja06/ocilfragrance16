import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";

const router = Router();

const categoryController = new CategoryController();

router.get("/categories", categoryController.list);
router.post("/categories", categoryController.create);
router.delete("/categories/:id", categoryController.remove);

export default router;
