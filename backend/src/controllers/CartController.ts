// src/controllers/CartController.ts
import { Request, Response } from "express";
import { CartValidationService } from "../services/CartService";
import { ProductRepository } from "../repository/ProductRepository";
import { CartValidationRequest } from "../types/cart.types";

const productRepository = new ProductRepository();
const cartValidationService = new CartValidationService(productRepository);

export class CartController {
  static async validateCart(req: Request, res: Response) {
    try {
      const data: CartValidationRequest = req.body;
      if (!data.items || !Array.isArray(data.items)) {
        return res.status(400).json({
          message: "El formato del carrito es inválido",
          valid: false,
        });
      }

      const hasInvalidItems = data.items.some(
        (item) =>
          typeof item.productId !== "number" ||
          typeof item.requestedQuantity !== "number" ||
          item.productId <= 0 ||
          item.requestedQuantity <= 0
      );

      if (hasInvalidItems) {
        return res.status(400).json({
          message: "Uno o más productos tienen datos inválidos",
          valid: false,
        });
      }

      const validationResult = await cartValidationService.validateCart(data);

      if (!validationResult.valid) {
        return res.status(409).json({
          message: "El carrito no es valido.",
          ...validationResult,
        });
      }
      res.status(200).json({
        message: "Carrito válido",
        ...validationResult,
      });
    } catch (error) {
      console.error("Error en validación de carrito:", error);
      res.status(500).json({
        message: "Error interno al validar el carrito",
        valid: false,
      });
    }
  }
}