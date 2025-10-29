import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ProductFilters } from '../models/productFilters.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/productos`;

  private _productos = signal<Product[]>([]);
  private _filtros = signal<ProductFilters>({});
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  productos = computed(() => this._productos());
  filtros = computed(() => this._filtros());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  productosFiltrados = computed(() => {
    const filtros = this._filtros();
    return this._productos().filter(p => {
      const matchNombre = filtros.nombre ? p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) : true;
      const matchCategoria = filtros.categoria ? p.categoria === filtros.categoria : true;
      const matchPrecio = (filtros.precioMin != null ? p.precio >= filtros.precioMin : true)
                      && (filtros.precioMax != null ? p.precio <= filtros.precioMax : true);
      return matchNombre && matchCategoria && matchPrecio;
    });
  });

  constructor(private http: HttpClient) {
        this.loadFilters();
  }

  cargarProductosMock() {
    const mock: Product[] = [
      { id: 1, nombre: 'ToteBag', precio: 32000, imagen: '/public/productos/1.jpg' },
      { id: 2, nombre: 'Bolso', precio: 41000, imagen: '/public/productos/2.jpg' },
      { id: 3, nombre: 'Bil', precio: 15000, imagen: '/public/productos/3.jpg' },
    ];
    this._productos.set(mock);
  }

  setFilters(filtros: ProductFilters) {
    this._filtros.set(filtros);
    localStorage.setItem('filtrosProductos', JSON.stringify(filtros));
  }

  loadFilters() {
    const filtros = localStorage.getItem('filtrosProductos');
    if (filtros) {
      this._filtros.set(JSON.parse(filtros));
    }
  }

  clearFilters() {
    this._filtros.set({});
    localStorage.removeItem('filtrosProductos');
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
export { ProductFilters };

