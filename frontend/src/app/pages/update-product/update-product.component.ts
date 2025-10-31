import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../api/services/products/products-service';
import { Product } from '../../core/models/product.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormProductComponent } from '../../core/components/product-form/product-form.component';

@Component({
  selector: 'app-update-product',
  imports: [CommonModule, RouterLink, FormProductComponent],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit, OnDestroy {

  spinner = true;
  id: number = 0;
  product!: Product;
  error: string | null = null;
  success: string | null = null;

  productService = inject(Products);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.verProducto();
  }

  ngOnDestroy(): void {}

  verProducto(): void {
    this.productService.getProductById(this.id).subscribe({
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
        this.error = 'Error al cargar el producto';
        console.error('Error:', error);
      },
      complete: () => {
        this.spinner = false;
      }
    });
  }

  actualizarProducto(producto: Product): void {
    this.productService.updateProduct(this.id, producto).subscribe({
      next: (productoActualizado: Product) => {
        this.success = 'Producto actualizado correctamente';
        setTimeout(() => {
          this.router.navigate(['/products/list-products']);
        }, 1500);
      },
      error: (error) => {
        this.error = 'Error al actualizar el producto';
        console.error('Error:', error);
      }
    });
  }
}
