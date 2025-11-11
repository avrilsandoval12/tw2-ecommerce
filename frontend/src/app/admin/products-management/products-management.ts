import { Component, OnInit } from '@angular/core';
import { ProductsAdminService } from '../products';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Definición de Interfaz simple para Cartera
interface Product {
  id?: number;
  name: string;
  description: string;
  // Puedes añadir más campos como price, categoryId, etc.
}

@Component({
  selector: 'app-products-management',
  templateUrl: './products-management.component.html',
  styleUrls: ['./products-management.component.css']
})
export class ProductsManagementComponent implements OnInit {
  products: Product[] = []; 
  productForm: FormGroup;
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  
  // Usamos FormBuilder para manejar los formularios de forma reactiva
  constructor(
    private adminService: ProductsAdminService,
    private fb: FormBuilder
  ) {
    // Inicialización del formulario reactivo
    this.productForm = this.fb.group({
      id: [null], // Campo oculto para el ID durante la edición
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // --- Funciones de Carga y Estado ---

  loadProducts(): void {
    this.adminService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  openModal(product?: Product): void {
    this.isEditing = !!product;
    this.isModalOpen = true;

    if (this.isEditing && product) {
      // Cargar datos del producto seleccionado para edición
      this.productForm.setValue({
        id: product.id,
        name: product.name,
        description: product.description
      });
    } else {
      // Abrir modal para crear uno nuevo
      this.productForm.reset({ id: null });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.productForm.reset();
  }

  // --- Lógica CRUD ---

  onSubmit(): void {
    if (this.productForm.invalid) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.isEditing && productData.id) {
      // Lógica de EDICIÓN (UPDATE)
      this.adminService.updateProduct(productData.id, productData).subscribe({
        next: () => {
          alert('Cartera actualizada con éxito.');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Update error (403 if not Admin):', err);
          alert('Error al actualizar la cartera. Verifique sus permisos.');
        }
      });
    } else {
      // Lógica de CREACIÓN (CREATE)
      this.adminService.createProduct(productData).subscribe({
        next: () => {
          alert('Cartera creada con éxito.');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Creation error (403 if not Admin):', err);
          alert('Error al crear la cartera. Verifique sus permisos.');
        }
      });
    }
  }

  onDelete(product: Product): void {
    if (!product.id) return;
    if (confirm(`¿Estás seguro de que quieres eliminar la cartera "${product.name}"?`)) {
      this.adminService.deleteProduct(product.id).subscribe({
        next: () => {
          alert('Cartera eliminada con éxito.');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Delete error (403 if not Admin):', err);
          alert('No autorizado para eliminar o error en la operación.');
        }
      });
    }
  }
}