

import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { DetailProduct } from './pages/detail-product/detail-product';
import { CartComponent } from './pages/cart/cart';
import { FormProductComponent  } from './core/components/product-form/product-form.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: DetailProduct },
  { path: 'cart', component: CartComponent },
  { path: 'product-form', component: FormProductComponent },
  { path: 'products/create', component: CreateProductComponent },
  { path: 'products/update/:id', component: UpdateProductComponent },
];

