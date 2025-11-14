import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { CategoryRepository } from "../repository/CategoryRepository";
import { BadRequestException } from "../exceptions/BadRequestException";
import { ResourceNotFoundException } from "../exceptions/ResourceNotFoundException";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export class CategoryController {
    static async getAll(req: Request, res: Response) {
        try {
            const categories = await categoryService.getAllCategories();
            
            res.status(200).json({
                message: "Categorías obtenidas exitosamente",
                data: categories,
            });
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            res.status(500).json({ 
                message: "Error interno del servidor" 
            });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const categoryId = parseInt(req.params.id);

            if (isNaN(categoryId)) {
                throw new BadRequestException("ID de categoría inválido");
            }

            const category = await categoryService.getCategoryById(categoryId);

            res.status(200).json({
                message: "Categoría obtenida exitosamente",
                data: category,
            });
        } catch (error) {
            if (error instanceof ResourceNotFoundException) {
                return res.status(404).json({ message: error.message });
            }
            if (error instanceof BadRequestException) {
                return res.status(400).json({ message: error.message });
            }
            console.error("Error al obtener categoría:", error);
            res.status(500).json({ 
                message: "Error interno del servidor" 
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { name, description } = req.body;

            if (!name) {
                throw new BadRequestException("El nombre de la categoría es obligatorio");
            }

            const newCategory = await categoryService.createCategory({
                name
            });

            res.status(201).json({
                message: "Categoría creada exitosamente",
                data: newCategory,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(400).json({ message: error.message });
            }
            console.error("Error al crear categoría:", error);
            res.status(500).json({ 
                message: "Error interno del servidor" 
            });
        }
    }
}
