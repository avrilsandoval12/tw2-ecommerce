import {User} from "../types/types";
import prisma from "../config/prisma";

export interface IUserRepository {
    createUser(user: User);
}

export class UserRepository implements  IUserRepository {

    createUser(user: User) {
        return prisma.user.create({data: user});
    }
}