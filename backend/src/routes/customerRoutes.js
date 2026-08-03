import { Router } from "express";
import CustomerController from "../controllers/CustomerController.js";

const router = Router();

const customerController = new CustomerController();

router.get("/customers", customerController.list);
router.post("/customers", customerController.create);

export default router;
