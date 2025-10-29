import { Router } from 'express';
import {AuthController} from "../controllers/AuthController";
import {body} from 'express-validator';
import {handleInputError} from "../middlewares/validation";

const router = Router();

router.post('/register',
    body("name")
        .notEmpty().withMessage("El nombre es obligatorio"),
    body("lastname")
        .notEmpty().withMessage("El apellido es obligatorio"),
    body("address")
        .notEmpty().withMessage("La direccion es obligatorio"),
    body('email')
        .isEmail().withMessage("Email no valido"),
    body("password")
        .isLength({min: 8}).withMessage("El password debe contener al menos 8 caracteres"),
    handleInputError,
    AuthController.createAccount
);

export default router;