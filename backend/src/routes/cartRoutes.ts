import { Router } from "express";
import { CartController } from "../controllers/CartController";

const router = Router();

router.post("/validate", CartController.validateCart);

export default router;