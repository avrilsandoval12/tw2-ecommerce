import { Component, OnInit, computed, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../shared/interfaces/product.model';
import { Category } from '../../../shared/interfaces/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ProductCard, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = computed<Product[]>(() => this.productService.products());
  categories = computed<Category[]>(() => this.categoryService.categories());

  news = signal([
    { id: 1, titulo: 'Descuentos Fin-Temporada', imagen: 'carousel/1.png' },
    { id: 2, titulo: 'Colección Limitada', imagen: 'carousel/2.png' },
    { id: 3, titulo: 'Nueva Temporada', imagen: 'carousel/3.png' },
  ]);

  @ViewChild('carouselProductos', { static: false }) carouselProductos!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.productService.getAll();
    this.categoryService.getCategories();
  }

  randomProducts = computed<Product[]>(() => {
    const all = this.productService.products();
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  scrollLeft() {
    this.carouselProductos.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carouselProductos.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  goToCategory(catName: string) {
    this.productService.setFilter('category', catName);

    this.router.navigate(['/products']);
  }
}
