import { Component, signal, effect, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductFilters } from '../../core/models/productFilters.model';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products {
  readonly precioMinGlobal = 0;
  readonly precioMaxGlobal = 500000;

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService
  ) {
    this.productService.cargarProductosMock();
    this.categoryService.cargarCategoriasMock();
  }

  updateFilter(key: string, value: any) {
    this.productService.setFilter(key as any, value);
  }

  clearFilters() {
    this.productService.clearFilters();
  }

  get minValue() {
    return this.productService.filters().precioMin ?? this.precioMinGlobal;
  }

  get maxValue() {
    return this.productService.filters().precioMax ?? this.precioMaxGlobal;
  }

  onRangeChangeMin(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    if (val < this.maxValue) this.updateFilter('precioMin', val);
  }

  onRangeChangeMax(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    if (val > this.minValue) this.updateFilter('precioMax', val);
  }
}
//   setFilterNombre(event: Event) {
//     const value = (event.target as HTMLInputElement).value;
//     this.productService.setFilter('nombre', value);
//   }

//   setFilterCategoria(event: Event) {
//     const value = (event.target as HTMLSelectElement).value;
//     this.productService.setFilter('categoria', value);
//   }

//   setFilterPrecioMin(event: Event) {
//     const value = Number((event.target as HTMLInputElement).value);
//     this.productService.setFilter('precioMin', value);
//   }

//   setFilterPrecioMax(event: Event) {
//     const value = Number((event.target as HTMLInputElement).value);
//     this.productService.setFilter('precioMax', value);
//   }

//   clearFilters() {
//     this.productService.clearFilters();
//   }
// }
