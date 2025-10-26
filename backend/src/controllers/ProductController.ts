import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
  
  static getProducts = async (req: Request, res: Response) => {
    try {
      const { classification } = req.query;

      const products = await prisma.product.findMany({
        where: classification ? {
          classification: classification as string
        } : {}
      });

      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  };

  static getClassifications = async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany({
        select: {
          classification: true
        },
        distinct: ['classification']
      });

      const classifications = products.map(p => p.classification);
      res.json(classifications);
    } catch (error) {
      console.error('Error al obtener clasificaciones:', error);
      res.status(500).json({ error: 'Error al obtener clasificaciones' });
    }
  };
  static getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  };
}