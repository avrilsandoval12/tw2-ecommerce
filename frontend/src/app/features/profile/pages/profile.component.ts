import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getProfile().subscribe({
      next: (response) => {
        this.authService.updateCurrentUser(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.errorMessage.set('Error al cargar el perfil. Intenta nuevamente.');
        this.isLoading.set(false);
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
