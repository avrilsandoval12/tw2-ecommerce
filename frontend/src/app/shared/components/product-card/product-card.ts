import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.model';


import {Router} from '@angular/router';

import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
})
export class ProductCard {
  @Input({ required: true }) product!: Product;



 constructor(public cartService: CartService, private router: Router) {}

 addToCart(event: Event): void {
  event.stopPropagation();
  if(this.product && this.product.stock > 0) {
    this.cartService.addToCart(this.product, 1);
  }
}

  hasStock(): boolean {
    return this.product && this.product.stock > 0;
  }

  navigateToDetail(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  handleDecrement(event: Event): void {
    event.stopPropagation();
    this.cartService.decrementQuantity(this.product.id);
  }



}
