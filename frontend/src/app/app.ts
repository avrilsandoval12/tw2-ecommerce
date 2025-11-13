import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component'
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  private router = inject(Router);
  private authService = inject(AuthService);

  // Rutas donde NO queremos mostrar el header
  private readonly noHeaderRoutes = ['/login', '/register'];


}

