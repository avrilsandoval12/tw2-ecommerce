import { IUserRepository } from "../repository/UserRepository";
import { UserDTO } from "../types/user.types";

export interface IUserService {
    getUserById(id: number): Promise<UserDTO>;
}

export class UserService implements IUserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async getUserById(id: number): Promise<UserDTO> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        return {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            address: user.address,
        };
    }
}
