import { Routes } from '@angular/router';
import { HOME_ROUTES } from './features/home/home.routes';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { PROFILE_ROUTES } from './features/profile/profile.routes';
import { PRODUCTS_ROUTES } from './features/products/products.routes';
import { CART_ROUTES } from './features/cart/cart.routes';
import {authGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      ...HOME_ROUTES,
      ...PRODUCTS_ROUTES,
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      ...PROFILE_ROUTES,
      ...CART_ROUTES
    ]
  },
  {
    path: '',
    children: AUTH_ROUTES,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

