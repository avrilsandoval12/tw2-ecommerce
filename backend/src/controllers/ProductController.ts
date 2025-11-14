import { Request, Response } from "express";
import { ProductRepository } from "../repository/ProductRepository";
import { ProductService } from "../services/ProductService";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

export class ProductController {
    static async getAll(req: Request, res: Response) {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json({
                message: "Products retrieved successfully",
                data: products,
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
            const product = await productService.getProductById(id);
            res.status(200).json({
                message: "Product retrieved successfully",
                data: product,
            });
        } catch (error) {
            console.error(error);
            res.status(404).json({
                message: "Product not found",
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const newProduct = await productService.createProduct(data);
            res.status(201).json({
                message: "Product created successfully",
                data: newProduct,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = req.body;

            const updatedProduct = await productService.updateProduct(id, data);

            if (!updatedProduct) {
                return res.status(404).json({
                    message: "Product not found for update",
                });
            }

            res.status(200).json({
                message: "Product updated successfully",
                data: updatedProduct,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error updating product",
            });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const result = await productService.deleteProduct(id);
            
            if (!result) {
                return res.status(404).json({
                    message: "Product not found for deletion",
                });
            }

            // Nota: Algunas APIs devuelven 204 (No Content) para delete exitoso sin body. 
            // Usamos 200/204 según la preferencia. Devolveremos 200 con un mensaje.
            res.status(200).json({
                message: "Product deleted successfully",
                data: result, // result podría ser el producto eliminado o un mensaje de confirmación
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error deleting product",
            });
        }
    }
}