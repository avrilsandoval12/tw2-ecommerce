import { Routes } from '@angular/router';
import { HOME_ROUTES } from './features/home/home.routes';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { PROFILE_ROUTES } from './features/profile/profile.routes';
import { PRODUCTS_ROUTES } from './features/products/products.routes';

export const routes: Routes = [
  {
    path: '',
    children: HOME_ROUTES, // Home y otras rutas públicas
  },
  {
    path: '',
    children: AUTH_ROUTES, // Login, Register
  },
  {
    path: '',
    children: PROFILE_ROUTES, // Rutas protegidas del Perfil
  },
  {
    path: '',
    children: PRODUCTS_ROUTES, // Rutas publicas y protegidas de Productos
  },
  {
    path: '**',
    redirectTo: '',
  },
];
