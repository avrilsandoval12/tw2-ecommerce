import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductFilters } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent {

  filtros = signal<ProductFilters>({});

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService
  ) {
    // cargar mock
    this.productService.cargarProductosMock();
    this.categoryService.cargarCategoriasMock();

    // inicializar filtros desde localStorage
    this.filtros.set({ ...this.productService.filtros() });
  }

  aplicarFiltros() {
    this.productService.setFilters(this.filtros());
  }

  limpiarFiltros() {
    this.productService.clearFilters();
    this.filtros.set({});
  }
}
