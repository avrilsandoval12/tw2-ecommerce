import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard], // Solo si NO está autenticado
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(r => r.Register),
    canActivate: [guestGuard], // Solo si NO está autenticado
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'reset-password/:token', 
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(c => c.ResetPasswordComponent),
    canActivate: [guestGuard],
  }
];
