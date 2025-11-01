import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../api/services/cart/cart-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {

  isCartOpen = signal(false);

  constructor(public cartService: CartService) {}

  toggleCart(): void {
   this.isCartOpen.update(value => !value);
    }

    closeCart(): void {
      this.isCartOpen.set(false);
    }

}
