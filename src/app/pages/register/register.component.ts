import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    InputMaskModule,
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  // API Endpoints
  private sendCodeUrl = 'http://localhost:5041/api/auth/whatsapp/send-code';
  private verifyCodeUrl = 'http://localhost:5041/api/auth/whatsapp/verify-code';
  private createUserUrl = 'http://localhost:5041/api/Usuarios';

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    // email: ['', [Validators.required, Validators.email]], // Removed
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });
  verificationCode = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);

  isVerifying = false;
  isLoading = false;
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const rawPhone = this.registerForm.get('phone')?.value || '';
    const phoneParts = rawPhone.replace('+', '').split(' ');
    const countryCode = phoneParts.length > 1 ? phoneParts[0] : '';
    const phoneNumber = phoneParts.length > 1 ? phoneParts.slice(1).join('') : phoneParts[0];

    const createPayload = {
      nombreUsuario: this.registerForm.get('name')?.value,
      nombres: this.registerForm.get('name')?.value,
      apellidos: this.registerForm.get('name')?.value,
      email: '', // Always send empty string
      contrasena: this.registerForm.get('password')?.value,
      codigoPais: countryCode,
      telefono: phoneNumber,
      numeroWhatsapp: countryCode + phoneNumber
    };

    // 1. Create User
    this.http.post(this.createUserUrl, createPayload).subscribe({
      next: () => {
        // 2. Send verification code
        this.executeSendCode();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al crear la cuenta. El email ya podría estar en uso.';
        console.error(err);
      }
    });
  }

  private executeSendCode(): void {
    this.isLoading = true; // Keep loading state
    const phoneValue = this.registerForm.get('phone')?.value.replace(/\s/g, '').replace('+', ''); // Remove '+'
    const payload = { numeroWhatsApp: phoneValue };

    this.http.post(this.sendCodeUrl, payload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.isVerifying = true;
      },
      error: (err) => {
        this.errorMessage = 'Cuenta creada, pero hubo un error al enviar el código de verificación.';
        console.error(err);
      }
    });
  }

  confirmAndCreate(): void {
    console.log('--- Debugging confirmAndCreate ---');
    console.log('Function triggered.');
    console.log('isLoading flag:', this.isLoading);
    console.log('Verification control status:', this.verificationCode.status);
    console.log('Verification control value:', `'${this.verificationCode.value}'`);
    console.log('Verification control errors:', this.verificationCode.errors);

    if (this.verificationCode.invalid) {
      console.log('Verification code is INVALID. Returning...');
      this.verificationCode.markAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const phoneValue = this.registerForm.get('phone')?.value.replace(/\s/g, '').replace('+', ''); // Remove '+'
    const verifyPayload = {
      numeroWhatsApp: phoneValue,
      codigo: this.verificationCode.value
    };

    console.log('Code is valid. Proceeding to call verification API with payload:', verifyPayload);
    // Verify Code and then redirect
    this.http.post(this.verifyCodeUrl, verifyPayload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        console.log('Verification successful. Navigating to /login');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'El código de verificación es incorrecto.';
        console.error('Verification API failed:', err);
      }
    });
  }

  goBackToRegistration(): void {
    // This action is less meaningful now, as the user is already created.
    // For simplicity, we'll just navigate them to the login page.
    this.router.navigate(['/login']);
  }

  resendCode(): void {
    // We don't want to create the user again, just resend the code.
    this.executeSendCode();
  }
}

