import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCard {
  @Input({ required: true }) producto!: Product;

  constructor(public cartService: CartService, private router: Router) {}

 addToCart(event: Event): void {
  event.stopPropagation();
  if(this.producto && this.producto.stock > 0) {
    this.cartService.addToCart(this.producto, 1);
  }
}

  hasStock(): boolean {
    return this.producto && this.producto.stock > 0;
  }

  navigateToDetail(): void {
    this.router.navigate(['/product', this.producto.id]);
  }

}
