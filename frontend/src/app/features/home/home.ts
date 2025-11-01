import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ProductCard],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {

  private productService = inject(ProductService);

  productos = computed(() => this.productService.productos());

  novedades = signal([
    { id: 1, titulo: 'Descuentos Fin-Temporada', imagen: 'carousel/1.png' },
    { id: 2, titulo: 'Colección Limitada', imagen: 'carousel/2.png' },
    { id: 3, titulo: 'Nueva Temporada', imagen: 'carousel/3.png' },
  ]);

  ngOnInit(): void {
    this.productService.cargarProductosMock();
  }



}
