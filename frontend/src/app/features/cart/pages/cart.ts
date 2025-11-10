import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart-service';
import { Router, RouterLink } from '@angular/router';
import { CartValidationService } from '../../../core/services/cart-validation.service';
import { ProductValidationResult } from '../../../core/models/cartvalidation.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'cart.html',
  styleUrl: 'cart.css'
})
export class CartComponent {

 cartService = inject(CartService);
  private cartValidationService = inject(CartValidationService);
  private router = inject(Router);
  isValidating = false;
  validationErrors: string[] = [];

 increaseQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: number): void {
    const currentQuantity = this.cartService.getProductQuantity(productId);
    this.cartService.updateQuantity(productId, currentQuantity - 1);
  }

  removeItem(productId: number): void {
    if (confirm('¿Estás seguro de eliminar todas las unidades de este producto del carrito?')) {
      this.cartService.removeFromCart(productId);
      // Limpiar errores si se elimina el producto
      this.validationErrors = [];
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      this.cartService.clearCart();
      this.validationErrors = [];
    }
  }

  // Método para proceder al checkout con validación
  proceedToCheckout(): void {
    this.isValidating = true;
    this.validationErrors = [];

    // Convertir items del carrito al formato de validación
    const items = this.cartService.items().map((item) => ({
      productId: item.product.id,
      requestedQuantity: item.quantity,
    }));

    this.cartValidationService.validateCart(items).subscribe({
      next: (response) => {
        if (response.valid) {
          console.log('✅ Carrito válido. Total:', response.totalPrice);
          alert(`Carrito válido! Total: $${response.totalPrice.toFixed(2)}`);
        } else {
          this.validationErrors = response.results
            .filter((r) => !r.isValid)
            .map((r) => `${r.productName}: ${r.reason}`);

          console.warn('⚠️ Errores de validación:', this.validationErrors);
          this.updateCartWithValidation(response.results);
        }
        this.isValidating = false;
      },
      error: (error) => {
        console.error('Error al validar carrito:', error);
        this.validationErrors = [
          'Error al validar el carrito. Por favor, intenta nuevamente.',
        ];
        this.isValidating = false;
      },
    });
  }

  private updateCartWithValidation(results: ProductValidationResult[]): void {
    results.forEach((result) => {
      if (!result.isValid) {
        if (result.availableStock === 0) {
          console.warn(`🗑️ Eliminando ${result.productName} (sin stock)`);
          this.cartService.removeFromCart(result.productId);
        }
        else if (result.availableStock < result.requestedQuantity) {
          console.warn(
            `Ajustando ${result.productName}: ${result.requestedQuantity} → ${result.availableStock}`
          );
          this.cartService.updateQuantity(
            result.productId,
            result.availableStock
          );
        }
      }
    });
  }
}
