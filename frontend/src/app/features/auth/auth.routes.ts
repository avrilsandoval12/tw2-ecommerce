import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard], // Solo si NO está autenticado
  },
];
