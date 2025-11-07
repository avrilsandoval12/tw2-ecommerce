import { UserRepository } from "../repository/UserRepository";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
    static async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "No autorizado" });
            }
            const user = await userService.getUserById(userId);
            
            res.status(200).json({
                message: "Perfil obtenido exitosamente",
                data: user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }
}
