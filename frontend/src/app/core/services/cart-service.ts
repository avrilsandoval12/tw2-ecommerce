import { Injectable, signal, computed, model } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../../shared/interfaces/cartitem.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'shopping_cart';


  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());


  items = computed(() => this.cartItems());

  totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((total, item) =>
      total + (item.product.precio * item.quantity), 0
    )
  );

  constructor() {}

  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      return [];
    }
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = [...this.cartItems()];
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      const newQuantity = currentItems[existingItemIndex].quantity + quantity;
      if (newQuantity <= product.stock) {
        currentItems[existingItemIndex].quantity = newQuantity;
      } else {
        console.warn('No hay suficiente stock disponible');
        return;
      }
    } else {
      if (quantity <= product.stock) {
        currentItems.push({ product, quantity });
      } else {
        console.warn('No hay suficiente stock disponible');
        return;
      }
    }

    this.cartItems.set(currentItems);
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems().filter(
      item => item.product.id !== productId
    );
    this.cartItems.set(currentItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = [...this.cartItems()];
    const itemIndex = currentItems.findIndex(
      item => item.product.id === productId
    );

    if (itemIndex > -1) {
      const product = currentItems[itemIndex].product;

      if (quantity <= product.stock) {
        currentItems[itemIndex].quantity = quantity;
        this.cartItems.set(currentItems);
        this.saveCartToStorage();
      } else {
        console.warn('No hay suficiente stock disponible');
      }
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }

  getProductQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

 incrementQuantity(productId: number): void {
    const currentQuantity = this.getProductQuantity(productId);
    this.updateQuantity(productId, currentQuantity + 1);
  }

  decrementQuantity(productId: number): void {
    const currentQuantity = this.getProductQuantity(productId);
    this.updateQuantity(productId, currentQuantity - 1);
  }


}
