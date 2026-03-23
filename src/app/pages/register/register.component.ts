import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';

interface VerifyCodeResponse {
  success: boolean;
}

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  iso: string;
  placeholder: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
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

  countries: CountryOption[] = [
    { code: '+51', name: 'Peru', flag: '🇵🇪', iso: 'pe', placeholder: '999 999 999' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽', iso: 'mx', placeholder: '55 1234 5678' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴', iso: 'co', placeholder: '301 234 5678' },
    { code: '+56', name: 'Chile', flag: '🇨🇱', iso: 'cl', placeholder: '9 1234 5678' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷', iso: 'ar', placeholder: '11 1234 5678' },
    { code: '+593', name: 'Ecuador', flag: '🇪🇨', iso: 'ec', placeholder: '99 123 4567' },
    { code: '+591', name: 'Bolivia', flag: '🇧🇴', iso: 'bo', placeholder: '7123 4567' },
    { code: '+595', name: 'Paraguay', flag: '🇵🇾', iso: 'py', placeholder: '981 123 456' },
    { code: '+598', name: 'Uruguay', flag: '🇺🇾', iso: 'uy', placeholder: '94 123 456' },
    { code: '+507', name: 'Panama', flag: '🇵🇦', iso: 'pa', placeholder: '6123 4567' },
    { code: '+506', name: 'Costa Rica', flag: '🇨🇷', iso: 'cr', placeholder: '8312 3456' },
    { code: '+502', name: 'Guatemala', flag: '🇬🇹', iso: 'gt', placeholder: '5123 4567' },
    { code: '+503', name: 'El Salvador', flag: '🇸🇻', iso: 'sv', placeholder: '7012 3456' },
    { code: '+504', name: 'Honduras', flag: '🇭🇳', iso: 'hn', placeholder: '9123 4567' },
    { code: '+505', name: 'Nicaragua', flag: '🇳🇮', iso: 'ni', placeholder: '8123 4567' },
    { code: '+809', name: 'Rep. Dominicana', flag: '🇩🇴', iso: 'do', placeholder: '809 123 4567' },
  ];

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    countryCode: ['+51', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  isLoading = false;
  isSendingCode = false;
  codeSent = false;
  errorMessage: string | null = null;

  get selectedCountry(): CountryOption {
    const code = this.registerForm.get('countryCode')?.value;
    return this.countries.find(c => c.code === code) ?? this.countries[0];
  }

  getIso(code: string): string {
    return this.countries.find(c => c.code === code)?.iso ?? 'pe';
  }

  get phoneNumber(): string {
    const countryCode = this.registerForm.get('countryCode')?.value?.replace('+', '') || '51';
    const rawPhone = this.registerForm.get('phone')?.value || '';
    const cleanPhone = rawPhone.replace(/\s/g, '');
    return countryCode + cleanPhone;
  }

  get isPhoneValid(): boolean {
    const phoneControl = this.registerForm.get('phone');
    return !!(phoneControl?.valid && phoneControl?.value?.trim().length >= 7);
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
    const countryCode = this.registerForm.get('countryCode')?.value?.replace('+', '') || '51';
    const rawPhone = this.registerForm.get('phone')?.value || '';
    const phoneNumber = rawPhone.replace(/\s/g, '');
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
