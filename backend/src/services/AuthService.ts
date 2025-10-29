import {IUserRepository} from "../repository/UserRepository";
import prisma from "../config/prisma";
import {User} from "../types/types";
import {hashPassword} from "../utils/auth";

export class AuthService {
    constructor(private readonly userRepository: IUserRepository) {}

    create = async (user : User) => {
        const {email,password} = user;
        const userExists = await prisma.user.findUnique({where: {email}});
        if(userExists){
            throw new Error("El email ya esta registrado");
        }

        user.password = await hashPassword(password);

        try{
            await this.userRepository.createUser(user)
        }catch (e){
            throw new Error("Hubo un error al crear la cuenta, intente mas tarde")
        }
    }
}