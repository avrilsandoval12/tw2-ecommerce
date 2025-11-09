import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./pages/products').then((m) => m.Products),
  },
];
