import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse {
  message: string;
  data: any[]; 
}

interface Category {
    id: number;
    name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsAdminService {
  private apiUrl = '/api/products'; 
  private categoriesApiUrl = '/api/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse>(this.categoriesApiUrl).pipe(
      map(response => response.data as Category[]) 
    );
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => response.data) 
    );
  }

  // 2. Crear nueva cartera (CREATE) - Protegido en el backend por isAdmin
  createProduct(productData: any): Observable<any> {
    // Nota: El JWT se debe adjuntar automáticamente por un interceptor
    return this.http.post<any>(this.apiUrl, productData);
  }

  // 3. Actualizar cartera (UPDATE) - Protegido en el backend por isAdmin
  updateProduct(productId: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, productData);
  }

  // 4. Eliminar cartera (DELETE) - Protegido en el backend por isAdmin
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`);
  }
}