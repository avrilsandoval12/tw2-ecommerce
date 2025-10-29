import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Products } from '../../api/services/products/products';
import { Product } from '../../api/interfaces/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  modoEdicion = false;
  productoEditandoId?: number;
  spinner = true;

  constructor(
    private fb: FormBuilder,
    private productService: Products
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      classification: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
      },
      complete: () => {
        this.spinner = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const producto: Product = this.productForm.value;

      if (this.modoEdicion && this.productoEditandoId) {
        this.actualizarProducto(this.productoEditandoId, producto);
      } else {
        this.crearProducto(producto);
      }
    }
  }

  crearProducto(producto: Product): void {
    this.productService.createProduct(producto).subscribe({
      next: (nuevoProducto: Product) => {
        console.log('Producto creado:', nuevoProducto);
        this.cargarProductos();
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Error al crear producto:', error);
      }
    });
  }

  actualizarProducto(id: number, producto: Product): void {
    this.productService.updateProduct(id, producto).subscribe({
      next: (productoActualizado: Product) => {
        console.log('Producto actualizado:', productoActualizado);
        this.cargarProductos();
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Error al actualizar producto:', error);
      }
    });
  }

  editarProducto(producto: Product): void {
    this.modoEdicion = true;
    this.productoEditandoId = producto.id;
    this.productForm.patchValue({
      name: producto.name,
      description: producto.description,
      price: producto.price,
      stock: producto.stock,
      classification: producto.classification,
      imageUrl: producto.imageUrl
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Producto eliminado');
          this.cargarProductos();
        },
        error: (error: any) => {
          console.error('Error al eliminar producto:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      classification: '',
      imageUrl: ''
    });
    this.modoEdicion = false;
    this.productoEditandoId = undefined;
  }

  get name() {
    return this.productForm.get('name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get price() {
    return this.productForm.get('price');
  }

  get stock() {
    return this.productForm.get('stock');
  }

  get classification() {
    return this.productForm.get('classification');
  }

  get imageUrl() {
    return this.productForm.get('imageUrl');
  }
}
