import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthRegister, RegisterBackendErrors } from '../../../../core/models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string[]>([]);
  successMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  myForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    this.errorMessage.set([]);

    this.isLoading.set(true);

    const credentials: AuthRegister = this.myForm.getRawValue();

    this.authService.register(credentials).subscribe({
      next: (res : any) => {

        this.isLoading.set(false);

        const msg = res?.message || "Registro exitoso, podes iniciar sesión!"
        this.successMessage.set(msg)

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);

      },
      error: (err: HttpErrorResponse) => {

        // Para que los mensajes de error vengan del backend
        const backendErrors = err.error?.errors;

        if (Array.isArray(backendErrors)) {
          this.errorMessage.set(
            backendErrors.map((e: RegisterBackendErrors) => e.msg)
          );
        } else {
          this.errorMessage.set([err.error.error]);
        }

        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
