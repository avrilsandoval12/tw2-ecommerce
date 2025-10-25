import { Request, Response } from "express";
import { UserRepository } from "../repository/UserRepository";
import { AuthService } from "../services/AuthService";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { BadRequestException } from "../exceptions/BadRequestException";

const authRepository = new UserRepository();
const authService = new AuthService(authRepository);

export class AuthController {

    static createAccount = async (req: Request, res : Response) => {
        try{
            const user = req.body;
            await authService.create(user);
            res.status(201).json({message: "Cuenta creada correctamente!"})
        }catch(err){
            res.status(500).json({error: err.message})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);

            res.status(200).json({
                message: "Login exitoso",
                data: result,
            });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                return res.status(401).json({
                    message: error.message,
                });
            }

            return res.status(500).json({
                message: "Error inesperado, intente nuevamente",
            });
        }
    };
}