import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest, AuthResponse, UserProfile } from '../../shared/interfaces/auth.model';
import { AuthRegister } from '../models/auth.model';
import {ProductService} from './product.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private readonly tokenKey = environment.tokenKey;

  isAuthenticated = signal<boolean>(!!this.getToken());
  currentUser = signal<UserProfile | null>(this.loadUserFromStorage());
  private productService = inject(ProductService);
  //isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isAdmin = computed(() => {
  const user = this.currentUser();
  const userRole = user?.role;
  const requiredRole = 'ADMIN'; // Asumiendo que este es el rol que esperas

  // 🐛 DEBUG: Muestra el rol actual y lo que estás esperando
  console.log('DEBUG [AuthService]: Rol actual del usuario:', userRole);
  console.log('DEBUG [AuthService]: Rol requerido:', requiredRole);

  // Solución recomendada para mayúsculas/minúsculas
  const isMatch = userRole?.toUpperCase() === requiredRole;

  console.log('DEBUG [AuthService]: ¿Coinciden los roles (ADMIN)?', isMatch);
  
  return isMatch;
  });

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        this.isAuthenticated.set(true);
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);

    this.productService.clearFilters();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  updateCurrentUser(user: UserProfile): void {
    this.setUser(user);
  }

  private setUser(user: UserProfile): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser.set(user);
  }

  register(data : AuthRegister) {
    return this.http.post(`${environment.apiUrl}/auth/register`, data)
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private loadUserFromStorage(): UserProfile | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}
