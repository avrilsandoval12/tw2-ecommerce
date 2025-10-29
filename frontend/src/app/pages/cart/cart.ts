import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../api/services/cart/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  
  constructor(public cartService: CartService) {}

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
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      this.cartService.clearCart();
    }
  }
}