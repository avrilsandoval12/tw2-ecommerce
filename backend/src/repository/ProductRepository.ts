import prisma from "../config/prisma";
import { Product, ProductDTO } from "../types/product.types";

export interface IProductRepository {
    createProduct(data: ProductDTO): Promise<Product>;
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
}

export class ProductRepository implements IProductRepository {

    async createProduct(data: ProductDTO): Promise<Product> {
        const createdProduct = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                imgurl: data.imgurl,
                stock: data.stock,
                category: { connect: { id: data.categoryid } }
            }
        });

        return {
            ...createdProduct,
            price: createdProduct.price.toNumber(),
        };
    }

    async findAll(): Promise<Product[]> {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
        });

        return products.map(p => ({
            ...p,
            price: p.price.toNumber(),
        }));
    }

    async findById(id: number): Promise<Product | null> {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) return null;

        return {
            ...product,
            price: product.price.toNumber(),
        };
    }
}
