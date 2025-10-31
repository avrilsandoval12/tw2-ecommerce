import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../api/services/products/products-service';
import { Product } from '../../core/models/product.model';
import { Router, RouterLink } from '@angular/router';
import { FormProductComponent } from '../../core/components/product-form/product-form.component';



@Component({
  selector: 'app-create-product',
  imports: [CommonModule, RouterLink, FormProductComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit, OnDestroy {

  error: string | null = null;
  success: string | null = null;

  productService = inject(Products);
  router = inject(Router);

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  crearProducto(producto: Product): void {
    this.productService.createProduct(producto).subscribe({
      next: (nuevoProducto: Product) => {
        this.success = 'Producto creado correctamente';
        setTimeout(() => {
          this.router.navigate(['/products/list-products']);
        }, 1500);
      },
      error: (error) => {
        this.error = 'Error al crear el producto';
        console.error('Error:', error);
      }
    });
  }
}
