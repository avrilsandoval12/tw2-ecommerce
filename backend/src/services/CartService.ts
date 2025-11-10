import { IProductRepository } from "../repository/ProductRepository";
import {
  CartValidationRequest,
  CartValidationResponse,
  ProductValidationResult,
} from "../types/cart.types";

export interface ICartValidationService {
  validateCart(data: CartValidationRequest): Promise<CartValidationResponse>;
}

export class CartValidationService implements ICartValidationService {
  constructor(private readonly productRepository: IProductRepository) {}

  async validateCart(
    data: CartValidationRequest
  ): Promise<CartValidationResponse> {
    if (!data.items || data.items.length === 0) {
      return {
        valid: false,
        results: [],
        totalPrice: 0,
        invalidItems: 0,
      };
    }

    const validationPromises = data.items.map((item) =>
      this.validateItem(item.productId, item.requestedQuantity)
    );

    const results = await Promise.all(validationPromises);

    const validResults = results.filter((r) => r.isValid);
    const totalPrice = validResults.reduce(
      (sum, r) => sum + r.currentPrice * r.requestedQuantity,
      0
    );

    return {
      valid: results.every((r) => r.isValid),
      results,
      totalPrice,
      invalidItems: results.filter((r) => !r.isValid).length,
    };
  }

  private async validateItem(
    productId: number,
    requestedQuantity: number
  ): Promise<ProductValidationResult> {
    try {
      if (requestedQuantity <= 0) {
        return {
          productId,
          productName: "Desconocido",
          requestedQuantity,
          availableStock: 0,
          currentPrice: 0,
          isValid: false,
          reason: "La cantidad debe ser mayor a 0",
        };
      }

      const product = await this.productRepository.findById(productId);

      if (!product) {
        return {
          productId,
          productName: "Desconocido",
          requestedQuantity,
          availableStock: 0,
          currentPrice: 0,
          isValid: false,
          reason: "Producto no encontrado",
        };
      }

      if (requestedQuantity > product.stock) {
        return {
          productId: product.id,
          productName: product.name,
          requestedQuantity,
          availableStock: product.stock,
          currentPrice: product.price,
          isValid: false,
          reason: `Stock insuficiente. Disponible: ${product.stock}`,
        };
      }

      return {
        productId: product.id,
        productName: product.name,
        requestedQuantity,
        availableStock: product.stock,
        currentPrice: product.price,
        isValid: true,
      };
    } catch (error) {
      console.error(`Error validando producto ${productId}:`, error);
      return {
        productId,
        productName: "Desconocido",
        requestedQuantity,
        availableStock: 0,
        currentPrice: 0,
        isValid: false,
        reason: "Error al validar el producto",
      };
    }
  }
}