import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { UpdateProfileRequest } from '../../../shared/interfaces/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  editForm = signal<UpdateProfileRequest>({});

  isLoading = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

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

  enableEdit(): void {
    const user = this.currentUser();
    if (user) {
      this.editForm.set({
        name: user.name,
        lastname: user.lastname,
        address: user.address,
      });

      this.isEditing.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editForm.set({});
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  saveChanges(): void {
    const form = this.editForm();

    if (!this.validateForm(form)) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.userService.updateProfile(form).subscribe({
      next: (response) => {
        this.currentUser.set(response.data);
        this.authService.updateCurrentUser(response.data);
        this.isEditing.set(false);
        this.successMessage.set(response.message || 'Perfil actualizado con éxito.');
        this.isLoading.set(false);

        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Error al actualizar el perfil. Intenta nuevamente.'
        );
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  private validateForm(form: UpdateProfileRequest): boolean {
    // Validación básica en el frontend
    if (!form.name?.trim() || !form.lastname?.trim() || !form.address?.trim()) {
      this.errorMessage.set('Todos los campos son obligatorios');
      return false;
    }

    if (form.name.trim().length < 2) {
      this.errorMessage.set('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (form.lastname.trim().length < 2) {
      this.errorMessage.set('El apellido debe tener al menos 2 caracteres');
      return false;
    }

    if (form.address.trim().length < 5) {
      this.errorMessage.set('La dirección debe tener al menos 5 caracteres');
      return false;
    }
    return true;
  }
}
