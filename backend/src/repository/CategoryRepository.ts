import prisma from "../config/prisma";
import { Category, CategoryDTO } from "../types/category.types";

export interface ICategoryRepository {
    createCategory(data: CategoryDTO): Promise<Category>;
    findAll(): Promise<Category[]>;
    findById(id: number): Promise<Category | null>;
}

export class CategoryRepository implements ICategoryRepository {

    async createCategory(data: CategoryDTO): Promise<Category> {
        return await prisma.category.create({
            data,
        });
    }

    async findAll(): Promise<Category[]> {
        return await prisma.category.findMany();
    }

    async findById(id: number): Promise<Category | null> {
        return await prisma.category.findUnique({
            where: { id },
        });
    }
}
