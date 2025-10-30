import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../api/services/products/products-service';
import { Product } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../api/services/cart/cart-service';

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
  quantity = signal<number>(1);

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
     next: (data: any) => {
  const mappedProduct: Product = {
    id: data.id,
    nombre: data.name,
    descripcion: data.description,
    precio: data.price,
    imagen: data.imageUrl,
    categoria: data.classification,
    stock: data.stock
  };
  this.product.set(mappedProduct);
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


  increaseQuantity(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const newQuantity = this.quantity() + 1;
    if (newQuantity <= currentProduct.stock) {
      this.quantity.set(newQuantity);
    }
  }

  decreaseQuantity(): void {
    const newQuantity = this.quantity() - 1;
    if (newQuantity >= 1) {
      this.quantity.set(newQuantity);
    }
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    this.cartService.addToCart(currentProduct, this.quantity());
    this.quantity.set(1);
  }

  isInCart(): boolean {
    const currentProduct = this.product();
    return currentProduct ? this.cartService.isInCart(currentProduct.id) : false;
  }

   getCartQuantity(): number {
    const currentProduct = this.product();
    return currentProduct ? this.cartService.getProductQuantity(currentProduct.id) : 0;
  }




}
