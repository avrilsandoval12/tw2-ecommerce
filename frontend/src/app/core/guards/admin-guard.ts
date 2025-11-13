import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('DEBUG [AdminGuard - FUNCTION]: Valor de authService.isAdmin():', authService.isAdmin());
  
  if (authService.isAdmin()) {
    console.log('DEBUG [AdminGuard - FUNCTION]: ACCESO CONCEDIDO.');
    return true; // Acceso concedido
  } else {
    console.log('DEBUG [AdminGuard - FUNCTION]: ACCESO DENEGADO. Redirigiendo.');
    router.navigate(['/']); 
    alert('Acceso denegado. Se requiere un rol de administrador.'); // Mantén este si lo quieres
    return false; // Acceso denegado
  }
};