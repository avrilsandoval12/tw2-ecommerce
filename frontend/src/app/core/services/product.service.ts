import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ProductFilters } from '../models/productFilters.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/productos`;

  private _products = signal<Product[]>([]);
  private _filters = signal<ProductFilters>({});
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  products = computed(() => this._products());
  filters = computed(() => this._filters());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

productosFiltrados = computed(() => {
    const productos = this._products();
    const f = this._filters();

    return productos.filter(p => {
      const matchNombre = f.nombre
        ? p.nombre.toLowerCase().includes(f.nombre.toLowerCase())
        : true;

      const matchCategoria = f.categoria
        ? p.categoria?.toLowerCase() === f.categoria.toLowerCase()
        : true;

      const matchPrecio =
        (f.precioMin == null || p.precio >= f.precioMin) &&
        (f.precioMax == null || p.precio <= f.precioMax);

      return matchNombre && matchCategoria && matchPrecio;
    });
  });

  constructor(private http: HttpClient) {
        this.loadFilters();
  }

  cargarProductosMock() {
    const mock: Product[] = [
      { id: 1, nombre: 'ToteBag', precio: 32000, imagen: 'products/1.jpeg', categoria: '1' },
      { id: 2, nombre: 'Bolso', precio: 41000, imagen: 'products/2.jpg', categoria: '2' },
      { id: 3, nombre: 'MiniBag', precio: 30000, imagen: 'products/3.jpg', categoria: '3' },
      { id: 1, nombre: 'ToteBag', precio: 32000, imagen: 'products/1.jpeg' },
      { id: 2, nombre: 'Bolso', precio: 41000, imagen: 'products/2.jpg' },
      { id: 3, nombre: 'MiniBag', precio: 30000, imagen: 'products/3.jpg' },
    ];
    this._products.set(mock);
  }

  setFilter<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) {
    const updated = { ...this._filters(), [key]: value };
    this._filters.set(updated);
    localStorage.setItem('filtrosProductos', JSON.stringify(updated));
  }

 clearFilters() {
    this._filters.set({});
    localStorage.removeItem('filtrosProductos');
  }

  loadFilters() {
    const stored = localStorage.getItem('filtrosProductos');
    if (stored) this._filters.set(JSON.parse(stored));
  }


  // cuando este el back
  // cargarProductos() {
  //   this._loading.set(true);

  //   this.http.get<Product[]>(this.apiUrl)
  //     .pipe(
  //       catchError(err => {
  //         console.error('Error al cargar productos:', err);
  //         this._error.set('No se pudieron cargar los productos');
  //         return of([]);
  //       })
  //     )
  //     .subscribe((productos) => {
  //       this._productos.set(productos);
  //       this._loading.set(false);
  //     });
  // }
}

