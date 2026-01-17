import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    PasswordModule
  ],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  selectedCurrency = 'PEN';

  currencies = [
    { label: 'Sol Peruano (S/)', value: 'PEN' },
    { label: 'Dólar (US$)', value: 'USD' },
    { label: 'Euro (€)', value: 'EUR' }
  ];

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
}
