import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../core/services/cart-service';

@Component({
  selector: 'app-detail-product',
  imports: [CommonModule],
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.css',
  standalone: true
})
export class DetailProduct implements OnInit{

 spinner = signal(true);
 error = signal<string | null>(null);
 product = signal<Product | null>(null);
 quantity = 1;
 id: number = 0;

 productsService = inject(ProductService);
 cartService = inject(CartService);
 activatedRoute = inject(ActivatedRoute);

   ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (isNaN(id) || id <= 0) {
      this.error.set('ID de producto inválido');
      this.spinner.set(false);
      return;
    }

    this.loadProduct(id);
  }

  private loadProduct(id: number): void {
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.error.set(null);
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.error.set('No se pudo cargar el detalle del producto');
        this.product.set(null);
      },
      complete: () => {
        this.spinner.set(false);
      }
    });
  }

  addToCart(): void {
    const prod = this.product();
    if (prod && prod.stock > 0) {
      this.cartService.addToCart(prod, 1);
    }
  }
}
