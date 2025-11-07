import { IProductRepository } from "../repository/ProductRepository";
import { Product, ProductDTO } from "../types/product.types";

export interface IProductService {
    getAllProducts(): Promise<Product[]>;
    getProductById(id: number): Promise<Product>;
    createProduct(data: ProductDTO): Promise<Product>;
}

export class ProductService implements IProductService {
    constructor(private readonly productRepository: IProductRepository) {}

    async getAllProducts(): Promise<Product[]> {
        return await this.productRepository.findAll();
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }

    async createProduct(data: ProductDTO): Promise<Product> {
        return await this.productRepository.createProduct(data);
    }
}
