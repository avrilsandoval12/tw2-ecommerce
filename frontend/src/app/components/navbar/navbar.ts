import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../api/services/cart/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  isCartOpen = signal(false);

  constructor(public cartService: CartService) {}

  toggleCart(): void {
    this.isCartOpen.set(!this.isCartOpen());
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}
