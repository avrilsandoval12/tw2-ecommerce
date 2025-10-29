import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/productos`;

  private _productos = signal<Product[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  productos = computed(() => this._productos());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  constructor(private http: HttpClient) {}

  cargarProductosMock() {
    const mock: Product[] = [
      { id: 1, nombre: 'ToteBag', precio: 32000, imagen: '/public/productos/1.jpg' },
      { id: 2, nombre: 'Bolso', precio: 41000, imagen: '/public/productos/2.jpg' },
      { id: 3, nombre: 'Billetera', precio: 15000, imagen: '/public/productos/3.jpg' },
    ];
    this._productos.set(mock);
  }

  cargarProductos() {
    this._loading.set(true);

    this.http.get<Product[]>(this.apiUrl)
      .pipe(
        catchError(err => {
          console.error('Error al cargar productos:', err);
          this._error.set('No se pudieron cargar los productos');
          return of([]);
        })
      )
      .subscribe((productos) => {
        this._productos.set(productos);
        this._loading.set(false);
      });
  }
}
