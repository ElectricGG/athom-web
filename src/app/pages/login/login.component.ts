import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../services/auth.service';

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  iso: string;
  placeholder: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    SelectModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

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

  isLoading = false;
  errorMessage: string | null = null;

  loginForm: FormGroup = this.fb.group({
    countryCode: ['+51', [Validators.required]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  get selectedCountry(): CountryOption {
    const code = this.loginForm.get('countryCode')?.value;
    return this.countries.find(c => c.code === code) ?? this.countries[0];
  }

  getIso(code: string): string {
    return this.countries.find(c => c.code === code)?.iso ?? 'pe';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const countryCode = this.loginForm.get('countryCode')?.value?.replace('+', '') || '51';
    const rawPhone = this.loginForm.get('phone')?.value || '';
    const cleanPhone = rawPhone.replace(/\s/g, '');
    const numeroWhatsapp = countryCode + cleanPhone;
    const rememberMe = this.loginForm.value.rememberMe;

    const credentials = {
      numeroWhatsapp: numeroWhatsapp,
      contrasena: this.loginForm.value.password
    };

    this.authService.login(credentials, rememberMe).pipe(
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
