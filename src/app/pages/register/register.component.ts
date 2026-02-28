import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';

interface VerifyCodeResponse {
  success: boolean;
}

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

  private readonly sendCodeUrl = `${environment.apiUrl}/auth/whatsapp/send-code`;
  private readonly verifyCodeUrl = `${environment.apiUrl}/auth/whatsapp/verify-code`;
  private readonly createUserUrl = `${environment.apiUrl}/Usuarios`;

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required]],
    verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  isLoading = false;
  isSendingCode = false;
  codeSent = false;
  errorMessage: string | null = null;

  get phoneNumber(): string {
    const rawPhone = this.registerForm.get('phone')?.value || '';
    return rawPhone.replace(/\s/g, '').replace('+', '');
  }

  get isPhoneValid(): boolean {
    const phoneControl = this.registerForm.get('phone');
    return !!(phoneControl?.valid && phoneControl?.value?.length > 0);
  }

  get canSubmit(): boolean {
    return this.registerForm.valid && this.codeSent;
  }

  sendVerificationCode(): void {
    if (!this.isPhoneValid) {
      this.registerForm.get('phone')?.markAsTouched();
      return;
    }

    this.isSendingCode = true;
    this.errorMessage = null;

    const payload = { numeroWhatsApp: this.phoneNumber };

    this.http.post(this.sendCodeUrl, payload).pipe(
      finalize(() => this.isSendingCode = false)
    ).subscribe({
      next: () => {
        this.codeSent = true;
      },
      error: () => {
        this.errorMessage = 'Error al enviar el código de verificación. Intenta nuevamente.';
      }
    });
  }

  onSubmit(): void {
    if (!this.canSubmit) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.verifyCode();
  }

  private verifyCode(): void {
    const verifyPayload = {
      numeroWhatsApp: this.phoneNumber,
      codigo: this.registerForm.get('verificationCode')?.value
    };

    this.http.post<VerifyCodeResponse>(this.verifyCodeUrl, verifyPayload).subscribe({
      next: (response) => {
        if (response.success) {
          this.createUser();
        } else {
          this.isLoading = false;
          this.errorMessage = 'El código de verificación es incorrecto.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'El código de verificación es incorrecto.';
      }
    });
  }

  private createUser(): void {
    const createPayload = this.buildUserPayload();

    this.http.post(this.createUserUrl, createPayload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Error al crear la cuenta. El número ya podría estar en uso.';
      }
    });
  }

  private buildUserPayload(): object {
    const rawPhone = this.registerForm.get('phone')?.value || '';
    const phoneParts = rawPhone.replace('+', '').split(' ');
    const countryCode = phoneParts.length > 1 ? phoneParts[0] : '';
    const phoneNumber = phoneParts.length > 1 ? phoneParts.slice(1).join('') : phoneParts[0];
    const name = this.registerForm.get('name')?.value;

    return {
      nombreUsuario: name,
      nombres: name,
      apellidos: name,
      email: '',
      contrasena: this.registerForm.get('password')?.value,
      codigoPais: countryCode,
      telefono: phoneNumber,
      numeroWhatsapp: countryCode + phoneNumber
    };
  }

  resendCode(): void {
    this.sendVerificationCode();
  }
}
