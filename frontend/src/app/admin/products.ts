import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsAdminService {
  private apiUrl = '/api/products'; // Asegúrate de que esta URL coincida con tus rutas de Express

  constructor(private http: HttpClient) { }

  // 1. Obtener la lista (READ)
  // Aunque no está protegido por isAdmin, es útil para la tabla de administración.
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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