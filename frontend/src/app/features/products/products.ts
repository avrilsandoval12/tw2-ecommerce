import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {
  readonly precioMinGlobal = 10000;
  readonly precioMaxGlobal = 200000;

  products = computed(() => this.productService.productosFiltrados());
  loading = computed(() => this.productService.loading());
  filters = computed(() => this.productService.filters());
  categories = computed(() => this.categoryService.categories());

  sidebarOpen = false;

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.productService.getAll();
    this.categoryService.getCategories();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  updateFilter(key: string, value: any) {
    this.productService.setFilter(key as any, value);
  }

  clearFilters() {
    this.productService.clearFilters();
  }

  get minValue() {
    return this.filters().minPrice ?? this.precioMinGlobal;
  }

  get maxValue() {
    return this.filters().maxPrice ?? this.precioMaxGlobal;
  }

  onRangeChangeMin(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    if (val < this.maxValue) this.updateFilter('minPrice', val);
  }

  onRangeChangeMax(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    if (val > this.minValue) this.updateFilter('maxPrice', val);
  }
}
