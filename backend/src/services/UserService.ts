import { BadRequestException } from "../exceptions/BadRequestException";
import { ResourceNotFoundException } from "../exceptions/ResourceNotFoundException";
import { IUserRepository } from "../repository/UserRepository";
import { UpdateUserDTO, UserDTO } from "../types/user.types";

export interface IUserService {
    getUserById(id: number): Promise<UserDTO>;
    updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO>;
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

    async updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO> {
        if (!data.name && !data.lastname && !data.address) {
            throw new BadRequestException(
                "Ingrese al menos un campo para actualizar"
            );
        }

        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }

        this.validateData(data);

        return await this.userRepository.updateUser(id, data);
    }

    private validateData(data: UpdateUserDTO): void {
        if (data.name !== undefined) {
            if (!data.name || data.name.trim().length < 2) {
                throw new BadRequestException(
                    "El nombre debe tener al menos 2 caracteres"
                );
            }
        }

        if (data.lastname !== undefined) {
            if (!data.lastname || data.lastname.trim().length < 2) {
                throw new BadRequestException(
                    "El apellido debe tener al menos 2 caracteres"
                );
            }
        }

        if (data.address !== undefined) {
            if (!data.address || data.address.trim().length < 5) {
                throw new BadRequestException(
                    "La dirección debe tener al menos 5 caracteres"
                );
            }
        }
    }
}
