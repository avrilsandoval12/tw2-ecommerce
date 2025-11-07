import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  private _categories = signal<Category[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  categories = computed(() => this._categories());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  constructor(private http: HttpClient) {}

  getCategories() {
    this._loading.set(true);

    this.http.get<{ message: string; data: Category[] }>(this.apiUrl)
      .pipe(
        map(res => res.data),
        catchError(err => {
          console.error('Error al cargar categorías:', err);
          this._error.set('No se pudieron cargar las categorías');
          this._loading.set(false);
          return of([]);
        })
      )
      .subscribe((categories) => {
        this._categories.set(categories);
        this._loading.set(false);
      });
  }

  clearCategories() {
    this._categories.set([]);
  }
}
