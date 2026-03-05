import { Component } from '@angular/core';

@Component({
  selector: 'app-benefits',
  standalone: true,
  templateUrl: './benefits.component.html'
})
export class BenefitsComponent {
  benefits = [
    {
      icon: 'pi pi-download',
      title: 'Sin instalar apps',
      description: 'No necesitas descargar nada. Usa el WhatsApp que ya tienes instalado.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: 'pi pi-whatsapp',
      title: 'WhatsApp como interfaz',
      description: 'La app que usas todos los días. Sin curva de aprendizaje.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: 'pi pi-microphone',
      title: 'Texto, audio e imágenes',
      description: 'Registra gastos como prefieras. Escribe, habla o envía una foto del ticket.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: 'pi pi-lock',
      title: 'Seguro y privado',
      description: 'Tus datos están protegidos. Encriptación de extremo a extremo.',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Ideal para uso diario',
      description: 'Registra gastos en segundos. Rápido, simple y efectivo.',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      icon: 'pi pi-desktop',
      title: 'WhatsApp + Dashboard Web',
      description: 'Registra rápido desde WhatsApp en la calle. Analiza profundo en tu PC cuando quieras.',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      icon: 'pi pi-users',
      title: 'Cuentas compartidas',
      description: 'Agrega miembros familiares para llevar las finanzas del hogar entre todos.',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      icon: 'pi pi-envelope',
      title: 'Lectura automática de correos',
      description: 'Detecta compras y suscripciones desde tus correos y las registra automáticamente.',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      icon: 'pi pi-bell',
      title: 'Alertas inteligentes',
      description: 'Recibe avisos cuando te acerques al límite de un presupuesto o detectemos gastos inusuales.',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: 'pi pi-clock',
      title: 'Recordatorios personalizados',
      description: 'Programa recordatorios para pagos de servicios, deudas o cualquier compromiso financiero.',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      icon: 'pi pi-calendar',
      title: 'Boletín semanal',
      description: 'Cada semana recibe un resumen completo de tus finanzas directo a tu WhatsApp.',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      icon: 'pi pi-tag',
      title: 'Ofertas y descuentos',
      description: 'Accede a ofertas exclusivas y descuentos en comercios aliados por ser usuario de Athom.',
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600'
    }
  ];
}
