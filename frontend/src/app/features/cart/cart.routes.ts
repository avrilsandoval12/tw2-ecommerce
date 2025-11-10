
import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart').then((m) => m.CartComponent),
  },
];
