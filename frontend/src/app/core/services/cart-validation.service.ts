import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {CartItemValidation, CartValidationResponse} from '../models/cartvalidation.model';

@Injectable({ providedIn: 'root' })
export class CartValidationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  validateCart(items: CartItemValidation[]): Observable<CartValidationResponse> {
    return this.http.post<CartValidationResponse>(`${this.apiUrl}/validate`, {
      items,
    });
  }
}
