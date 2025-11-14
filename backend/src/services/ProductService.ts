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
    async updateProduct(id: number, data: ProductDTO): Promise<Product | null> {
        // En el servicio, manejamos la lógica de negocio antes de llamar al repositorio.
        // Asumo que el repositorio tiene un método `update` que devuelve null si no encuentra el ID.
        const updatedProduct = await this.productRepository.update(id, data);
        
        // El Controller espera null o el producto actualizado.
        return updatedProduct; 
    }

    async deleteProduct(id: number): Promise<Product | null> {
        // Asumo que el repositorio tiene un método `delete` que devuelve el producto eliminado o null.
        const deletedProduct = await this.productRepository.delete(id);

        // El Controller espera null o el producto eliminado.
        return deletedProduct;
    }
}
