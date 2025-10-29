

import { Routes } from '@angular/router';
import { DetailProduct } from './pages/detail-product/detail-product';
import { CartComponent } from './pages/cart/cart';
import { ProductFormComponent } from './pages/product-form/product-form';

export const routes: Routes = [
  { path: 'admin/products/new', component: ProductFormComponent },
  {  path: 'product/:id', component: DetailProduct  },
    { path: 'cart', component: CartComponent },
];
