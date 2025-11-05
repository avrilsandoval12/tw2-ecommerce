import { Router } from "express";
import { authGuard } from "../middlewares/auth";
import { UserController } from "../controllers/UserController";

const router = Router();

router.use(authGuard);

router.get("/profile", UserController.getProfile);

export default router;
