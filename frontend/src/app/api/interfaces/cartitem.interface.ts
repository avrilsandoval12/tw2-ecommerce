import { Product } from '../../core/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}
