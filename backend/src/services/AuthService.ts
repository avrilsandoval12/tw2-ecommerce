import { IUserRepository } from "../repository/UserRepository";
import { User } from "../types/user.types";
import { AuthResponse } from "../types/auth.types";
import { hashPassword, checkPassword, generateToken } from "../utils/auth";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { BadRequestException } from "../exceptions/BadRequestException";
import * as crypto from 'crypto'; // Importar crypto
import { sendEmail } from '../utils/email'; // Importar email util
import { ResourceNotFoundException } from "../exceptions/ResourceNotFoundException"
import { UserRole } from "@prisma/client";

export interface IAuthService {
    create(user: User): Promise<void>;
    login(email: string, password: string): Promise<AuthResponse>;
    requestPasswordReset(email: string, frontendBaseUrl: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}

export class AuthService implements IAuthService {
    constructor(private readonly userRepository: IUserRepository) {}

    async create(user: User): Promise<void> {
        const { email, password } = user;
        const userExists = await this.userRepository.findByEmail(email);
        

        if (userExists) {
            throw new BadRequestException("El email ya está registrado");
        }

        user.password = await hashPassword(password);

        try {
            await this.userRepository.createUser(user);
        } catch (e) {
            throw new Error(
                "Hubo un error al crear la cuenta, intente más tarde"
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
    async requestPasswordReset(email: string, frontendBaseUrl: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
 
            throw new ResourceNotFoundException("No existe un usuario con ese email");
        }


        const resetToken = crypto.randomBytes(32).toString('hex');

 
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        
        await this.userRepository.saveResetToken(user.id, passwordResetToken, passwordResetExpires);

        
        const resetUrl = `${frontendBaseUrl}/reset-password/${resetToken}`;


        try {
            await sendEmail({
                to: user.email,
                subject: 'Restablecimiento de Contraseña - Tu E-commerce',
                text: `Recibiste esto porque solicitaste un restablecimiento de contraseña. Por favor, haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso: \n\n ${resetUrl} \n\n Si no solicitaste esto, ignora este email.`,
                html: `<p>Recibiste esto porque solicitaste un restablecimiento de contraseña.</p>
                       <p>Por favor, haz clic en el siguiente enlace para completar el proceso:</p>
                       <a href="${resetUrl}">${resetUrl}</a>
                       <p>Si no solicitaste esto, ignora este email.</p>`,
            });
        } catch (error) {
            
            await this.userRepository.clearResetToken(user.id);
            throw new Error("Error al enviar el email de restablecimiento. Intente de nuevo.");
        }
}
async resetPassword(token: string, newPassword: string): Promise<void> {
       
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        
        const user = await this.userRepository.findByResetToken(hashedToken);

        if (!user) {
            throw new BadRequestException("Token inválido o expirado");
        }

        
        const passwordHash = await hashPassword(newPassword);

        await this.userRepository.updatePasswordAndClearToken(user.id, passwordHash);
    }


}
