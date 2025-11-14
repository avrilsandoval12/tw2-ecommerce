import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authGuard, isAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

router.post(
    "/", 
    authGuard, 
    isAdmin,   
    ProductController.create
);

router.put(
    "/:id", 
    authGuard,
    isAdmin,
    ProductController.update // Asegúrate de que este método exista en tu Controller
);

router.delete(
    "/:id", 
    authGuard,
    isAdmin,
    ProductController.delete // Asegúrate de que este método exista en tu Controller
);

export default router;
