import { IUserRepository } from "../repository/UserRepository";
import { User } from "../types/user.types";
import { AuthResponse } from "../types/auth.types";
import { hashPassword, checkPassword, generateToken } from "../utils/auth";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { BadRequestException } from "../exceptions/BadRequestException";
import { UserRole } from "@prisma/client";

export interface IAuthService {
    create(user: User): Promise<void>;
    login(email: string, password: string): Promise<AuthResponse>;
}

export class AuthService implements IAuthService {
    constructor(private readonly userRepository: IUserRepository) {}

    async create(user: User): Promise<void> {
        const { email, password } = user;
        const userExists = await this.userRepository.findByEmail(email);

        if (userExists) {
            throw new BadRequestException("El email ya esta registrado");
        }

        user.password = await hashPassword(password);

        try {
            await this.userRepository.createUser(user);
        } catch (e) {
            throw new Error(
                "Hubo un error al crear la cuenta, intente mas tarde"
            );
        }
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException("Email o contraseña incorrectos");
        }

        const isPasswordValid = await checkPassword(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Email o contraseña incorrectos");
        }

        const token = generateToken(user.id, user.email, user.role);

        return {
            token,
            user: {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                address: user.address,
                role: user.role,
            },
        };
    }
}
