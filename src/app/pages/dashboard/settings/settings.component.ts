import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PerfilService } from '../../../services/perfil.service';
import { AuthService } from '../../../services/auth.service';
import { Perfil } from '../../../models/perfil.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly perfilService = inject(PerfilService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  perfilForm: FormGroup = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
  });

  isLoading = true;
  isSaving = false;
  perfil: Perfil | null = null;

  notifications = [
    {
      key: 'whatsapp',
      label: 'Notificaciones WhatsApp',
      description: 'Recibe alertas y recordatorios por WhatsApp',
      enabled: true
    },
    {
      key: 'email',
      label: 'Notificaciones por email',
      description: 'Recibe resúmenes semanales por correo',
      enabled: true
    },
    {
      key: 'budget',
      label: 'Alertas de presupuesto',
      description: 'Te avisamos cuando alcances el 80% del límite',
      enabled: true
    },
    {
      key: 'reminders',
      label: 'Recordatorios de pago',
      description: 'No olvides tus pagos importantes',
      enabled: true
    },
    {
      key: 'tips',
      label: 'Consejos financieros',
      description: 'Recibe tips personalizados de ahorro',
      enabled: false
    }
  ];

  ngOnInit(): void {
    this.loadPerfil();
  }

  private loadPerfil(): void {
    this.isLoading = true;
    this.perfilService.getPerfil().subscribe({
      next: (perfil) => {
        this.perfil = perfil;
        this.perfilForm.patchValue({
          nombreUsuario: perfil.nombreUsuario
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el perfil'
        });
        this.isLoading = false;
      }
    });
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const request = this.perfilForm.value;

    this.perfilService.updatePerfil(request).subscribe({
      next: (perfil) => {
        this.perfil = perfil;
        this.authService.updateUserName(perfil.nombreUsuario);
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Perfil actualizado correctamente'
        });
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo actualizar el perfil'
        });
        this.isSaving = false;
      }
    });
  }

  getUserInitial(): string {
    return this.perfil?.nombreUsuario?.charAt(0).toUpperCase() || '?';
  }
}
