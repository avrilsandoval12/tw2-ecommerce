import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class Products {
  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly baseUrl = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  createProduct(product: Product): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.nombre);
    formData.append('description', product.descripcion || '');
    formData.append('price', product.precio.toString());
    formData.append('stock', product.stock.toString());
    formData.append('classification', product.categoria || '');
    if (product.imagenFile) {
      formData.append('imagen', product.imagenFile, product.imagenFile.name);
    }
    return this.http.post<Product>(this.apiUrl, formData);
  }

  getProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);

  }

  updateProduct(id: number, product: Product, imageFile?: File | null): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.nombre);
    formData.append('description', product.descripcion || '');
    formData.append('price', product.precio.toString());
    formData.append('stock', product.stock.toString());
    formData.append('classification', product.categoria || '');

    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
