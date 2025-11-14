import { UserDTO } from "./user.types";
import { UserRole } from "@prisma/client";

export interface AuthResponse {
    token: string;
    user: UserDTO;
}

export interface JwtPayload {
    id: number;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}