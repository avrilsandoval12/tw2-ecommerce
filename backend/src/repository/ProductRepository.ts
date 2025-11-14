import prisma from "../config/prisma";
import { Product, ProductDTO } from "../types/product.types";

export interface IProductRepository {
    createProduct(data: ProductDTO): Promise<Product>;
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    update(id: number, data: Partial<ProductDTO>): Promise<Product | null>;
    delete(id: number): Promise<Product | null>;
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
    async update(id: number, data: Partial<ProductDTO>): Promise<Product | null> {
        try {
            const updatedProduct = await prisma.product.update({
                where: { id },
                data: {
                    // Solo actualizamos campos si vienen en data, y manejamos la conexión a category
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    imgurl: data.imgurl,
                    stock: data.stock,
                    category: data.categoryid ? { connect: { id: data.categoryid } } : undefined,
                },
            });

            return {
                ...updatedProduct,
                price: updatedProduct.price.toNumber(),
            };
        } catch (error) {
            // Manejamos el caso en que el ID no exista (P2025: Record to update not found)
            if (error instanceof Error && (error as any).code === 'P2025') {
                return null; // Devuelve null si el producto no se encuentra
            }
            throw error; // Lanza otros errores de Prisma/DB
        }
    }

    async delete(id: number): Promise<Product | null> {
        try {
            const deletedProduct = await prisma.product.delete({
                where: { id },
            });

            return {
                ...deletedProduct,
                price: deletedProduct.price.toNumber(),
            };
        } catch (error) {
            // Manejamos el caso en que el ID no exista (P2025: Record to delete not found)
            if (error instanceof Error && (error as any).code === 'P2025') {
                return null; // Devuelve null si el producto no se encuentra
            }
            throw error;
        }
    }
}
