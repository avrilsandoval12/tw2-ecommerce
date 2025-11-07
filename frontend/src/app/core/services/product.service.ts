import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ProductFilters } from '../models/productFilters.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly storageKey = 'productFilters';

  private _products = signal<Product[]>([]);
  private _filters = signal<ProductFilters>(this.loadFiltersFromStorage());
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  products = computed(() => this._products());
  filters = computed(() => this._filters());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  productosFiltrados = computed(() => {
    const filters = this._filters();

    let result = this._products().filter(p => {
      const matchSearch = filters.name
      ? p.name.toLowerCase().includes(filters.name.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(filters.name.toLowerCase())
      : true;

      const matchCategory = filters.category
        ? p.category?.name === filters.category
        : true;

      const matchPrice =
        (filters.minPrice != null ? p.price >= filters.minPrice : true) &&
        (filters.maxPrice != null ? p.price <= filters.maxPrice : true);

      return matchSearch && matchCategory && matchPrice;
    });

    switch (filters.sort) {
      case 'priceAsc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'categoryAsc':
        result = result.sort((a, b) =>
          (a.category?.name || '').localeCompare(b.category?.name || '')
        );
        break;
    }

    return result;
  });


  constructor(private http: HttpClient) {}

  getAll() {
    this._loading.set(true);
    return this.http
      .get<{ message: string; data: Product[] }>(this.apiUrl)
      .pipe(
        map(res => res.data),
        catchError(err => {
          console.error('Error fetching products:', err);
          this._error.set('No se pudieron cargar los productos');
          return of([]);
        })
      )
      .subscribe((products) => {
        this._products.set(products);
        this._loading.set(false);
      });
  }

  setFilter<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) {
    this._filters.update(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  clearFilters() {
    this._filters.set({});
    localStorage.removeItem(this.storageKey);
  }

  private loadFiltersFromStorage(): ProductFilters {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? '{}');
    } catch {
      return {};
    }
  }
}
