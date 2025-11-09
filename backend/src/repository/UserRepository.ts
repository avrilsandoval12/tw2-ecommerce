import { UpdateUserDTO, User, UserDTO } from "../types/user.types";
import prisma from "../config/prisma";

export interface IUserRepository {
    createUser(user: User);
    findByEmail(email: string);
    findById(id: number);
    updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO>;
}

export class UserRepository implements IUserRepository {
    async createUser(user: User) {
        return prisma.user.create({ data: user });
    }

    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: number) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO> {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.lastname && { lastname: data.lastname }),
                ...(data.address && { address: data.address }),
            },
        });

        return {
            email: updatedUser.email,
            name: updatedUser.name,
            lastname: updatedUser.lastname,
            address: updatedUser.address,
        };
    }
}
