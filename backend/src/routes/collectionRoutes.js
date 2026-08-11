import { Router } from "express";
import CollectionController from "../controllers/CollectionController.js";

const router = Router();

const collectionController = new CollectionController();

router.get("/collections", collectionController.get);
router.put("/collections", collectionController.update);

export default router;
