import { BadRequestException } from "../exceptions/BadRequestException";
import { ResourceNotFoundException } from "../exceptions/ResourceNotFoundException";
import { UserRepository } from "../repository/UserRepository";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { UpdateUserDTO } from "../types/user.types";

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

    static async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { name, lastname, address } = req.body;

            const updateData: UpdateUserDTO = {
                name,
                lastname,
                address,
            };

            const updatedUser = await userService.updateUser(
                userId,
                updateData
            );

            res.status(200).json({
                message: "Perfil actualizado exitosamente",
                data: updatedUser,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(400).json({ message: error.message });
            }

            if (error instanceof ResourceNotFoundException) {
                return res.status(404).json({ message: error.message });
            }

            console.error(error);
            res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }
}
