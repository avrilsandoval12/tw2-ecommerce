import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";
import { JwtPayload } from "../types/auth.types"; 
import { UserRole } from "@prisma/client"; 

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token) as JwtPayload | null; 

        if (!decoded) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.user = decoded; 

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado",
        });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.user || req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({
            message: "Acceso denegado. Se requiere un rol de administrador.",
        });
    }

    // El usuario es ADMIN
    next();
};