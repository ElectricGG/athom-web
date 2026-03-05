import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = false;
  errorMessage: string | null = null;

  loginForm: FormGroup = this.fb.group({
    phone: ['+51 ', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const rawPhone = this.loginForm.get('phone')?.value || '';
    const numeroWhatsapp = rawPhone.replace(/\s/g, '').replace('+', ''); // Clean phone number
    const rememberMe = this.loginForm.value.rememberMe; // Get rememberMe value

    const credentials = {
      numeroWhatsapp: numeroWhatsapp, // Changed from 'email' to 'numeroWhatsapp'
      contrasena: this.loginForm.value.password
    };

    this.authService.login(credentials, rememberMe).pipe( // Pass rememberMe flag
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Número de WhatsApp o contraseña incorrectos. Por favor, intente de nuevo.';
        console.error(err);
      }
    });
  }
}
