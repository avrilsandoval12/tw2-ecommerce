import { Request, Response } from "express";
import { CategoryRepository } from "../repository/CategoryRepository";
import { CategoryService } from "../services/CategoryService";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export class CategoryController {
    static async getAll(req: Request, res: Response) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json({
                message: "Categories retrieved successfully",
                data: categories,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const category = await categoryService.getCategoryById(id);
            res.status(200).json({
                message: "Category retrieved successfully",
                data: category,
            });
        } catch (error) {
            console.error(error);
            res.status(404).json({
                message: "Category not found",
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const newCategory = await categoryService.createCategory(data);
            res.status(201).json({
                message: "Category created successfully",
                data: newCategory,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}
