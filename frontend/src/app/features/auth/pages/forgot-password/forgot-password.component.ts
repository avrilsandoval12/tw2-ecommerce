import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() { return this.form.controls.email; }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.requestPasswordReset(this.email.value!)
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.successMessage.set(res.message);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Error inesperado');
        }
      });
  }
}