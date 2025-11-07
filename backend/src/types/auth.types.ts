import { UserDTO } from "./user.types";

export interface AuthResponse {
    token: string;
    user: UserDTO;
}

export interface JwtPayload {
    id: number;
    email: string;
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