import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const checkPassword = async (
    inputPassword: string,
    hashPassword: string
) => {
    return await bcrypt.compare(inputPassword, hashPassword);
};

export const generateToken = (id: number, email: string, role: UserRole) => { 
    const token = jwt.sign(
        { id, email, role }, 
        process.env.JWT_SECRET || "secret", 
        {
            expiresIn: "1h",
        }
    );
    return token;
};


export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (error) {
        return null;
    }
};
