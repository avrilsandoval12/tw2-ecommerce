import { Component, inject, input, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-form-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  standalone: true
})
export class FormProductComponent implements OnInit, OnDestroy {

  title: string = "Crear Producto";

  fb = inject(FormBuilder);

  form!: FormGroup;

  product = input<Product>(); // Input desde el padre

  eventEmitterFormProduct = output<Product>(); // Output al padre

  ngOnInit(): void {
    if (this.product()) {
      this.title = "Actualizar Producto";
    }

    this.form = this.fb.group({
      nombre: [this.product()?.nombre || '', [Validators.required, Validators.maxLength(100)]],
      descripcion: [this.product()?.descripcion || '', [Validators.maxLength(10000)]],
      precio: [this.product()?.precio || 0, [Validators.required, Validators.min(0)]],
      stock: [this.product()?.stock || 0, [Validators.required, Validators.min(0)]],
      categoria: [this.product()?.categoria || '', [Validators.required]],
      imagen: [this.product()?.imagen || '', []]
    });
  }

  ngOnDestroy(): void {}

  sendProduct(): void {
    if (this.form.valid) {
      const producto: Product = {
        id: this.product()?.id || 0,
        nombre: this.form.get('nombre')?.value.trim(),
        descripcion: this.form.get('descripcion')?.value.trim(),
        precio: this.form.get('precio')?.value,
        stock: this.form.get('stock')?.value,
        categoria: this.form.get('categoria')?.value.trim(),
        imagen: this.form.get('imagen')?.value.trim()
      };

      this.eventEmitterFormProduct.emit(producto);
    }
  }

  get nombre() {
    return this.form.get('nombre');
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get precio() {
    return this.form.get('precio');
  }

  get stock() {
    return this.form.get('stock');
  }

  get categoria() {
    return this.form.get('categoria');
  }

  get imagen() {
    return this.form.get('imagen');
  }
}
