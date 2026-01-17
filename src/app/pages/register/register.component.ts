import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    InputMaskModule
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, [Validators.requiredTrue]],
    verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  isVerifying = false;

  onSubmit(): void {
    const mainForm = this.fb.group({
      name: this.registerForm.get('name'),
      email: this.registerForm.get('email'),
      phone: this.registerForm.get('phone'),
      password: this.registerForm.get('password'),
      acceptTerms: this.registerForm.get('acceptTerms')
    });

    if (mainForm.valid) {
      this.isVerifying = true;
    }
  }

  confirmAndCreate(): void {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
    }
  }

  goBackToRegistration(): void {
    this.isVerifying = false;
  }
}
