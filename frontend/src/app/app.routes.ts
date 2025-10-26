

import { Routes } from '@angular/router';
import { DetailProduct } from './pages/detail-product/detail-product';
import { CartComponent } from './pages/cart/cart';

export const routes: Routes = [
  {  path: 'product/:id', component: DetailProduct  },
    { path: 'cart', component: CartComponent },
];