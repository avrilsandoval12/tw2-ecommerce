import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  private _categorias = signal<Category[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  categorias = computed(() => this._categorias());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  constructor(private http: HttpClient) {}

  cargarCategoriasMock() {
    const mock: Category[] = [
      { id: 1, nombre: 'Billeteras'},
      { id: 2, nombre: 'Bolsos'},
      { id: 3, nombre: 'ToteBags'},
    ];
    this._categorias.set(mock);
  }

  cargarCategorias() {
    this._loading.set(true);

    this.http.get<Category[]>(this.apiUrl)
      .pipe(
        catchError(err => {
          console.error('Error al cargar categorias:', err);
          this._error.set('No se pudieron cargar las categorias');
          return of([]);
        })
      )
      .subscribe((categorias) => {
        this._categorias.set(categorias);
        this._loading.set(false);
      });
  }
}
