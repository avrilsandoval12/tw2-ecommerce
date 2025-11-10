import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./pages/products').then((m) => m.Products),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./detail-product/pages/detail-product').then((m) => m.DetailProduct),
  },
];
