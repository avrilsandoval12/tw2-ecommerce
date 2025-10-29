import {Request, Response} from 'express';
import prisma from "../config/prisma";
import {UserRepository} from "../repository/UserRepository";
import {AuthService} from "../services/AuthService";

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

}