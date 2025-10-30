import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Products } from '../../api/services/products/products-service';
import { Product } from '../../core/models/product.model';

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
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      imagen: ['', Validators.required]
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
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      imagen: producto.imagen
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
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: '',
      imagen: ''
    });
    this.modoEdicion = false;
    this.productoEditandoId = undefined;
  }

  get nombre() {
    return this.productForm.get('nombre');
  }

  get descripcion() {
    return this.productForm.get('descripcion');
  }

  get precio() {
    return this.productForm.get('precio');
  }

  get stock() {
    return this.productForm.get('stock');
  }

  get categoria() {
    return this.productForm.get('categoria');
  }

  get imagen() {
    return this.productForm.get('imagen');
  }
}
