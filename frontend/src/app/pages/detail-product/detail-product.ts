import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../api/services/products/products-service';
import { Product } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../api/services/cart/cart-service';

@Component({
  selector: 'app-detail-product',
  imports: [CommonModule],
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.css',
  standalone: true
})
export class DetailProduct implements OnInit{

 spinner = true;
 error: string | null = null;
 product!: Product;
 quantity = 1;
 id: number = 0;

 productsService = inject(Products);
 cartService = inject(CartService);
 activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
      this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      this.verProducto();
  }

   ngOnDestroy(): void {}

    verProducto(): void {
    this.productsService.getProductById(this.id).subscribe({
      next: (data: any) => {
        const mappedProduct: Product = {
          id: data.id,
          nombre: data.name,
          descripcion: data.description,
          precio: data.price,
          imagen: data.imageUrl,
          categoria: data.classification,
          stock: data.stock
        };
        this.product = mappedProduct;
      },
      error: (error) => {
        this.error = 'No se pudo cargar el detalle del producto.';
        console.error('Error al obtener el producto:', error);
      },
      complete: () => {
        this.spinner = false;
      }
    });
  }


  // carrito:
 addToCart(): void {
    if (this.product && this.product.stock > 0) {
      this.cartService.addToCart(this.product, 1);
    }
  }


}
