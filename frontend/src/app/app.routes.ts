

import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { DetailProduct } from './features/product/detail-product/pages/detail-product';
import { CartComponent } from './features/cart/cart';
import { FormProductComponent  } from './shared/components/product-form/product-form.component';
import { CreateProductComponent } from './features/product/create-product/pages/create-product.component';
import { UpdateProductComponent } from './features/product/update-product/pages/update-product.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: DetailProduct },
  { path: 'cart', component: CartComponent },
  { path: 'products/create', component: CreateProductComponent },
  { path: 'products/update/:id', component: UpdateProductComponent },
];

