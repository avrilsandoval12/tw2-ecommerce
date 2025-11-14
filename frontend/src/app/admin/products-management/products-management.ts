import { Component, OnInit } from '@angular/core';
import { ProductsAdminService } from '../products';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Agregamos CurrencyPipe
import { ReactiveFormsModule } from '@angular/forms';

// --- NUEVAS INTERFACES COMPLETAS ---

interface Category {
  id: number;
  name: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number; // Agregado
  stock: number; // Agregado
  categoryid: number; // Agregado
  imgurl: string; // Se usará para almacenar el nombre del archivo o URL
}

// Interfaz para la respuesta de la API (no necesita cambios, solo buena práctica)
interface ApiResponse {
  message: string;
  data: Product[];
}

@Component({
  standalone: true,
  selector: 'app-products-management',
  templateUrl: './products-management.html',
  styleUrls: ['./products-management.scss'],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe // Aseguramos que el pipe de moneda esté disponible
  ]
})
export class ProductsManagementComponent implements OnInit {
  products: Product[] = []; 
  categories: Category[] = []; // Lista para el SELECT
  selectedFile: File | null = null; // Para la subida de imagen
  productForm: FormGroup;
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  
  constructor(
    private adminService: ProductsAdminService,
    private fb: FormBuilder
  ) {
    // --- INICIALIZACIÓN DEL FORMULARIO CON TODOS LOS NUEVOS CAMPOS ---
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoryid: [null, Validators.required], // El ID de categoría se inicializa en null
      imgurl: ['', Validators.required] // Usado para validar la presencia de la imagen/URL
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  // Carga de categorías simulada (debe venir de la BD)
  loadCategories(): void {
    // Reemplazamos la SIMULACIÓN por la llamada al servicio real
    this.adminService.getCategories().subscribe({
        next: (data) => {
            this.categories = data; // Asigna las categorías reales de la BD
            console.log('Categorías cargadas:', data); 
        },
        error: (err) => {
            console.error('Error al cargar categorías desde la API:', err);
            this.categories = [];
        }
    });
}
  
  loadProducts(): void {
    this.adminService.getAllProducts().subscribe({
      next: (data) => this.products = data, 
      error: (err) => console.error('Error loading products:', err)
    });
  }
  
  // --- FUNCIONES NUEVAS PARA LA TABLA ---

  getCategoryName(id: number): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : 'N/A';
  }

  // Se llama cuando el usuario selecciona un archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.selectedFile = file;
        // Asignamos el nombre del archivo al control para satisfacer la validación de 'imgurl'
        this.productForm.get('imgurl')?.setValue(file.name); 
    } else {
        this.selectedFile = null;
        this.productForm.get('imgurl')?.setValue(null);
    }
  }

  // --- FUNCIONES DEL MODAL ---

  openModal(isEditing: boolean, product?: Product): void {
    this.isEditing = isEditing;
    this.isModalOpen = true;
    this.selectedFile = null; // Resetear archivo seleccionado

    if (this.isEditing && product) {
      // Usar patchValue para no requerir todos los campos si algunos no aplican
      this.productForm.patchValue(product);
      // Nota: No podemos cargar el archivo, solo el string 'imgurl'
    } else {
      // Abrir modal para crear uno nuevo
      // Inicializamos categoryid a null para que el select muestre el placeholder
      this.productForm.reset({ id: null, categoryid: null });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.productForm.reset();
  }

  // --- Lógica CRUD ---

  onSubmit(): void {
    // Usamos markAllAsTouched para mostrar errores si el formulario es inválido
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) {
      console.error('El formulario es inválido. Por favor, complete todos los campos requeridos.');
      return; // Salimos si es inválido
    }

    // Usaremos FormData si hay un archivo seleccionado, de lo contrario JSON
    const dataToSend = this.productForm.value;

    // SIMULACIÓN: Esto debería ser mucho más complejo para subir archivos
    // Aquí, solo enviamos los datos del formulario como JSON
    
    if (this.isEditing && dataToSend.id) {
      // Lógica de EDICIÓN (UPDATE)
      this.adminService.updateProduct(dataToSend.id, dataToSend).subscribe({
        next: () => {
          console.log('Cartera actualizada con éxito.');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al actualizar la cartera:', err);
        }
      });
    } else {
      // Lógica de CREACIÓN (CREATE)
      this.adminService.createProduct(dataToSend).subscribe({
        next: () => {
          console.log('Cartera creada con éxito.');
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al crear la cartera:', err);
        }
      });
    }
  }

  onDelete(product: Product): void {
    // Usamos window.confirm() ya que Angular no recomienda alert() en producción
    if (!product.id) return;
    if (window.confirm(`¿Estás seguro de que quieres eliminar la cartera "${product.name}"?`)) {
      this.adminService.deleteProduct(product.id).subscribe({
        next: () => {
          console.log('Cartera eliminada con éxito.');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error al eliminar la cartera:', err);
        }
      });
    }
  }
}