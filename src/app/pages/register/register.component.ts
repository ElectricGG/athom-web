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
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });
  verificationCode = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);

  isVerifying = false;
  isLoading = false;
  errorMessage: string | null = null;

  // Form for the main registration data
  get mainForm(): FormGroup {
    return this.fb.group({
      name: this.registerForm.get('name'),
      email: this.registerForm.get('email'),
      phone: this.registerForm.get('phone'),
      password: this.registerForm.get('password'),
      acceptTerms: this.registerForm.get('acceptTerms')
    });
  }

  sendVerificationCode(): void {
    console.log("Verifyyyyyy");
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const phoneValue = this.registerForm.get('phone')?.value.replace(/\s/g, ''); // Remove spaces
    const payload = { numeroWhatsApp: phoneValue };

    this.http.post(this.sendCodeUrl, payload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.isVerifying = true;
      },
      error: (err) => {
        this.errorMessage = 'Error al enviar el código. Por favor, intente de nuevo.';
        console.error(err);
      }
    });
  }

  confirmAndCreate(): void {
    console.log('Attempting to confirm and create...');
    if (this.verificationCode.invalid) {
      console.log('Verification code is invalid. Errors:', this.verificationCode.errors);
      this.verificationCode.markAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const phoneValue = this.registerForm.get('phone')?.value.replace(/\s/g, ''); // Remove spaces
    const verifyPayload = {
      numeroWhatsApp: phoneValue,
      codigo: this.verificationCode.value
    };

    console.log('Calling verification API with payload:', verifyPayload);
    // 1. Verify Code
    this.http.post(this.verifyCodeUrl, verifyPayload).subscribe({
      next: () => {
        console.log('Verification successful. Proceeding to create user.');
        // 2. Create User if code is valid
        this.createUser();
      },
      error: (err) => {
        console.error('Verification API failed:', err);
        this.isLoading = false;
        this.errorMessage = 'El código de verificación es incorrecto.';
      }
    });
  }

  private createUser(): void {
    const rawPhone = this.registerForm.get('phone')?.value || '';
    const phoneParts = rawPhone.replace('+', '').split(' ');
    const countryCode = phoneParts.length > 1 ? phoneParts[0] : '';
    const phoneNumber = phoneParts.length > 1 ? phoneParts.slice(1).join('') : phoneParts[0];

    const createPayload = {
      nombreUsuario: this.registerForm.get('name')?.value,
      nombres: this.registerForm.get('name')?.value,
      apellidos: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      contrasena: this.registerForm.get('password')?.value,
      codigoPais: countryCode,
      telefono: phoneNumber,
      numeroWhatsapp: countryCode + phoneNumber
    };

    console.log('Calling create user API with payload:', createPayload);
    this.http.post(this.createUserUrl, createPayload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        console.log('User creation successful. Navigating to login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Create user API failed:', err);
        this.errorMessage = 'Error al crear la cuenta. Inténtelo más tarde.';
      }
    });
  }

  goBackToRegistration(): void {
    this.isVerifying = false;
    this.errorMessage = null;
    this.verificationCode.reset();
  }

  resendCode(): void {
    this.sendVerificationCode();
  }
}
