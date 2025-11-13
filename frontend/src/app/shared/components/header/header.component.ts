import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private authService = inject(AuthService);

  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  userName = computed(() => this.currentUser()?.name || 'Usuario');

  isAdmin = computed(() => this.authService.isAdmin());

  onLogout(): void {
    this.authService.logout();
  }


  isCartOpen = signal(false);

  constructor(public cartService: CartService) {}

  toggleCart(): void {
   this.isCartOpen.update(value => !value);
    }

    closeCart(): void {
      this.isCartOpen.set(false);
    }
}
