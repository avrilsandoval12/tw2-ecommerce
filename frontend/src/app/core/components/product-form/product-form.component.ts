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
 imagePreview: string | null = null;
  selectedFile: File | null = null;

  fb = inject(FormBuilder);

  form!: FormGroup;

  product = input<Product>();

  eventEmitterFormProduct = output<Product>();

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

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona solo archivos de imagen');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      input.value = '';
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64String = e.target?.result as string;
      this.imagePreview = base64String;
    };

    reader.onerror = () => {
      alert('Error al cargar la imagen');
      input.value = '';
    };

    reader.readAsDataURL(file);
  }
}

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.form.patchValue({ imagen: '' });
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  sendProduct(): void {
    if (this.form.valid) {
      const producto: Product = {
        id: this.product()?.id || 0,
        nombre: this.form.get('nombre')?.value.trim(),
        descripcion: this.form.get('descripcion')?.value.trim(),
        precio: this.form.get('precio')?.value,
        stock: this.form.get('stock')?.value,
        categoria: this.form.get('categoria')?.value.trim(),
        imagen: '',
        imagenFile: this.selectedFile || undefined
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
