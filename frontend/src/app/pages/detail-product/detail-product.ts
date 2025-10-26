import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { Products } from '../../api/services/products/products'; 
import { Product } from '../../api/interfaces/product.interface'; 
import { CommonModule } from '@angular/common';
import { CartService } from '../../api/services/cart/cart';

@Component({
  selector: 'app-detail-product',
  imports: [CommonModule], 
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.css',
  standalone: true 
})
export class DetailProduct implements OnInit {

  product = signal<Product | undefined>(undefined); 
  spinner = signal<boolean>(true); 
  error = signal<string | null>(null); 
  addingToCart = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private productsService: Products,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const productIdString = params.get('id'); 
        
        if (productIdString) {
          const productId = +productIdString; 
          this.loadProduct(productId);
        } else {
          this.error.set('No se proporcionó un ID de producto.');
          this.spinner.set(false);
        }
      },
      error: (err: any) => {
        console.error('Error al obtener parámetros de la ruta:', err);
        this.error.set('Error al cargar la página.');
        this.spinner.set(false);
      }
    });
  }

  loadProduct(id: number): void {
    this.spinner.set(true);
    this.error.set(null);

    this.productsService.getProductById(id).subscribe({
      next: (data: Product) => {
        this.product.set(data); 
      },
      error: (err: any) => {
        console.error('Error al obtener el producto:', err);
        this.error.set('No se pudo cargar el detalle del producto.');
      },
      complete: () => {
        this.spinner.set(false);
      }
    });
  }





  // carrito:


   addToCart(): void {
     const currentProduct = this.product();
  if (!currentProduct) return;

  this.addingToCart.set(true);
  this.cartService.addToCart(currentProduct, 1);
  this.addingToCart.set(false);
  }


  isInCart(): boolean {
    const currentProduct = this.product();
    return currentProduct ? this.cartService.isInCart(currentProduct.id) : false;
  }
}
