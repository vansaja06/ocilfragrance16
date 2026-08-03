import { Router } from "express";
import SettingController from "../controllers/SettingController.js";

const router = Router();

const settingController = new SettingController();

router.get("/settings", settingController.getAll);
router.put("/settings", settingController.update);

export default router;
