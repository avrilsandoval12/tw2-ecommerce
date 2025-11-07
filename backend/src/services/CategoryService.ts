import { ICategoryRepository } from "../repository/CategoryRepository";
import { Category, CategoryDTO } from "../types/category.types";

export interface ICategoryService {
    getAllCategories(): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category>;
    createCategory(data: CategoryDTO): Promise<Category>;
}

export class CategoryService implements ICategoryService {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async getAllCategories(): Promise<Category[]> {
        return await this.categoryRepository.findAll();
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }

    async createCategory(data: CategoryDTO): Promise<Category> {
        return await this.categoryRepository.createCategory(data);
    }
}
