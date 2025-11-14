export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    lastname: string;
    address: string;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
}

export interface UserDTO {
    email: string;
    name: string;
    lastname: string;
    address: string;
}

export interface UpdateUserDTO {
    name?: string;
    lastname?: string;
    address?: string;
}
