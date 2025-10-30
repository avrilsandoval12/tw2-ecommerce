

import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { DetailProduct } from './pages/detail-product/detail-product';
import { CartComponent } from './pages/cart/cart';
import { ProductFormComponent } from './pages/product-form/product-form';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: DetailProduct },
  { path: 'cart', component: CartComponent },
  { path: 'product-form', component: ProductFormComponent },
];

