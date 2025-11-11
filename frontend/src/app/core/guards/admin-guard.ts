import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Asume la existencia de AuthService
// 🚨 NUEVA IMPORTACIÓN NECESARIA para convertir el Signal a Observable
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  // Usamos inject() en lugar de la inyección en el constructor para mayor compatibilidad con Signals y toObservable
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    // 1. Convierte el Signal 'currentUser' del AuthService a un Observable
    // (Emite un valor cada vez que el Signal cambia)
    return toObservable(this.authService.currentUser).pipe(
        // 2. Espera a que el usuario no sea null (opcional, pero buena práctica)
        filter(user => user !== null),
        // 3. Obtiene el rol del usuario
        map(user => {
            // Asumiendo que UserProfile tiene una propiedad 'role'
            const role = user?.role; 
            
            // 4. Comprueba si el rol es 'ADMIN'
            if (role === 'ADMIN') {
                return true; // Acceso permitido
            } else {
                // 5. Acceso denegado
                this.router.navigate(['/']); 
                alert('Acceso denegado. Se requiere un rol de administrador.');
                return false;
            }
        })
    );
  }
}