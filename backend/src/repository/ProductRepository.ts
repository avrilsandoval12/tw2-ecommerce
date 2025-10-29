import {Product} from "../types/types";
import prisma from "../config/prisma";


export class ProductRepository {


    async findAllProducts(){
        return await prisma.product.findMany();
     }

    async findProductById(id: number){
        return await prisma.product.findUnique({
            where: {id}
        });
    }

    async createProduct(product: Product){
        return await prisma.product.create({
            data: product
        }); 

    }
    async updateProduct(id: number, product: Product){
        return await prisma.product.update({
            where: {id},
            data: product
        });
        }

        async deleteProduct(id: number){
            return await prisma.product.delete({
                where: {id}
            });
        }

    }
