import { UpdateUserDTO, User, UserDTO } from "../types/user.types";
import prisma from "../config/prisma";

export interface IUserRepository {
    createUser(user: User);
    findByEmail(email: string);
    findById(id: number);
    updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO>;
    saveResetToken(id: number, token: string, expires: Date);
    clearResetToken(id: number);
    findByResetToken(token: string);
    updatePasswordAndClearToken(id: number, passwordHash: string);
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

    async saveResetToken(id: number, token: string, expires: Date) {
        return prisma.user.update({
            where: { id },
            data: {
                passwordResetToken: token,
                passwordResetExpires: expires,
            },
        });
    }

    async clearResetToken(id: number) {
        return prisma.user.update({
            where: { id },
            data: {
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
    }

    async findByResetToken(token: string) {
        return await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date(), 
                },
            },
        });
    }

async updatePasswordAndClearToken(id: number, passwordHash: string) {
        return prisma.user.update({
            where: { id },
            data: {
                password: passwordHash,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
    }

}
