import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class Products {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(classification?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (classification) {
      params = params.set('classification', classification);
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getClassifications(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/classifications`);
  }
}
