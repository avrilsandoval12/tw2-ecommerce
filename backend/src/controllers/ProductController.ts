import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

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


      static createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    let imageUrl = '';

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;
    }

    const newProduct = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        classification: productData.classification,
        imageUrl
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};


static updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let imageUrl = existingProduct.imageUrl;

    if (req.file) {

      if (existingProduct.imageUrl) {
        try {
    
          const oldImagePath = path.join(
            process.cwd(),
            existingProduct.imageUrl.replace(`${req.protocol}://${req.get('host')}`, '')
          );

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.warn('No se pudo eliminar la imagen anterior:', err);
        }
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/products/${req.file.filename}`;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        classification: productData.classification,
        imageUrl
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};




  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });

      if (product && product.imageUrl) {
        const imagePath = path.join(process.cwd(), product.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await prisma.product.delete({
        where: { id: parseInt(id) }
      });
      
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  };  
}