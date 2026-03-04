import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PerfilService } from '../../../services/perfil.service';
import { AuthService } from '../../../services/auth.service';
import { PreferenciaNotificacionService } from '../../../services/preferencia-notificacion.service';
import { EmailIntegrationService } from '../../../services/email-integration.service';
import { Perfil } from '../../../models/perfil.model';
import { PreferenciaNotificacion } from '../../../models/preferencia-notificacion.model';
import { EmailVinculadoInfo, ProveedorEmail, getProveedorNombre } from '../../../models/email-integration.model';

interface NotificationItem {
  key: string;
  label: string;
  description: string;
  field: keyof PreferenciaNotificacion;
  enabled: boolean;
}

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
    ToastModule,
    TagModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly perfilService = inject(PerfilService);
  private readonly authService = inject(AuthService);
  private readonly preferenciaService = inject(PreferenciaNotificacionService);
  private readonly emailIntegrationService = inject(EmailIntegrationService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  perfilForm: FormGroup = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
  });

  isLoading = true;
  isSaving = false;
  isLoadingNotifications = true;
  isSavingNotifications = false;
  perfil: Perfil | null = null;

  // Email Integration
  isLoadingEmailIntegration = true;
  isConnectingOutlook = false;
  isConnectingGmail = false;
  isDisconnectingOutlook = false;
  isDisconnectingGmail = false;
  outlookAccount: EmailVinculadoInfo | null = null;
  gmailAccount: EmailVinculadoInfo | null = null;

  notifications: NotificationItem[] = [
    {
      key: 'whatsapp',
      label: 'Alerta de consumos detectado en correo',
      description: 'Recibe alertas de consumos detectados en tu correo a través de WhatsApp',
      field: 'alertasConsumo',
      enabled: true
    },
    {
      key: 'reminders',
      label: 'Recordatorios de pago',
      description: 'Recibe recordatorios de pagos por whatsapp',
      field: 'recordatoriosPago',
      enabled: true
    },
    {
      key: 'newsletter',
      label: 'Boletín semanal',
      description: 'Recibe un correo semanal con consejos prácticos para mejorar tus finanzas.',
      field: 'boletinSemanal',
      enabled: true
    },
    {
      key: 'offers',
      label: 'Ofertas y descuentos',
      description: 'Entérate de promociones exclusivas y descuentos de nuestros aliados por whatsapp y correo.',
      field: 'ofertasDescuentos',
      enabled: true
    }
  ];

  ngOnInit(): void {
    this.loadPerfil();
    this.loadNotificationPreferences();
    this.loadEmailIntegrationStatus();
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

  private loadNotificationPreferences(): void {
    this.isLoadingNotifications = true;
    this.preferenciaService.getPreferencias().subscribe({
      next: (preferencias) => {
        this.notifications = this.notifications.map(n => ({
          ...n,
          enabled: preferencias[n.field] as boolean
        }));
        this.isLoadingNotifications = false;
      },
      error: (error) => {
        console.error('Error loading notification preferences:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las preferencias de notificación'
        });
        this.isLoadingNotifications = false;
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

  onNotificationChange(): void {
    this.guardarNotificaciones();
  }

  private guardarNotificaciones(): void {
    this.isSavingNotifications = true;

    const request = {
      alertasConsumo: this.getNotificationValue('alertasConsumo'),
      recordatoriosPago: this.getNotificationValue('recordatoriosPago'),
      boletinSemanal: this.getNotificationValue('boletinSemanal'),
      ofertasDescuentos: this.getNotificationValue('ofertasDescuentos')
    };

    this.preferenciaService.updatePreferencias(request).subscribe({
      next: () => {
        this.isSavingNotifications = false;
      },
      error: (error) => {
        console.error('Error saving notification preferences:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron guardar las preferencias'
        });
        this.isSavingNotifications = false;
        // Reload to restore previous state
        this.loadNotificationPreferences();
      }
    });
  }

  private getNotificationValue(field: string): boolean {
    const notification = this.notifications.find(n => n.field === field);
    return notification?.enabled ?? false;
  }

  getUserInitial(): string {
    return this.perfil?.nombreUsuario?.charAt(0).toUpperCase() || '?';
  }

  // ==================== Email Integration ====================

  private loadEmailIntegrationStatus(): void {
    this.isLoadingEmailIntegration = true;
    this.emailIntegrationService.getStatus().subscribe({
      next: (response) => {
        const cuentas = response.cuentas ?? [];
        this.outlookAccount = cuentas.find(c => c.proveedor === ProveedorEmail.Outlook) ?? null;
        this.gmailAccount = cuentas.find(c => c.proveedor === ProveedorEmail.Gmail) ?? null;
        this.isLoadingEmailIntegration = false;
      },
      error: (error) => {
        console.error('Error loading email integration status:', error);
        this.outlookAccount = null;
        this.gmailAccount = null;
        this.isLoadingEmailIntegration = false;
      }
    });
  }

  connectOutlook(): void {
    this.isConnectingOutlook = true;
    this.emailIntegrationService.connect().subscribe({
      next: (response) => {
        window.location.href = response.authorizationUrl;
      },
      error: (error) => {
        console.error('Error connecting Outlook:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo iniciar la vinculación con Outlook'
        });
        this.isConnectingOutlook = false;
      }
    });
  }

  connectGmail(): void {
    this.isConnectingGmail = true;
    this.emailIntegrationService.connectGmail().subscribe({
      next: (response) => {
        window.location.href = response.authorizationUrl;
      },
      error: (error) => {
        console.error('Error connecting Gmail:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo iniciar la vinculación con Gmail'
        });
        this.isConnectingGmail = false;
      }
    });
  }

  disconnectProvider(proveedor: ProveedorEmail): void {
    const providerName = proveedor === ProveedorEmail.Gmail ? 'Gmail' : 'Microsoft Outlook';

    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas desvincular tu cuenta de ${providerName}? Ya no recibirás notificaciones de consumos detectados de esta cuenta.`,
      header: 'Confirmar desvinculación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, desvincular',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.performDisconnect(proveedor)
    });
  }

  private performDisconnect(proveedor: ProveedorEmail): void {
    const isGmail = proveedor === ProveedorEmail.Gmail;

    if (isGmail) {
      this.isDisconnectingGmail = true;
    } else {
      this.isDisconnectingOutlook = true;
    }

    this.emailIntegrationService.disconnect(proveedor).subscribe({
      next: () => {
        if (isGmail) {
          this.gmailAccount = null;
          this.isDisconnectingGmail = false;
        } else {
          this.outlookAccount = null;
          this.isDisconnectingOutlook = false;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Desvinculado',
          detail: `Tu cuenta de ${isGmail ? 'Gmail' : 'Outlook'} ha sido desvinculada exitosamente`,
          life: 5000
        });
        setTimeout(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Tip',
            detail: isGmail
              ? 'Para revocar permisos completamente, visita myaccount.google.com/permissions'
              : 'Para revocar permisos completamente, visita account.live.com/consent/Manage',
            life: 8000
          });
        }, 1000);
      },
      error: (error) => {
        console.error('Error disconnecting:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo desvincular la cuenta de correo'
        });
        if (isGmail) {
          this.isDisconnectingGmail = false;
        } else {
          this.isDisconnectingOutlook = false;
        }
      }
    });
  }

  get isPremium(): boolean {
    return this.perfil?.planNombre?.toLowerCase() === 'premium';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return 'S/ 0.00';
    return `S/ ${amount.toFixed(2)}`;
  }
}
