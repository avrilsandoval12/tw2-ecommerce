export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    lastname: string;
    address: string;
    role: string;
}

export interface UserDTO {
    email: string;
    name: string;
    lastname: string;
    address: string;
    role: string;
}

export interface UpdateUserDTO {
    name?: string;
    lastname?: string;
    address?: string;
}
