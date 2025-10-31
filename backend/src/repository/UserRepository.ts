import { User } from "../types/user.types";
import prisma from "../config/prisma";

export interface IUserRepository {
    createUser(user: User);
    findByEmail(email: string);
    findById(id: number);
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
}
