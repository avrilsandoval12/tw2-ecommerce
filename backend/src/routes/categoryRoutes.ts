import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

const router = Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);

export default router;
